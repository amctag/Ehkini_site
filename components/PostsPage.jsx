"use client";

import { Image as ImageIcon, PenSquare, SmilePlus, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useCreatePostMutation } from "@/src/features/posts/postsApi";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import DashboardShell from "./DashboardShell";
import SectionTitle from "./SectionTitle";

const captionEmojis = [
  "\u{1F60D}",
  "\u2764\uFE0F",
  "\u{1F525}",
  "\u{1F60A}",
  "\u{1F389}",
  "\u2728",
  "\u{1F602}",
  "\u{1F64F}"
];

export default function PostsPage() {
  const t = useTranslations("posts");
  const actions = t.raw("actions");
  const uploadInputRef = useRef(null);
  const [createPost, { isLoading: isPublishing }] = useCreatePostMutation();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [caption, setCaption] = useState("");
  const [postError, setPostError] = useState("");
  const [postStatus, setPostStatus] = useState("");

  function resolveIcon(icon) {
    if (icon === "image") return ImageIcon;
    return PenSquare;
  }

  useEffect(() => {
    return () => {
      if (selectedMedia?.previewUrl) {
        URL.revokeObjectURL(selectedMedia.previewUrl);
      }
    };
  }, [selectedMedia]);

  function handlePickMedia(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (selectedMedia?.previewUrl) {
      URL.revokeObjectURL(selectedMedia.previewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedMedia({ file, previewUrl });
    event.target.value = "";
  }

  function clearSelectedMedia() {
    if (selectedMedia?.previewUrl) {
      URL.revokeObjectURL(selectedMedia.previewUrl);
    }

    setSelectedMedia(null);
    if (uploadInputRef.current) {
      uploadInputRef.current.value = "";
    }
  }

  function triggerPicker() {
    uploadInputRef.current?.click();
  }

  async function handlePublishPost() {
    setPostError("");
    setPostStatus("");

    if (!selectedMedia?.file) {
      setPostError(t("selectMediaFirst"));
      return;
    }

    try {
      const response = await createPost({
        file: selectedMedia.file,
        caption
      }).unwrap();

      setPostStatus(String(response?.message ?? t("publishSuccess")));
      if (selectedMedia?.previewUrl) {
        URL.revokeObjectURL(selectedMedia.previewUrl);
      }
      setSelectedMedia(null);
      setCaption("");
    } catch (error) {
      setPostError(getErrorMessage(error, t("publishError")));
    }
  }

  return (
    <DashboardShell activePageKey="posts" title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <section className="posts-page">
        <div className="posts-panel">
          <SectionTitle icon={PenSquare} iconProps={{ size: 22 }} title={t("heading")} className="posts-heading" />
          <p className="posts-intro">{t("intro")}</p>

          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            className="media-picker-input"
            onChange={handlePickMedia}
          />

          <div className="post-action-grid">
            {actions
              .filter((action) => action.icon !== "camera")
              .map((action) => {
                const Icon = resolveIcon(action.icon);
                return (
                  <button type="button" key={action.title} className="post-action-card" onClick={triggerPicker}>
                    <span className="post-action-icon">
                      <Icon size={24} strokeWidth={2} />
                    </span>
                    <strong>{action.title}</strong>
                    <small>{action.description}</small>
                  </button>
                );
              })}
          </div>

          {selectedMedia ? (
            <div className="post-selected-media">
              <p>{t("selectedFile", { name: selectedMedia.file.name })}</p>
              <div className="post-media-preview-wrap">
                <button
                  type="button"
                  className="story-selected-remove"
                  onClick={clearSelectedMedia}
                  aria-label={t("removeSelectedAria")}
                >
                  <X size={14} />
                </button>
                <Image
                  src={selectedMedia.previewUrl}
                  alt={t("selectedPreviewAlt")}
                  fill
                  unoptimized
                  sizes="(max-width: 800px) 100vw, 640px"
                  className="post-media-preview"
                />
              </div>
              <label className="post-caption-field">
                <span>{t("captionLabel")}</span>
                <textarea
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  placeholder={t("captionPlaceholder")}
                  rows={3}
                />
                <div className="post-emoji-row">
                  {captionEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className="post-emoji-button"
                      aria-label={t("addEmojiAria", { emoji })}
                      onClick={() => setCaption((current) => `${current}${emoji}`)}
                    >
                      {emoji}
                    </button>
                  ))}
                  <span className="post-emoji-hint">
                    <SmilePlus size={14} />
                    {t("emojiHint")}
                  </span>
                </div>
              </label>
            </div>
          ) : null}

          {postStatus ? <p className="posts-submit-status">{postStatus}</p> : null}
          {postError ? <p className="posts-submit-error">{postError}</p> : null}

          <button type="button" className="posts-story-link" onClick={handlePublishPost} disabled={isPublishing}>
            {isPublishing ? t("publishingPost") : t("publishPost")}
          </button>
        </div>
      </section>
    </DashboardShell>
  );
}
