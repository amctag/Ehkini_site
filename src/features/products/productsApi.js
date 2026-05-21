import { api } from "@/src/services/baseApi";

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Products"]
    })
  })
});

export const { useGetProductsQuery } = productsApi;
