"use client";

import { Check, ChevronLeft, ChevronRight, Filter, Heart, Search, SendHorizontal, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useGetDiscoverPeopleQuery,
  useGetDiscoverStoriesQuery
} from "@/src/features/discover/discoverApi";
import PeopleGridSkeleton from "@/src/features/discover/components/PeopleGridSkeleton";
import DashboardShell from "./DashboardShell";
import ProfileAvatarPlaceholder from "./ProfileAvatarPlaceholder";
import SectionTitle from "./SectionTitle";

function formatStoryRelativeTime(createdAt, locale, fallback) {
  if (!createdAt) return fallback;

  const createdAtMs = new Date(createdAt).getTime();
  if (Number.isNaN(createdAtMs)) return fallback;

  const diffSeconds = Math.round((createdAtMs - Date.now()) / 1000);
  const absSeconds = Math.abs(diffSeconds);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (absSeconds < 60) return rtf.format(diffSeconds, "second");
  if (absSeconds < 60 * 60) return rtf.format(Math.round(diffSeconds / 60), "minute");
  if (absSeconds < 60 * 60 * 24) return rtf.format(Math.round(diffSeconds / (60 * 60)), "hour");
  if (absSeconds < 60 * 60 * 24 * 30) return rtf.format(Math.round(diffSeconds / (60 * 60 * 24)), "day");

  return rtf.format(Math.round(diffSeconds / (60 * 60 * 24 * 30)), "month");
}

function StoryViewer({ storyGroup, activeIndex, onClose, onPrevious, onNext }) {
  const t = useTranslations("discover");
  const locale = useLocale();

  if (!storyGroup || activeIndex === null) return null;

  const storyItems = storyGroup.stories;
  const activeStory = storyItems[activeIndex];
  if (!activeStory) return null;
  const storyAgeText = formatStoryRelativeTime(activeStory.createdAt, locale, t("storyViewer.timeAgo"));

  return (
    <div className="story-viewer-overlay" role="presentation" onClick={onClose}>
      <section
        className="story-viewer-panel"
        role="dialog"
        aria-modal="true"
        aria-label={t("storyViewer.dialogAria")}
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={activeStory.image}
          alt={t("storyImageAlt", { name: activeStory.name })}
          fill
          unoptimized
          sizes="(max-width: 620px) 96vw, 420px"
          className="story-viewer-image"
        />

        <div className="story-viewer-top">
          <div className="story-viewer-progress" aria-hidden="true">
            {storyItems.map((story, index) => (
              <span
                key={`${story.name}-${index}`}
                className={
                  index < activeIndex
                    ? "done"
                    : index === activeIndex
                      ? "active"
                      : ""
                }
              >
                <i />
              </span>
            ))}
          </div>

          <header className="story-viewer-header">
            <div className="story-viewer-account">
              <span className="story-viewer-avatar">
                <Image
                  src={storyGroup.avatar ?? activeStory.avatar ?? activeStory.image}
                  alt={storyGroup.name}
                  fill
                  unoptimized
                  sizes="32px"
                />
              </span>
              <strong>{storyGroup.name}</strong>
              <small>{storyAgeText}</small>
            </div>

            <button type="button" onClick={onClose} aria-label={t("storyViewer.closeAria")}>
              <X size={18} />
            </button>
          </header>
        </div>

        <button type="button" className="story-viewer-zone left" onClick={onPrevious} aria-label={t("storyViewer.previousAria")}>
          <span>
            <ChevronLeft size={22} />
          </span>
        </button>
        <button type="button" className="story-viewer-zone right" onClick={onNext} aria-label={t("storyViewer.nextAria")}>
          <span>
            <ChevronRight size={22} />
          </span>
        </button>

        <footer className="story-viewer-footer">
          <label className="story-viewer-reply">
            <input type="text" placeholder={t("storyViewer.replyPlaceholder")} />
          </label>
          <button type="button" className="story-viewer-send" aria-label={t("storyViewer.sendReplyAria")}>
            <SendHorizontal size={19} />
          </button>
        </footer>
      </section>
    </div>
  );
}

function Stories() {
  const router = useRouter();
  const t = useTranslations("discover");
  const { data: storyItems = [] } = useGetDiscoverStoriesQuery();
  const [activeGroupIndex, setActiveGroupIndex] = useState(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);

  const storyGroups = useMemo(() => {
    const grouped = new Map();

    storyItems.forEach((story, index) => {
      const keyBase = String(story?.userId ?? "").trim();
      const fallbackKey = `${String(story?.name ?? "").trim()}|${String(story?.avatar ?? "").trim()}`;
      const groupKey = keyBase || fallbackKey || `story-user-${index}`;

      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, {
          id: keyBase || groupKey,
          name: story?.name ?? "User",
          avatar: story?.avatar ?? story?.image ?? "",
          stories: []
        });
      }

      grouped.get(groupKey).stories.push(story);
    });

    const groups = [...grouped.values()].map((group) => ({
      ...group,
      stories: [...group.stories].sort((a, b) => {
        const dateA = new Date(a?.createdAt ?? 0).getTime();
        const dateB = new Date(b?.createdAt ?? 0).getTime();
        return dateA - dateB;
      })
    }));

    return groups.sort((a, b) => {
      const oldestA = new Date(a.stories[0]?.createdAt ?? 0).getTime();
      const oldestB = new Date(b.stories[0]?.createdAt ?? 0).getTime();
      return oldestA - oldestB;
    });
  }, [storyItems]);

  const activeStoryGroup = activeGroupIndex === null ? null : (storyGroups[activeGroupIndex] ?? null);

  useEffect(() => {
    if (activeGroupIndex === null) return;

    function onEscape(event) {
      if (event.key === "Escape") {
        setActiveGroupIndex(null);
        setActiveStoryIndex(null);
      }
    }

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [activeGroupIndex]);

  const showPreviousStory = useCallback(() => {
    if (!activeStoryGroup?.stories?.length) return;

    setActiveStoryIndex((current) => {
      if (current === null) return 0;
      return (current - 1 + activeStoryGroup.stories.length) % activeStoryGroup.stories.length;
    });
  }, [activeStoryGroup]);

  const showNextStory = useCallback(() => {
    if (!activeStoryGroup?.stories?.length) return;

    setActiveStoryIndex((current) => {
      if (current === null) return 0;
      return (current + 1) % activeStoryGroup.stories.length;
    });
  }, [activeStoryGroup]);

  useEffect(() => {
    if (activeStoryIndex === null || activeGroupIndex === null) return;

    const timer = window.setTimeout(() => {
      showNextStory();
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [activeGroupIndex, activeStoryIndex, showNextStory]);

  useEffect(() => {
    if (activeStoryIndex === null || activeGroupIndex === null) return;

    function onArrowKeys(event) {
      if (event.key === "ArrowLeft") {
        showPreviousStory();
      }
      if (event.key === "ArrowRight") {
        showNextStory();
      }
    }

    window.addEventListener("keydown", onArrowKeys);
    return () => window.removeEventListener("keydown", onArrowKeys);
  }, [activeGroupIndex, activeStoryIndex, showNextStory, showPreviousStory]);

  function openStoryGroup(index) {
    setActiveGroupIndex(index);
    setActiveStoryIndex(0);
  }

  return (
    <>
      <section className="discover-section">
        <SectionTitle icon={Sparkles} iconProps={{ size: 22 }} title={t("storiesHeading")} />

        <div className="stories-row">
          <div className="story-item">
            <button
              className="your-story"
              type="button"
              aria-label={t("yourStoryAria")}
              onClick={() => router.push("/stories")}
            >
              +
            </button>
            <span>{t("yourStory")}</span>
          </div>

          {storyGroups.map((group, index) => (
            <div className="story-item" key={group.id ?? `${group.name}-${index}`}>
              <button
                type="button"
                className="story-open-button"
                onClick={() => openStoryGroup(index)}
                aria-label={t("storyViewer.openAria", { name: group.name })}
              >
                <Image
                  className="story-image"
                  src={group.avatar || group.stories[0]?.avatar || group.stories[0]?.image}
                  alt={t("storyImageAlt", { name: group.name })}
                  width={121}
                  height={121}
                  unoptimized
                />
              </button>
              <span>{group.name}</span>
            </div>
          ))}
        </div>
      </section>

      <StoryViewer
        storyGroup={activeStoryGroup}
        activeIndex={activeStoryIndex}
        onClose={() => {
          setActiveGroupIndex(null);
          setActiveStoryIndex(null);
        }}
        onPrevious={showPreviousStory}
        onNext={showNextStory}
      />
    </>
  );
}

function ProfileCard({ person }) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="profile-card profile-card-button"
      onClick={() => router.push(`/profile-view/${person.id}`)}
    >
      {person.image ? (
        <Image
          className="profile-image"
          src={person.image}
          alt={person.name}
          fill
          unoptimized
          sizes="(max-width: 620px) 100vw, (max-width: 1180px) 50vw, 25vw"
        />
      ) : (
        <ProfileAvatarPlaceholder className="profile-image" />
      )}
      <div className="profile-overlay" />
      <div className="profile-content">
        <h3>
          {person.name}, <span>{person.age}</span>
        </h3>
        <p className="distance">{person.distance}</p>
        <p>{person.bio}</p>
        <div className="tag-row">
          {person.tags.map((tag) => (
            <span key={`${person.name}-${tag}`}>{tag}</span>
          ))}
        </div>
      </div>
    </button>
  );
}

function People() {
  const t = useTranslations("discover");
  const { data: people = [], isLoading, isError } = useGetDiscoverPeopleQuery();
  const [query, setQuery] = useState("");
  const [filterKey, setFilterKey] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const filterOptions = useMemo(
    () => [
      { key: "all", label: t("filterOptions.all") },
      { key: "age18to25", label: t("filterOptions.age18to25") },
      { key: "age26to30", label: t("filterOptions.age26to30") },
      { key: "age31Plus", label: t("filterOptions.age31Plus") },
      { key: "nearby", label: t("filterOptions.nearby") }
    ],
    [t]
  );

  const activeFilterLabel = useMemo(
    () => filterOptions.find((option) => option.key === filterKey)?.label ?? t("filters"),
    [filterOptions, filterKey, t]
  );

  useEffect(() => {
    function onOutsideClick(event) {
      if (!filterRef.current?.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }

    function onEscape(event) {
      if (event.key === "Escape") {
        setIsFilterOpen(false);
      }
    }

    window.addEventListener("mousedown", onOutsideClick);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onOutsideClick);
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  const filteredPeople = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase();

    return people.filter((person) => {
      const name = person.name ?? "";
      const bio = person.bio ?? "";
      const distance = person.distance ?? "";
      const tags = Array.isArray(person.tags) ? person.tags.join(" ") : "";
      const searchTarget = `${name} ${bio} ${distance} ${tags}`.toLowerCase();

      if (loweredQuery && !searchTarget.includes(loweredQuery)) {
        return false;
      }

      const numericAge = Number(person.age);
      const hasAge = Number.isFinite(numericAge);

      if (filterKey === "age18to25") {
        return hasAge && numericAge >= 18 && numericAge <= 25;
      }
      if (filterKey === "age26to30") {
        return hasAge && numericAge >= 26 && numericAge <= 30;
      }
      if (filterKey === "age31Plus") {
        return hasAge && numericAge >= 31;
      }
      if (filterKey === "nearby") {
        const distanceMatch = String(distance).match(/\d+/);
        const km = distanceMatch ? Number(distanceMatch[0]) : Number.NaN;
        return Number.isFinite(km) && km <= 10;
      }

      return true;
    });
  }, [people, query, filterKey]);

  return (
    <section className="discover-section people-section">
      <div className="section-heading-row">
        <SectionTitle icon={Heart} iconProps={{ size: 21 }} title={t("peopleHeading")} />

        <div className="people-tools">
    

          <div className="people-filter-wrap" ref={filterRef}>
            <button
              type="button"
              onClick={() => setIsFilterOpen((current) => !current)}
              aria-haspopup="menu"
              aria-expanded={isFilterOpen}
            >
              <Filter size={18} />
              {activeFilterLabel}
            </button>

            {isFilterOpen ? (
              <div className="people-filter-menu" role="menu" aria-label={t("filters")}>
                {filterOptions.map((option) => (
                  <button
                    type="button"
                    key={option.key}
                    role="menuitemradio"
                    aria-checked={filterKey === option.key}
                    className={filterKey === option.key ? "active" : ""}
                    onClick={() => {
                      setFilterKey(option.key);
                      setIsFilterOpen(false);
                    }}
                  >
                    <span>{option.label}</span>
                    {filterKey === option.key ? <Check size={16} /> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {isLoading ? (
        <PeopleGridSkeleton />
      ) : isError ? (
        <p className="people-status">{t("peopleError")}</p>
      ) : filteredPeople.length === 0 ? (
        <p className="people-status">{t("peopleEmpty")}</p>
      ) : (
        <div className="people-grid">
          {filteredPeople.map((person) => (
            <ProfileCard person={person} key={person.id} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function DiscoverPage() {
  const t = useTranslations("discover");

  return (
    <DashboardShell activePageKey="discover" title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <Stories />
      <People />
    </DashboardShell>
  );
}
