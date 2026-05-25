import { api } from "@/src/services/baseApi";

function asArray(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.transactions)) return response.transactions;
  if (Array.isArray(response?.gift_transactions)) return response.gift_transactions;
  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.transactions)) return response.data.transactions;
  if (Array.isArray(response?.data?.gift_transactions)) return response.data.gift_transactions;
  if (Array.isArray(response?.data?.results)) return response.data.results;
  return [];
}

function fullNameFromParts(value, fallback = "") {
  if (!value || typeof value !== "object") return fallback;
  const fullName = String(value.full_name ?? "").trim();
  if (fullName) return fullName;
  const firstLastName = [value.first_name, value.last_name].filter(Boolean).join(" ").trim();
  if (firstLastName) return firstLastName;
  return String(value.name ?? fallback).trim() || fallback;
}

function pickPersonName(rawValue, objectValue, fallback = "") {
  const directName = String(rawValue ?? "").trim();
  if (directName) return directName;
  return fullNameFromParts(objectValue, fallback);
}

function normalizeDirection(value) {
  const text = String(value ?? "").trim().toLowerCase();
  if (text === "sent") return "sent";
  if (text === "received") return "received";
  if (text === "incoming") return "received";
  if (text === "outgoing") return "sent";
  return "received";
}

const giftIconByKeyword = [
  { pattern: /(heart|love|romance)/, icon: "\u2764\uFE0F" },
  { pattern: /(rose|flower|bouquet)/, icon: "\uD83C\uDF39" },
  { pattern: /(chocolate|candy|sweet)/, icon: "\uD83C\uDF6B" },
  { pattern: /(ring)/, icon: "\uD83D\uDC8D" },
  { pattern: /(diamond|gem|jewel)/, icon: "\uD83D\uDC8E" },
  { pattern: /(crown|king|queen|royal)/, icon: "\uD83D\uDC51" },
  { pattern: /(champagne|wine|toast|drink)/, icon: "\uD83C\uDF7E" },
  { pattern: /(star)/, icon: "\u2B50" },
  { pattern: /(teddy|bear|toy)/, icon: "\uD83E\uDDF8" },
  { pattern: /(cake|birthday)/, icon: "\uD83C\uDF82" },
  { pattern: /(gift|box|present|surprise)/, icon: "\uD83C\uDF81" }
];

function resolveGiftIcon(value, fallbackText = "") {
  const iconText = String(value ?? "").trim();
  const iconIsImage = iconText.startsWith("http") || iconText.startsWith("/");
  if (iconIsImage) return iconText;

  const isGenericGiftIcon =
    iconText.length === 0 ||
    iconText === "\uD83C\uDF81" ||
    iconText === "🎁";
  if (!isGenericGiftIcon) return iconText;

  const normalizedText = String(fallbackText ?? "").toLowerCase();
  const keywordMatch = giftIconByKeyword.find(({ pattern }) => pattern.test(normalizedText));
  return keywordMatch?.icon ?? "\uD83C\uDF81";
}

function mapGiftTransactionRow(row, index) {
  const otherUserObject =
    row?.other_user ??
    row?.otherUser ??
    row?.counterparty ??
    row?.peer ??
    null;
  const senderObject =
    row?.sender ??
    row?.from_user ??
    row?.from ??
    row?.user ??
    row?.owner ??
    row?.fromUser ??
    null;
  const receiverObject =
    row?.receiver ??
    row?.to_user ??
    row?.to ??
    row?.recipient ??
    row?.target_user ??
    row?.toUser ??
    null;

  const otherUserName = pickPersonName(
    row?.other_user_name ?? row?.otherUserName ?? row?.counterparty_name,
    otherUserObject,
    ""
  );
  const senderNameRaw = pickPersonName(row?.sender_name ?? row?.from_name, senderObject, "");
  const receiverNameRaw = pickPersonName(
    row?.receiver_name ?? row?.to_name ?? row?.recipient_name,
    receiverObject,
    ""
  );

  const direction = normalizeDirection(row?.direction ?? row?.type ?? row?.transaction_type);
  const selfName = "You";
  const senderName =
    direction === "sent"
      ? senderNameRaw || selfName
      : senderNameRaw || otherUserName || selfName;
  const receiverName =
    direction === "sent"
      ? receiverNameRaw || otherUserName || selfName
      : receiverNameRaw || selfName;
  const giftName = String(
    row?.gift_name ??
      row?.gift?.name ??
      row?.title ??
      row?.name ??
      "Gift"
  ).trim() || "Gift";

  const icon = resolveGiftIcon(
    row?.gift_icon ?? row?.icon ?? row?.emoji ?? row?.gift?.icon,
    `${giftName} ${row?.title ?? ""} ${row?.name ?? ""}`
  );

  const amountRaw = row?.amount ?? row?.points ?? row?.value ?? row?.credit ?? "";
  let amountText = "";
  if (typeof amountRaw === "number") {
    const absAmount = Math.abs(amountRaw);
    amountText = `${direction === "sent" ? "-" : "+"}${absAmount}`;
  } else {
    const rawText = String(amountRaw ?? "").trim();
    if (rawText) {
      const unsignedAmountText = rawText.replace(/^[+-]\s*/, "");
      amountText = `${direction === "sent" ? "-" : "+"}${unsignedAmountText}`;
    }
  }

  const createdAt =
    (typeof row?.created_at === "string" && row.created_at.trim()) ||
    (typeof row?.date === "string" && row.date.trim()) ||
    (typeof row?.time === "string" && row.time.trim()) ||
    "";

  return {
    ...row,
    id: row?.id ?? row?.transaction_id ?? `gift-transaction-${index}`,
    giftName,
    icon,
    direction,
    sender: senderName || "",
    receiver: receiverName || "",
    from: senderName || "",
    amount: amountText,
    createdAt
  };
}

function mapGiftTransactions(response) {
  return asArray(response).map(mapGiftTransactionRow);
}

export const walletApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWalletBalance: builder.query({
      query: () => "/wallet/balance",
      providesTags: ["Wallet"]
    }),
    getWalletTransactions: builder.query({
      query: () => "/wallet/transactions",
      providesTags: ["Wallet"]
    }),
    getWalletGiftTransactions: builder.query({
      query: () => "/wallet/gift-transactions",
      transformResponse: mapGiftTransactions,
      providesTags: ["Wallet"]
    })
  })
});

export const {
  useGetWalletBalanceQuery,
  useGetWalletTransactionsQuery,
  useGetWalletGiftTransactionsQuery
} = walletApi;
