import { Filter, Heart, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import DashboardShell from "./DashboardShell";

const storyItems = [
  {
    name: "Sarah",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=260&q=80"
  },
  {
    name: "Ahmed",
    image:
      "https://images.unsplash.com/photo-1542327897-d73f4005b533?auto=format&fit=crop&w=260&q=80"
  },
  {
    name: "Maya",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=260&q=80"
  },
  {
    name: "Omar",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=260&q=80"
  }
];

const people = [
  {
    name: "Sarah",
    age: 26,
    distance: "2 km away",
    bio: "Love traveling, photography, and meeting new people",
    tags: ["Travel", "Photography", "+1"],
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=720&q=85"
  },
  {
    name: "Ahmed",
    age: 29,
    distance: "5 km away",
    bio: "Entrepreneur | Coffee enthusiast | Looking for meaningful connections",
    tags: ["Business", "Coffee", "+1"],
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=720&q=85"
  },
  {
    name: "Maya",
    age: 24,
    distance: "8 km away",
    bio: "Artist & dreamer. Believer in kindness and good vibes",
    tags: ["Art", "Music", "+1"],
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=720&q=85"
  },
  {
    name: "Omar",
    age: 31,
    distance: "12 km away",
    bio: "Software engineer who loves hiking and good conversations",
    tags: ["Technology", "Hiking", "+1"],
    image:
      "https://images.unsplash.com/photo-1542327897-d73f4005b533?auto=format&fit=crop&w=720&q=85"
  }
];

function Stories() {
  return (
    <section className="discover-section">
      <h2>
        <Sparkles size={22} />
        Stories
      </h2>

      <div className="stories-row">
        <div className="story-item">
          <button className="your-story" type="button" aria-label="Add your story">
            +
          </button>
          <span>Your Story</span>
        </div>

        {storyItems.map((story) => (
          <div className="story-item" key={story.name}>
            <Image
              className="story-image"
              src={story.image}
              alt={`${story.name}'s story`}
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
  return (
    <article className="profile-card">
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
    </article>
  );
}

function People() {
  return (
    <section className="discover-section people-section">
      <div className="section-heading-row">
        <h2>
          <Heart size={21} />
          Discover People
        </h2>

        <div className="people-tools">
          <button type="button">
            <Search size={18} />
            Search
          </button>
          <button type="button">
            <Filter size={18} />
            Filters
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
  return (
    <DashboardShell activePage="Discover" title="Discover" subtitle="Find your perfect match">
      <Stories />
      <People />
    </DashboardShell>
  );
}
