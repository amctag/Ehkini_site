/** GET /gifts/catalog */
export const mockGiftCatalog = {
  categories: [
    { id: "all", label: "All Gifts", prefix: "" },
    { id: "romantic", label: "Romantic", prefix: "💕 " },
    { id: "luxury", label: "Luxury", prefix: "💎 " },
    { id: "special", label: "Special", prefix: "✨ " },
    { id: "seasonal", label: "Seasonal", prefix: "🎉 " }
  ],
  gifts: [
    {
      id: "heart",
      icon: "❤️",
      name: "Heart",
      description: "Send love and affection",
      category: "romantic"
    },
    {
      id: "rose",
      icon: "🌹",
      name: "Rose",
      description: "A classic symbol of romance",
      category: "romantic"
    },
    {
      id: "chocolate",
      icon: "🍫",
      name: "Chocolate",
      description: "Sweet and delightful",
      category: "special"
    },
    {
      id: "ring",
      icon: "💍",
      name: "Ring",
      description: "A precious promise",
      category: "luxury"
    },
    {
      id: "diamond",
      icon: "💎",
      name: "Diamond",
      description: "Rare and valuable",
      category: "luxury"
    },
    {
      id: "crown",
      icon: "👑",
      name: "Crown",
      description: "Treat them like royalty",
      category: "luxury"
    },
    {
      id: "bouquet",
      icon: "💐",
      name: "Bouquet",
      description: "A beautiful arrangement",
      category: "romantic"
    },
    {
      id: "champagne",
      icon: "🍾",
      name: "Champagne",
      description: "Celebrate in style",
      category: "seasonal"
    },
    {
      id: "star",
      icon: "⭐",
      name: "Star",
      description: "You're a star!",
      category: "special"
    },
    {
      id: "teddy",
      icon: "🧸",
      name: "Teddy Bear",
      description: "Cute and cuddly",
      category: "special"
    },
    {
      id: "cake",
      icon: "🎂",
      name: "Cake",
      description: "Perfect for celebrations",
      category: "seasonal"
    },
    {
      id: "giftbox",
      icon: "🎁",
      name: "Gift Box",
      description: "A mystery surprise",
      category: "seasonal"
    }
  ]
};
