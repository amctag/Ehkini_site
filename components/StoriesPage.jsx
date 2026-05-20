import { ArrowLeft, Camera, Image as ImageIcon, Sparkles, Video } from "lucide-react";
import Image from "next/image";
import DashboardShell from "./DashboardShell";

const actions = [
  {
    title: "Take Photo",
    description: "Use your camera",
    icon: Camera,
    tone: "orange"
  },
  {
    title: "Upload Photo",
    description: "From gallery",
    icon: ImageIcon,
    tone: "purple"
  },
  {
    title: "Upload Video",
    description: "Share a video",
    icon: Video,
    tone: "orange"
  }
];

const friendStories = [
  {
    name: "Sarah",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=360&q=85"
  },
  {
    name: "Ahmed",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=360&q=85"
  },
  {
    name: "Maya",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=360&q=85"
  },
  {
    name: "Omar",
    image:
      "https://images.unsplash.com/photo-1542327897-d73f4005b533?auto=format&fit=crop&w=360&q=85"
  }
];

export default function StoriesPage() {
  return (
    <DashboardShell activePage="Stories" title="Stories" subtitle="Share your moments">
      <section className="stories-page">
        <div className="stories-panel">
          <div className="stories-title-row">
            <button type="button" aria-label="Go back">
              <ArrowLeft size={18} />
            </button>
            <h2>
              <Camera size={22} />
              Camera &amp; Stories
            </h2>
          </div>

          <p className="stories-intro">Share moments that disappear in 24 hours</p>

          <div className="story-action-grid">
            {actions.map(({ title, description, icon: Icon, tone }) => (
              <button className="story-action-card" type="button" key={title}>
                <span className={`story-action-icon ${tone}`}>
                  <Icon size={30} strokeWidth={2.1} />
                </span>
                <strong>{title}</strong>
                <small>{description}</small>
              </button>
            ))}
          </div>

          <h3>Your Active Stories</h3>
          <div className="empty-stories">
            <Sparkles size={48} />
            <strong>No active stories</strong>
            <span>Share your first moment above!</span>
          </div>

          <h3>Friends Stories</h3>
          <div className="friend-story-grid">
            {friendStories.map((story) => (
              <article className="friend-story-card" key={story.name}>
                <Image src={story.image} alt={`${story.name}'s story`} fill sizes="160px" />
              </article>
            ))}
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
