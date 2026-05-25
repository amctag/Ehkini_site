"use client";

import { ArrowLeft, Camera, Image as ImageIcon, Sparkles, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useCreateStoryMutation } from "@/src/features/stories/storiesApi";
import DashboardShell from "./DashboardShell";
import SectionTitle from "./SectionTitle";

export default function StoriesPage() {
  const t = useTranslations("stories");
  const router = useRouter();
  const actions = t.raw("actions");
  const friendStories = t.raw("friendStories");
  const galleryInputRef = useRef(null);
  const videoRef = useRef(null);
  const [createStory, { isLoading: isUploading }] = useCreateStoryMutation();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [storyError, setStoryError] = useState("");
  const [storyStatus, setStoryStatus] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const cameraStreamRef = useRef(null);

  function getActionIcon(name) {
    if (name === "image") return ImageIcon;
    return Camera;
  }

  useEffect(() => {
    return () => {
      if (selectedMedia?.previewUrl) {
        URL.revokeObjectURL(selectedMedia.previewUrl);
      }
      stopCameraStream();
    };
  }, [selectedMedia]);

  function stopCameraStream() {
    const stream = cameraStreamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function clearSelectedMedia() {
    if (selectedMedia?.previewUrl) {
      URL.revokeObjectURL(selectedMedia.previewUrl);
    }
    setSelectedMedia(null);
    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
    }
  }

  function handlePickMedia(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    clearSelectedMedia();
    setStoryError("");
    setStoryStatus("");
    setSelectedMedia({
      file,
      previewUrl: URL.createObjectURL(file)
    });
    event.target.value = "";
  }

  function triggerGalleryPicker() {
    galleryInputRef.current?.click();
  }

  async function openCamera() {
    setCameraError("");
    setStoryError("");
    setStoryStatus("");
    setIsCameraOpen(true);
    setIsStartingCamera(true);

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError(t("cameraUnsupported"));
      setIsStartingCamera(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" }
        },
        audio: false
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setCameraError(t("cameraPermissionError"));
    } finally {
      setIsStartingCamera(false);
    }
  }

  function closeCamera() {
    stopCameraStream();
    setIsCameraOpen(false);
  }

  function captureFromCamera() {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setCameraError(t("cameraCaptureError"));
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      setCameraError(t("cameraCaptureError"));
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError(t("cameraCaptureError"));
          return;
        }

        clearSelectedMedia();
        const file = new File([blob], `story-${Date.now()}.jpg`, { type: "image/jpeg" });
        setSelectedMedia({
          file,
          previewUrl: URL.createObjectURL(file)
        });
        closeCamera();
      },
      "image/jpeg",
      0.92
    );
  }

  async function handleUploadStory() {
    setStoryError("");
    setStoryStatus("");

    if (!selectedMedia?.file) {
      setStoryError(t("selectMediaFirst"));
      return;
    }

    try {
      const response = await createStory({ file: selectedMedia.file }).unwrap();
      setStoryStatus(String(response?.message ?? t("publishSuccess")));
      clearSelectedMedia();
    } catch (error) {
      const message = error?.data?.message ?? error?.error ?? t("publishError");
      setStoryError(String(message));
    }
  }

  return (
    <DashboardShell activePageKey="stories" title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <section className="stories-page">
        <div className="stories-panel">
          <div className="stories-title-row">
            <button type="button" aria-label={t("goBackAria")} onClick={() => router.back()}>
              <ArrowLeft size={18} />
            </button>
            <SectionTitle icon={Camera} iconProps={{ size: 22 }} title={t("heading")} />
          </div>

          <p className="stories-intro">{t("intro")}</p>

          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="media-picker-input"
            onChange={handlePickMedia}
          />

          <div className="story-action-grid">
            {actions.map(({ title, description, icon, tone }) => {
              const Icon = getActionIcon(icon);
              const isCameraAction = icon === "camera";

              return (
                <button
                  className="story-action-card"
                  type="button"
                  key={title}
                  onClick={isCameraAction ? openCamera : triggerGalleryPicker}
                >
                  <span className={`story-action-icon ${tone}`}>
                    <Icon size={30} strokeWidth={2.1} />
                  </span>
                  <strong>{title}</strong>
                  <small>{description}</small>
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
              <button type="button" className="story-upload-button" onClick={handleUploadStory} disabled={isUploading}>
                <Upload size={16} />
                {isUploading ? t("publishingStory") : t("publishStory")}
              </button>
            </div>
          ) : null}

          {isCameraOpen ? (
            <div className="story-camera-overlay" role="presentation" onClick={closeCamera}>
              <div className="story-camera-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
                <div className="story-camera-head">
                  <strong>{t("cameraTitle")}</strong>
                  <button type="button" aria-label={t("cameraCloseAria")} onClick={closeCamera}>
                    <X size={16} />
                  </button>
                </div>
                <div className="story-camera-body">
                  <video ref={videoRef} autoPlay playsInline muted className="story-camera-video" />
                  {isStartingCamera ? <p className="story-camera-hint">{t("cameraStarting")}</p> : null}
                  {cameraError ? <p className="posts-submit-error">{cameraError}</p> : null}
                </div>
                <div className="story-camera-actions">
                  <button type="button" className="story-camera-capture" onClick={captureFromCamera} disabled={isStartingCamera}>
                    {t("cameraCapture")}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {storyStatus ? <p className="posts-submit-status">{storyStatus}</p> : null}
          {storyError ? <p className="posts-submit-error">{storyError}</p> : null}

          <h3>{t("activeStories")}</h3>
          <div className="empty-stories">
            <Sparkles size={48} />
            <strong>{t("noActiveStories")}</strong>
            <span>{t("firstMoment")}</span>
          </div>

          <h3>{t("friendsStories")}</h3>
          <div className="friend-story-grid">
            {friendStories.map((story) => (
              <article className="friend-story-card" key={story.name}>
                <Image src={story.image} alt={t("friendStoryAlt", { name: story.name })} fill sizes="160px" />
              </article>
            ))}
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
