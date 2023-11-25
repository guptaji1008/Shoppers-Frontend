import { PRODUCTS_URL, UPLOAD_URL } from "../constant.js";
import { apiSlice } from "./apiSlice.js";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ pageNo, keyword }) => ({
        url: PRODUCTS_URL,
        params: { pageNo, keyword },
        
      }),
      providesTags: ["Products"],
      keepUnusedDataFor: 5,
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/allproducts`,
      }),
      providesTags: ["Products"],
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data._id}/image`,
        method: "PUT",
        body: data.formData,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data._id}/reviews`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Product'],
    }),
    updateReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data._id}/reviews`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Product'],
    }),
    deleteReview: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews`,
        method: 'DELETE',
      }),
    }),
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetTopProductsQuery,
  useGetAllProductsQuery
} = productApiSlice;
