"use client";

import {
  Camera,
  ChevronDown,
  ChevronUp,
  Gift,
  Home,
  LoaderCircle,
  LogOut,
  MessageCircle,
  PenSquare,
  Search,
  Settings,
  User,
  Users,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLogoutMutation } from "@/src/features/auth/authApi";
import { useAppDispatch, useAppSelector } from "@/src/hooks/reduxHooks";
import {
  cacheRecentUserName,
  cacheRecentUserNames,
  clearRecentSearchRows,
  clearRecentUserNames,
  removeRecentSearchRow,
  removeRecentUserName,
  selectRecentSearchRows,
  selectRecentUserNameMap,
  setRecentSearchRows,
  upsertRecentSearchRow
} from "@/src/features/users/usersSlice";
import {
  useClearLastSearchedUsersMutation,
  useGetLastSearchedUsersQuery,
  useLazySearchUsersQuery,
  useRemoveUserSearchClickMutation,
  useSaveUserSearchClickMutation,
  useSearchUsersQuery
} from "@/src/features/users/usersApi";
import AppLogo from "./AppLogo";

const navItems = [
  { key: "discover", href: "/discover", icon: Home },
  { key: "giftMarket", href: "/gifts", icon: Gift },
  { key: "messages", href: "/messages", icon: MessageCircle, badge: "3" },
  { key: "friends", href: "/friends", icon: Users },
  { key: "profile", href: "/profile", icon: User }
];
const createItems = [
  { key: "post", href: "/posts", icon: PenSquare, activeKey: "posts" },
  { key: "story", href: "/stories", icon: Camera, activeKey: "stories" }
];
const EMPTY_USERS = Object.freeze([]);

function hasMeaningfulUserName(value) {
  const normalized = String(value ?? "").trim();
  if (!normalized) return false;

  const isGenericUser = normalized.toLowerCase() === "user";
  const isUserWithId = /^user\s*#\s*[\w-]+$/i.test(normalized);
  return !isGenericUser && !isUserWithId;
}

function buildRowsSignature(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return "";

  return rows
    .map((row) => {
      const id = String(row?.user_id ?? row?.id ?? "").trim();
      const searchName = String(row?.search_name ?? "").trim();
      const name = String(row?.name ?? row?.full_name ?? "").trim();
      return `${id}:${searchName}:${name}`;
    })
    .join("|");
}

function formatUserLabel(user, cachedNameById, fallbackIndex = 0) {
  const rawId = user?.user_id ?? user?.id;
  const cachedName = cachedNameById?.[String(rawId ?? "").trim()];
  if (hasMeaningfulUserName(cachedName)) return cachedName;

  const rawName = user?.name ?? user?.full_name;
  if (hasMeaningfulUserName(rawName)) return String(rawName).trim();
  if (typeof rawName === "number") return `User #${rawName}`;

  if (typeof rawId === "string" || typeof rawId === "number") {
    const idText = String(rawId).trim();
    if (idText) return `User #${idText}`;
  }

  return `User #${fallbackIndex + 1}`;
}

export default function Sidebar({ activePageKey, isMobileOpen = false, onCloseMobile }) {
  const t = useTranslations("sidebar");
  const dispatch = useAppDispatch();
  const recentNameById = useAppSelector(selectRecentUserNameMap);
  const recentSearchRows = useAppSelector(selectRecentSearchRows);
  const router = useRouter();
  const searchWrapRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [saveUserSearchClick] = useSaveUserSearchClickMutation();
  const [triggerSearchUsersByName] = useLazySearchUsersQuery();
  const [removeUserSearchClick, { isLoading: isRemovingRecent }] = useRemoveUserSearchClickMutation();
  const [clearLastSearchedUsers, { isLoading: isClearingRecent }] = useClearLastSearchedUsersMutation();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!searchWrapRef.current?.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const isCreateSectionActive = activePageKey === "stories" || activePageKey === "posts";
  const isCreateExpanded = isCreateOpen || isCreateSectionActive;

  const { data: searchUsersData, isFetching: isSearchingUsers } = useSearchUsersQuery(debouncedQuery, {
    skip: !isSearchOpen || debouncedQuery.length === 0
  });
  const { data: recentUsersData, isFetching: isLoadingRecentUsers, refetch: refetchRecentUsers } = useGetLastSearchedUsersQuery(undefined, {
    skip: !isSearchOpen,
    refetchOnMountOrArgChange: true
  });
  const searchUsers = Array.isArray(searchUsersData) ? searchUsersData : EMPTY_USERS;
  const recentUsers = Array.isArray(recentUsersData) ? recentUsersData : EMPTY_USERS;

  useEffect(() => {
    if (isSearchOpen) {
      refetchRecentUsers();
    }
  }, [isSearchOpen, refetchRecentUsers]);

  const showingSearchResults = debouncedQuery.length > 0;
  const sidebarUsers = useMemo(() => (showingSearchResults ? searchUsers : recentSearchRows), [
    showingSearchResults,
    searchUsers,
    recentSearchRows
  ]);
  const isSearchLoading = showingSearchResults ? isSearchingUsers : isLoadingRecentUsers;
  const recentUsersSignature = useMemo(() => buildRowsSignature(recentUsers), [recentUsers]);
  const cachedRecentRowsSignature = useMemo(() => buildRowsSignature(recentSearchRows), [recentSearchRows]);

  useEffect(() => {
    if (!isSearchOpen || showingSearchResults) return;
    if (recentUsersSignature === cachedRecentRowsSignature) return;

    dispatch(setRecentSearchRows(recentUsers));
    dispatch(cacheRecentUserNames(recentUsers));
  }, [
    cachedRecentRowsSignature,
    dispatch,
    isSearchOpen,
    recentUsers,
    recentUsersSignature,
    showingSearchResults
  ]);

  useEffect(() => {
    if (!isSearchOpen || showingSearchResults || !recentSearchRows.length) return;

    const unresolvedRows = recentSearchRows.filter((row) => {
      const idKey = String(row?.user_id ?? row?.id ?? "").trim();
      if (!idKey) return false;
      if (hasMeaningfulUserName(recentNameById[idKey])) return false;
      return typeof row?.search_name === "string" && row.search_name.trim().length > 0;
    });

    if (!unresolvedRows.length) return;

    const unresolvedIds = new Set(
      unresolvedRows.map((row) => String(row?.user_id ?? row?.id ?? "").trim()).filter(Boolean)
    );
    const uniqueSearchNames = [...new Set(unresolvedRows.map((row) => row.search_name.trim()))];
    let cancelled = false;

    (async () => {
      for (const searchName of uniqueSearchNames) {
        try {
          const users = await triggerSearchUsersByName(searchName, false).unwrap();
          if (cancelled) return;

          const matches = users.filter((user) =>
            unresolvedIds.has(String(user?.user_id ?? user?.id ?? "").trim())
          );

          if (matches.length) {
            dispatch(cacheRecentUserNames(matches));
          }
        } catch (error) {
          console.error("Failed to resolve recent search names", error);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch, isSearchOpen, recentNameById, recentSearchRows, showingSearchResults, triggerSearchUsersByName]);

  async function handlePickUser(user) {
    dispatch(cacheRecentUserName(user));
    dispatch(upsertRecentSearchRow(user));
    setSearchQuery("");
    setDebouncedQuery("");
    setIsSearchOpen(false);

    try {
      await saveUserSearchClick(user).unwrap();
    } catch (error) {
      console.error("Failed to save recent searched user", error);
    }
  }

  async function handleRemoveRecentUser(user, event) {
    event.stopPropagation();
    const id = user?.user_id ?? user?.id;
    dispatch(removeRecentUserName(id));
    dispatch(removeRecentSearchRow(id));

    try {
      await removeUserSearchClick(user).unwrap();
    } catch (error) {
      console.error("Failed to remove recent searched user", error);
    }
  }

  async function handleClearRecentUsers() {
    dispatch(clearRecentSearchRows());
    dispatch(clearRecentUserNames());
    try {
      await clearLastSearchedUsers().unwrap();
    } catch (error) {
      console.error("Failed to clear recent searches", error);
    }
  }

  async function handleLogout() {
    try {
      await logout().unwrap();
    } catch {
      // The logout mutation clears local auth state even if the server rejects the token.
    } finally {
      onCloseMobile?.();
      router.replace("/");
    }
  }

  return (
    <aside className={`discover-sidebar ${isMobileOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-logo">
        <AppLogo />
        <button type="button" className="sidebar-mobile-close" onClick={onCloseMobile} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      <div className="sidebar-search-wrap" ref={searchWrapRef}>
        <div className="sidebar-search" role="search">
          <Search size={17} />
          <input
            type="search"
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchAriaLabel")}
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              if (!isSearchOpen) {
                setIsSearchOpen(true);
              }
            }}
          />
          {isSearchLoading ? <LoaderCircle className="sidebar-search-loader" size={15} /> : null}
        </div>

        {isSearchOpen ? (
          <div className="sidebar-search-dropdown" role="listbox">
            {!showingSearchResults ? (
              <div className="sidebar-search-head">
                <strong>{t("recentSearches")}</strong>
                {recentSearchRows.length ? (
                  <button type="button" onClick={handleClearRecentUsers} disabled={isClearingRecent}>
                    {t("clearAll")}
                  </button>
                ) : null}
              </div>
            ) : null}

            {sidebarUsers.length ? (
              sidebarUsers.map((user, index) => {
                const userLabel = formatUserLabel(user, recentNameById, index);
                const userKey = String(user?.id ?? user?.user_id ?? `recent-${index}`);

                return (
                <div className="sidebar-search-item" key={userKey}>
                  <button type="button" onClick={() => handlePickUser(user)}>
                    {userLabel}
                  </button>

                  {!showingSearchResults ? (
                    <button
                      type="button"
                      className="sidebar-search-item-remove"
                      aria-label={t("removeRecentAria", { name: userLabel })}
                      onClick={(event) => handleRemoveRecentUser(user, event)}
                      disabled={isRemovingRecent}
                    >
                      <X size={12} />
                    </button>
                  ) : null}
                </div>
                );
              })
            ) : (
              <p className="sidebar-search-empty">
                {showingSearchResults ? t("noUsersFound") : t("noRecentSearches")}
              </p>
            )}
          </div>
        ) : null}
      </div>

      <nav className="side-nav" aria-label={t("navAriaLabel")}>
        {navItems.slice(0, 2).map(({ key, href, icon: Icon, badge }) => {
          const label = t(`items.${key}`);

          return (
            <Link
              className={`side-nav-item ${key === activePageKey ? "active" : ""}`}
              href={href}
              key={key}
              onClick={onCloseMobile}
            >
              <span className="nav-icon">
                <Icon size={19} strokeWidth={1.9} />
                {badge ? <span className="nav-badge">{badge}</span> : null}
              </span>
              {label}
            </Link>
          );
        })}

        <div className={`side-nav-create ${isCreateExpanded ? "open" : ""}`}>
          <button
            type="button"
            className={`side-nav-item ${isCreateSectionActive ? "active" : ""}`}
            onClick={() => setIsCreateOpen((value) => !value)}
            aria-expanded={isCreateExpanded}
          >
            <span className="nav-icon">
              <PenSquare size={19} strokeWidth={1.9} />
            </span>
            {t("items.create")}
            <span className="side-nav-create-arrow" aria-hidden="true">
              {isCreateExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </button>

          {isCreateExpanded ? (
            <div className="side-nav-create-menu">
              {createItems.map(({ key, href, icon: Icon, activeKey }) => (
                <Link
                  key={key}
                  href={href}
                  className={`side-nav-create-item ${activePageKey === activeKey ? "active" : ""}`}
                  onClick={onCloseMobile}
                >
                  <span className="nav-icon">
                    <Icon size={17} strokeWidth={1.9} />
                  </span>
                  {t(`create.${key}`)}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {navItems.slice(2).map(({ key, href, icon: Icon, badge }) => {
          const label = t(`items.${key}`);

          return (
            <Link
              className={`side-nav-item ${key === activePageKey ? "active" : ""}`}
              href={href}
              key={key}
              onClick={onCloseMobile}
            >
              <span className="nav-icon">
                <Icon size={19} strokeWidth={1.9} />
                {badge ? <span className="nav-badge">{badge}</span> : null}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link className={activePageKey === "settings" ? "active" : ""} href="/settings" onClick={onCloseMobile}>
          <Settings size={17} />
          {t("settings")}
        </Link>
        <button
          className="logout-link"
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut size={17} />
          {t("logout")}
        </button>
      </div>
    </aside>
  );
}
