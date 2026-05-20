import { Gift } from "lucide-react";
import DashboardShell from "./DashboardShell";

const categories = ["All Gifts", "Romantic", "Luxury", "Special", "Seasonal"];

const gifts = [
  { icon: "❤️", name: "Heart", description: "Send love and affection", price: "$1" },
  { icon: "🌹", name: "Rose", description: "A classic symbol of romance", price: "$2" },
  { icon: "🍫", name: "Chocolate", description: "Sweet and delightful", price: "$2" },
  { icon: "💍", name: "Ring", description: "A precious promise", price: "$5" },
  { icon: "💎", name: "Diamond", description: "Rare and valuable", price: "$10" },
  { icon: "👑", name: "Crown", description: "Treat them like royalty", price: "$8" },
  { icon: "💐", name: "Bouquet", description: "A beautiful arrangement", price: "$4" },
  { icon: "🍾", name: "Champagne", description: "Celebrate in style", price: "$6" },
  { icon: "⭐", name: "Star", description: "You're a star!", price: "$3" },
  { icon: "🧸", name: "Teddy Bear", description: "Cute and cuddly", price: "$3" },
  { icon: "🎂", name: "Cake", description: "Perfect for celebrations", price: "$4" },
  { icon: "🎁", name: "Gift Box", description: "A mystery surprise", price: "$7" }
];

export default function GiftMarketPage() {
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
          {categories.map((category, index) => (
            <button className={index === 0 ? "active" : ""} type="button" key={category}>
              {category === "Romantic" ? "💕 " : ""}
              {category === "Luxury" ? "💎 " : ""}
              {category === "Special" ? "✨ " : ""}
              {category === "Seasonal" ? "🎉 " : ""}
              {category}
            </button>
          ))}
        </div>

        <div className="gift-grid">
          {gifts.map((gift) => (
            <article className="gift-card" key={gift.name}>
              <div className="gift-icon" aria-hidden="true">
                {gift.icon}
              </div>
              <h3>{gift.name}</h3>
              <p>{gift.description}</p>
              <span>{gift.price}</span>
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
