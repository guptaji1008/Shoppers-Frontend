import { PRODUCTS_URL } from "../constant.js";
import { apiSlice } from "./apiSlice.js";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
        query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`
        }),
    }),
  }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery } = productApiSlice
