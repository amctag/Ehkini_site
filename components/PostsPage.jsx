"use client";

import { Camera, Image as ImageIcon, PenSquare, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import DashboardShell from "./DashboardShell";
import SectionTitle from "./SectionTitle";

export default function PostsPage() {
  const t = useTranslations("posts");
  const router = useRouter();
  const actions = t.raw("actions");
  const uploadInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [caption, setCaption] = useState("");

  function resolveIcon(icon) {
    if (icon === "camera") return Camera;
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
    setSelectedMedia({
      file,
      previewUrl
    });
  }

  function triggerPicker(icon) {
    if (icon === "camera") {
      cameraInputRef.current?.click();
      return;
    }

    uploadInputRef.current?.click();
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
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="media-picker-input"
            onChange={handlePickMedia}
          />

          <div className="post-action-grid">
            {actions.map((action) => {
              const Icon = resolveIcon(action.icon);
              return (
                <button
                  type="button"
                  key={action.title}
                  className="post-action-card"
                  onClick={() => triggerPicker(action.icon)}
                >
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
              </label>
            </div>
          ) : null}

          <button type="button" className="posts-story-link" onClick={() => router.push("/stories")}>
            <Sparkles size={16} />
            {t("goToStories")}
          </button>
        </div>
      </section>
    </DashboardShell>
  );
}
