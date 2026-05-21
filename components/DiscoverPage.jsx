"use client";

import { ChevronLeft, ChevronRight, Filter, Heart, Search, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import DashboardShell from "./DashboardShell";
import SectionTitle from "./SectionTitle";

function StoryViewer({ storyItems, activeIndex, onClose, onPrevious, onNext }) {
  const t = useTranslations("discover");

  if (activeIndex === null) return null;

  const activeStory = storyItems[activeIndex];

  return (
    <div className="story-viewer-overlay" role="presentation" onClick={onClose}>
      <section
        className="story-viewer-panel"
        role="dialog"
        aria-modal="true"
        aria-label={t("storyViewer.dialogAria")}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="story-viewer-header">
          <span>{t("storyViewer.count", { current: activeIndex + 1, total: storyItems.length })}</span>
          <button type="button" onClick={onClose} aria-label={t("storyViewer.closeAria")}>
            <X size={18} />
          </button>
        </header>

        <div className="story-viewer-stage">
          <button type="button" className="story-viewer-nav left" onClick={onPrevious} aria-label={t("storyViewer.previousAria")}>
            <ChevronLeft size={22} />
          </button>

          <Image
            src={activeStory.image}
            alt={t("storyImageAlt", { name: activeStory.name })}
            width={430}
            height={680}
            className="story-viewer-image"
          />

          <button type="button" className="story-viewer-nav right" onClick={onNext} aria-label={t("storyViewer.nextAria")}>
            <ChevronRight size={22} />
          </button>
        </div>

        <footer className="story-viewer-footer">
          <strong>{activeStory.name}</strong>
          <button type="button">{t("storyViewer.view")}</button>
        </footer>
      </section>
    </div>
  );
}

function Stories() {
  const router = useRouter();
  const t = useTranslations("discover");
  const storyItems = useMemo(() => t.raw("storyItems"), [t]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);

  useEffect(() => {
    if (activeStoryIndex === null) return;

    function onEscape(event) {
      if (event.key === "Escape") {
        setActiveStoryIndex(null);
      }
    }

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [activeStoryIndex]);

  function showPreviousStory() {
    setActiveStoryIndex((current) => {
      if (current === null) return 0;
      return (current - 1 + storyItems.length) % storyItems.length;
    });
  }

  function showNextStory() {
    setActiveStoryIndex((current) => {
      if (current === null) return 0;
      return (current + 1) % storyItems.length;
    });
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

          {storyItems.map((story, index) => (
            <div className="story-item" key={story.name}>
              <button
                type="button"
                className="story-open-button"
                onClick={() => setActiveStoryIndex(index)}
                aria-label={t("storyViewer.openAria", { name: story.name })}
              >
                <Image
                  className="story-image"
                  src={story.image}
                  alt={t("storyImageAlt", { name: story.name })}
                  width={121}
                  height={121}
                />
              </button>
              <span>{story.name}</span>
            </div>
          ))}
        </div>
      </section>

      <StoryViewer
        storyItems={storyItems}
        activeIndex={activeStoryIndex}
        onClose={() => setActiveStoryIndex(null)}
        onPrevious={showPreviousStory}
        onNext={showNextStory}
      />
    </>
  );
}

function ProfileCard({ person }) {
  const router = useRouter();

  const slug = person.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <button type="button" className="profile-card profile-card-button" onClick={() => router.push(`/profile-view/${slug}`)}>
      <Image
        className="profile-image"
        src={person.image}
        alt={person.name}
        fill
        sizes="(max-width: 620px) 100vw, (max-width: 1180px) 50vw, 25vw"
      />
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
  const people = t.raw("people");

  return (
    <section className="discover-section people-section">
      <div className="section-heading-row">
        <SectionTitle icon={Heart} iconProps={{ size: 21 }} title={t("peopleHeading")} />

        <div className="people-tools">
          <button type="button">
            <Search size={18} />
            {t("search")}
          </button>
          <button type="button">
            <Filter size={18} />
            {t("filters")}
          </button>
        </div>
      </div>

      <div className="people-grid">
        {people.map((person) => (
          <ProfileCard person={person} key={person.name} />
        ))}
      </div>
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
