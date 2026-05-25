"use client";

import { Check, ChevronLeft, ChevronRight, Filter, Heart, Search, SendHorizontal, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useGetDiscoverPeopleQuery,
  useGetDiscoverStoriesQuery
} from "@/src/features/discover/discoverApi";
import PeopleGridSkeleton from "@/src/features/discover/components/PeopleGridSkeleton";
import DashboardShell from "./DashboardShell";
import ProfileAvatarPlaceholder from "./ProfileAvatarPlaceholder";
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
        <Image
          src={activeStory.image}
          alt={t("storyImageAlt", { name: activeStory.name })}
          fill
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
                <Image src={activeStory.image} alt={activeStory.name} fill sizes="32px" />
              </span>
              <strong>{activeStory.name}</strong>
              <small>{t("storyViewer.timeAgo")}</small>
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

  const showPreviousStory = useCallback(() => {
    setActiveStoryIndex((current) => {
      if (current === null) return 0;
      return (current - 1 + storyItems.length) % storyItems.length;
    });
  }, [storyItems.length]);

  const showNextStory = useCallback(() => {
    setActiveStoryIndex((current) => {
      if (current === null) return 0;
      return (current + 1) % storyItems.length;
    });
  }, [storyItems.length]);

  useEffect(() => {
    if (activeStoryIndex === null) return;

    const timer = window.setTimeout(() => {
      showNextStory();
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [activeStoryIndex, showNextStory]);

  useEffect(() => {
    if (activeStoryIndex === null) return;

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
  }, [activeStoryIndex, showNextStory, showPreviousStory]);

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
