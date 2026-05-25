/** GET /wallet/gift-transactions */
export const mockWalletGiftTransactions = [
  {
    id: "gift-tx-1",
    gift_name: "Diamond",
    gift_icon: "\uD83D\uDC8E",
    from_name: "Maya",
    receiver_name: "You",
    direction: "received",
    amount: "+10",
    created_at: "2024-11-06"
  },
  {
    id: "gift-tx-2",
    gift_name: "Rose",
    gift_icon: "\uD83C\uDF39",
    sender_name: "You",
    receiver_name: "Sarah",
    direction: "sent",
    amount: "+2",
    created_at: "2024-11-05"
  },
  {
    id: "gift-tx-3",
    gift_name: "Heart",
    gift_icon: "\u2764\uFE0F",
    from_name: "Ahmed",
    receiver_name: "You",
    direction: "received",
    amount: "+1",
    created_at: "2024-11-04"
  }
];
