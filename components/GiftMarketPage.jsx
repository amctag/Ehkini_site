"use client";

import { Gift } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useGetGiftCategoriesQuery, useGetGiftsQuery } from "@/src/features/gifts/giftsApi";
import { useGetWalletGiftTransactionsQuery } from "@/src/features/wallet/walletApi";
import DashboardShell from "./DashboardShell";
import GiftCard from "./GiftCard";
import GiftSendModal from "./GiftSendModal";
import SectionTitle from "./SectionTitle";

export default function GiftMarketPage() {
  const t = useTranslations("giftMarket");
  const translationCategories = t.raw("categories");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedGift, setSelectedGift] = useState(null);
  const { data: giftCategories = [] } = useGetGiftCategoriesQuery();
  const { data: gifts = [], isFetching: isLoadingGifts, isError: isGiftsError } = useGetGiftsQuery();
  const { data: walletGiftTransactions = [] } = useGetWalletGiftTransactionsQuery();
  const sentGiftsCount = useMemo(
    () =>
      walletGiftTransactions.filter(
        (transaction) => String(transaction?.direction ?? "").toLowerCase() === "sent"
      ).length,
    [walletGiftTransactions]
  );

  const categories = useMemo(() => {
    const rows = Array.isArray(translationCategories) ? translationCategories : [];
    const bySlug = new Map(rows.map((row) => [String(row?.id ?? "").trim(), row]));
    const apiCategories = Array.isArray(giftCategories) ? giftCategories : [];
    const dynamicCategories = apiCategories
      .map((category) => {
        const slug = String(category?.slug ?? "").trim();
        if (!slug || slug === "all") return null;
        const localized = bySlug.get(slug);
        return {
          id: slug,
          label: localized?.label ?? category?.name ?? slug.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
          prefix: localized?.prefix ?? ""
        };
      })
      .filter(Boolean);

    if (!dynamicCategories.length) {
      const categoryIds = [...new Set(gifts.map((gift) => String(gift?.category ?? "").trim()).filter(Boolean))];
      for (const id of categoryIds) {
        if (!id || id === "all") continue;
        const localized = bySlug.get(id);
        dynamicCategories.push({
          id,
          label: localized?.label ?? id.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
          prefix: localized?.prefix ?? ""
        });
      }
    }

    const allCategory = bySlug.get("all") ?? { id: "all", label: "All Gifts", prefix: "" };
    return [allCategory, ...dynamicCategories];
  }, [giftCategories, gifts, translationCategories]);

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
          <div className="gift-heading-meta">
            <span className="gift-counter-pill">{t("sentGiftsLabel", { count: sentGiftsCount })}</span>
          </div>
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
          {isLoadingGifts ? <p>{t("loadingGifts")}</p> : null}
          {isGiftsError ? <p>{t("giftsLoadError")}</p> : null}
          {!isLoadingGifts && !isGiftsError && visibleGifts.length === 0 ? <p>{t("emptyGifts")}</p> : null}
          {!isLoadingGifts && !isGiftsError
            ? visibleGifts.map((gift) => (
              <GiftCard key={gift.id} gift={gift} onClick={setSelectedGift} />
            ))
            : null}
        </div>
      </section>

      {selectedGift && <GiftSendModal open gift={selectedGift} onClose={() => setSelectedGift(null)} />}
    </DashboardShell>
  );
}
