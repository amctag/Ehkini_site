"use client";

import { Gift } from "lucide-react";
import { useMemo, useState } from "react";
import DashboardShell from "./DashboardShell";
import GiftCard from "./GiftCard";
import GiftSendModal from "./GiftSendModal";

const categories = ["All Gifts", "Romantic", "Luxury", "Special", "Seasonal"];

const gifts = [
  {
    icon: "\u2764\uFE0F",
    name: "Heart",
    description: "Send love and affection",
    category: "Romantic"
  },
  {
    icon: "\uD83C\uDF39",
    name: "Rose",
    description: "A classic symbol of romance",
    category: "Romantic"
  },
  {
    icon: "\uD83C\uDF6B",
    name: "Chocolate",
    description: "Sweet and delightful",
    category: "Special"
  },
  {
    icon: "\uD83D\uDC8D",
    name: "Ring",
    description: "A precious promise",
    category: "Luxury"
  },
  {
    icon: "\uD83D\uDC8E",
    name: "Diamond",
    description: "Rare and valuable",
    category: "Luxury"
  },
  {
    icon: "\uD83D\uDC51",
    name: "Crown",
    description: "Treat them like royalty",
    category: "Luxury"
  },
  {
    icon: "\uD83D\uDC90",
    name: "Bouquet",
    description: "A beautiful arrangement",
    category: "Romantic"
  },
  {
    icon: "\uD83C\uDF7E",
    name: "Champagne",
    description: "Celebrate in style",
    category: "Seasonal"
  },
  {
    icon: "\u2B50",
    name: "Star",
    description: "You're a star!",
    category: "Special"
  },
  {
    icon: "\uD83E\uDDF8",
    name: "Teddy Bear",
    description: "Cute and cuddly",
    category: "Special"
  },
  {
    icon: "\uD83C\uDF82",
    name: "Cake",
    description: "Perfect for celebrations",
    category: "Seasonal"
  },
  {
    icon: "\uD83C\uDF81",
    name: "Gift Box",
    description: "A mystery surprise",
    category: "Seasonal"
  }
];

function getCategoryPrefix(category) {
  if (category === "Romantic") return "\uD83D\uDC95 ";
  if (category === "Luxury") return "\uD83D\uDC8E ";
  if (category === "Special") return "\u2728 ";
  if (category === "Seasonal") return "\uD83C\uDF89 ";
  return "";
}

export default function GiftMarketPage() {
  const [activeCategory, setActiveCategory] = useState("All Gifts");
  const [selectedGift, setSelectedGift] = useState(null);

  const visibleGifts = useMemo(() => {
    if (activeCategory === "All Gifts") return gifts;
    return gifts.filter((gift) => gift.category === activeCategory);
  }, [activeCategory]);

  return (
    <DashboardShell activePage="Gift Market" title="Gift Market" subtitle="Express your feelings with gifts">
      <section className="gift-market">
        <div className="gift-heading">
          <h2>
            <Gift size={22} />
            Gift Market
          </h2>
          <p>Send digital gifts to show appreciation and connect with others</p>
        </div>

        <div className="gift-categories" aria-label="Gift categories">
          {categories.map((category) => (
            <button
              className={category === activeCategory ? "active" : ""}
              type="button"
              key={category}
              onClick={() => setActiveCategory(category)}
            >
              {getCategoryPrefix(category)}
              {category}
            </button>
          ))}
        </div>

        <div className="gift-grid">
          {visibleGifts.map((gift) => (
            <GiftCard key={gift.name} gift={gift} onClick={setSelectedGift} />
          ))}
        </div>
      </section>

      <GiftSendModal open={Boolean(selectedGift)} gift={selectedGift} onClose={() => setSelectedGift(null)} />
    </DashboardShell>
  );
}
