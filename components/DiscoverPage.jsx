"use client";

import { Filter, Heart, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import DashboardShell from "./DashboardShell";
import SectionTitle from "./SectionTitle";

function Stories() {
  const router = useRouter();
  const t = useTranslations("discover");
  const storyItems = t.raw("storyItems");

  return (
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

        {storyItems.map((story) => (
          <div className="story-item" key={story.name}>
            <Image
              className="story-image"
              src={story.image}
              alt={t("storyImageAlt", { name: story.name })}
              width={121}
              height={121}
            />
            <span>{story.name}</span>
          </div>
        ))}
      </div>
    </section>
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
