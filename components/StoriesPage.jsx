import { ArrowLeft, Camera, Image as ImageIcon, Sparkles, Video } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import DashboardShell from "./DashboardShell";
import SectionTitle from "./SectionTitle";

export default function StoriesPage() {
  const t = useTranslations("stories");
  const actions = t.raw("actions");
  const friendStories = t.raw("friendStories");

  function getActionIcon(name) {
    if (name === "image") return ImageIcon;
    if (name === "video") return Video;
    return Camera;
  }

  return (
    <DashboardShell activePageKey="stories" title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <section className="stories-page">
        <div className="stories-panel">
          <div className="stories-title-row">
            <button type="button" aria-label={t("goBackAria")}>
              <ArrowLeft size={18} />
            </button>
            <SectionTitle icon={Camera} iconProps={{ size: 22 }} title={t("heading")} />
          </div>

          <p className="stories-intro">{t("intro")}</p>

          <div className="story-action-grid">
            {actions.map(({ title, description, icon, tone }) => {
              const Icon = getActionIcon(icon);

              return (
                <button className="story-action-card" type="button" key={title}>
                  <span className={`story-action-icon ${tone}`}>
                    <Icon size={30} strokeWidth={2.1} />
                  </span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </button>
              );
            })}
          </div>

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
