import { api } from "@/src/services/baseApi";

export const walletApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWalletBalance: builder.query({
      query: () => "/wallet/balance",
      providesTags: ["Wallet"]
    }),
    getWalletTransactions: builder.query({
      query: () => "/wallet/transactions",
      providesTags: ["Wallet"]
    })
  })
});

export const {
  useGetWalletBalanceQuery,
  useGetWalletTransactionsQuery
} = walletApi;
