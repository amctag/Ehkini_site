import { api } from "./api";

export const messagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query({
      query: () => "/messages/contacts",
      providesTags: ["Messages"]
    }),
    getThread: builder.query({
      query: (contactId) => `/messages/threads/${contactId}`,
      providesTags: (_result, _error, contactId) => [
        { type: "Messages", id: contactId }
      ]
    })
  })
});

export const { useGetContactsQuery, useGetThreadQuery } = messagesApi;
