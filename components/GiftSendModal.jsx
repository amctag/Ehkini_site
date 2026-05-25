import { LoaderCircle, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { selectCurrentUser } from "@/src/features/auth/authSlice";
import { useSendGiftMutation } from "@/src/features/gifts/giftsApi";
import { useAppDispatch, useAppSelector } from "@/src/hooks/reduxHooks";
import { cacheRecentUserName, upsertRecentSearchRow } from "@/src/features/users/usersSlice";
import { useSaveUserSearchClickMutation, useSearchUsersQuery } from "@/src/features/users/usersApi";

function normalizeId(value) {
  const text = String(value ?? "").trim();
  return text || null;
}

export default function GiftSendModal({ open, gift, onClose }) {
  const t = useTranslations("giftSendModal");
  const dispatch = useAppDispatch();
  const currentUserPayload = useAppSelector(selectCurrentUser);
  const currentUser =
    currentUserPayload?.user ??
    currentUserPayload?.data?.user ??
    currentUserPayload?.data ??
    currentUserPayload ??
    {};
  const currentUserId = normalizeId(currentUser?.id ?? currentUser?.user_id);
  const [recipientQuery, setRecipientQuery] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [message, setMessage] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [saveUserSearchClick] = useSaveUserSearchClickMutation();
  const [sendGift, { isLoading: isSendingGift }] = useSendGiftMutation();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(recipientQuery.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [recipientQuery]);

  const { data: users = [], isFetching } = useSearchUsersQuery(debouncedQuery, {
    skip: !open || debouncedQuery.length === 0
  });
  const selectedRecipientId =
    selectedRecipient?.receiver_id ??
    selectedRecipient?.receiverId ??
    selectedRecipient?.user_id ??
    selectedRecipient?.id ??
    null;
  const selectedRecipientIdKey = normalizeId(selectedRecipientId);
  const isSelectedRecipientSelf =
    Boolean(currentUserId) && Boolean(selectedRecipientIdKey) && selectedRecipientIdKey === currentUserId;

  const showResults = debouncedQuery.length > 0 && !selectedRecipient;
  const visibleUsers = useMemo(() => {
    if (!showResults) return [];
    if (!currentUserId) return users;

    return users.filter((user) => {
      const userId = normalizeId(user?.user_id ?? user?.id ?? user?.receiver_id ?? user?.receiverId);
      return userId !== currentUserId;
    });
  }, [showResults, users, currentUserId]);

  if (!open || !gift) return null;

  return (
    <div className="gift-modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="gift-send-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t("dialogAria", { giftName: gift.name })}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="gift-send-modal-header">
          <div>
            <h3>{t("title", { giftName: gift.name })}</h3>
            <p>{t("subtitle")}</p>
          </div>
          <button type="button" aria-label={t("closeAria")} onClick={onClose}>
            <X size={17} />
          </button>
        </header>

        <div className="gift-send-modal-content">
          <div className="gift-send-preview">
            <span>{gift.icon}</span>
            <p>{gift.description}</p>
          </div>

          <label className="gift-send-field">
            <span>{t("sendTo")}</span>
            <div className="gift-user-search-wrap">
              <label className="gift-user-search" aria-label={t("recipientPlaceholder")}>
                <Search size={16} />
                <input
                  type="search"
                  value={recipientQuery}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setRecipientQuery(nextValue);

                    if (selectedRecipient && nextValue !== selectedRecipient.name) {
                      setSelectedRecipient(null);
                    }
                  }}
                  placeholder={t("searchPlaceholder")}
                />
                {isFetching && <LoaderCircle className="gift-user-search-loader" size={14} />}
              </label>

              {showResults && (
                <div className="gift-user-results" role="listbox">
                  {visibleUsers.length ? (
                    visibleUsers.map((user) => (
                      <button
                        className="gift-user-result"
                        key={user.id}
                        type="button"
                        onClick={async () => {
                          const userId = normalizeId(user?.user_id ?? user?.id ?? user?.receiver_id ?? user?.receiverId);
                          if (currentUserId && userId === currentUserId) {
                            return;
                          }

                          dispatch(cacheRecentUserName(user));
                          dispatch(upsertRecentSearchRow(user));
                          setSelectedRecipient(user);
                          setRecipientQuery(user.name);
                          try {
                            await saveUserSearchClick(user).unwrap();
                          } catch (error) {
                            console.error("Failed to save searched user from gift modal", error);
                          }
                        }}
                      >
                        {user.name}
                      </button>
                    ))
                  ) : (
                    <p className="gift-user-results-empty">{t("noUsersFound")}</p>
                  )}
                </div>
              )}

              {selectedRecipient && (
                <p className="gift-user-selected">{t("selectedRecipient", { name: selectedRecipient.name })}</p>
              )}
            </div>
          </label>

          <label className="gift-send-field">
            <span>{t("messageLabel")}</span>
            <textarea
              placeholder={t("messagePlaceholder")}
              rows={4}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>
        </div>

        <footer className="gift-send-modal-footer">
          <button
            type="button"
            disabled={
              !selectedRecipient ||
              selectedRecipientId === null ||
              selectedRecipientId === undefined ||
              isSelectedRecipientSelf ||
              isSendingGift
            }
            onClick={async () => {
              if (
                !selectedRecipient ||
                selectedRecipientId === null ||
                selectedRecipientId === undefined ||
                isSelectedRecipientSelf
              ) return;
              try {
                await sendGift({
                  gift,
                  recipient: selectedRecipient,
                  message
                }).unwrap();
                onClose();
              } catch (error) {
                console.error("Failed to send gift", error);
              }
            }}
          >
            {isSendingGift ? t("sending") : t("submit")}
          </button>
        </footer>
      </section>
    </div>
  );
}
