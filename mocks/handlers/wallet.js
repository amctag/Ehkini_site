import { mockWalletBalance } from "@/mocks/data/wallet/balance";
import { mockWalletTransactions } from "@/mocks/data/wallet/transactions";

export function handleWallet({ url, method }) {
  if (method !== "GET") return null;

  if (url === "/wallet/balance") {
    return { data: mockWalletBalance };
  }

  if (url === "/wallet/transactions") {
    return { data: mockWalletTransactions };
  }

  return null;
}
