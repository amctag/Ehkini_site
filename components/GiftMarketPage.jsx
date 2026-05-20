"use client";

import { Gift } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import DashboardShell from "./DashboardShell";
import GiftCard from "./GiftCard";
import GiftSendModal from "./GiftSendModal";
import SectionTitle from "./SectionTitle";

export default function GiftMarketPage() {
  const t = useTranslations("giftMarket");
  const categories = t.raw("categories");
  const gifts = t.raw("gifts");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedGift, setSelectedGift] = useState(null);

  const visibleGifts = useMemo(() => {
    if (activeCategory === "all") return gifts;
    return gifts.filter((gift) => gift.category === activeCategory);
  }, [activeCategory, gifts]);

  return (
    <DashboardShell activePageKey="giftMarket" title={t("pageTitle")} subtitle={t("pageSubtitle")}>
      <section className="gift-market">
        <div className="gift-heading">
          <SectionTitle icon={Gift} iconProps={{ size: 22 }} title={t("heading")} />
          <p>{t("intro")}</p>
        </div>

        <div className="gift-categories" aria-label={t("categoriesAria")}>
          {categories.map((category) => (
            <button
              className={category.id === activeCategory ? "active" : ""}
              type="button"
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.prefix}
              {category.label}
            </button>
          ))}
        </div>

        <div className="gift-grid">
          {visibleGifts.map((gift) => (
            <GiftCard key={gift.id} gift={gift} onClick={setSelectedGift} />
          ))}
        </div>
      </section>

      <GiftSendModal open={Boolean(selectedGift)} gift={selectedGift} onClose={() => setSelectedGift(null)} />
    </DashboardShell>
  );
}
