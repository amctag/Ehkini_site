# How mock data is wired

Turn mocks on in `.env.local` (copy from `.env.local.example`):

```env
NEXT_PUBLIC_USE_MOCK=true
```

Restart `npm run dev` after changing env vars.

Demo login password (when you wire `LoginCard`): **`demo`** (any identifier).

---

## The chain (every feature)

```
Page component
  → RTK hook (e.g. useGetDiscoverPeopleQuery)
    → src/features/discover/discoverApi.js (endpoint URL)
      → src/services/baseApi.js (baseQuery: mock OR fetch)
        → mocks/handlers/*.js (match URL → return data)
          → mocks/data/*.js (JSON-shaped payloads)
```

Side effects:

- **auth `getMe` success** → `listenerMiddleware` → `authSlice.setUser`
- **401** → `clearAuth` in `mockBaseQuery` / `realBaseQuery`
- **logout success** → listener → `clearAuth`

---

## 1. Auth — `GET /auth/me`

| Layer | File | Role |
|-------|------|------|
| Trigger | `src/providers/AuthBootstrap.jsx` | On load: `api.endpoints.getMe.initiate()` |
| Endpoint | `src/features/auth/authApi.js` | `query: () => "/auth/me"` |
| Handler | `mocks/handlers/auth.js` | Returns `mockCurrentUser` |
| Data | `mocks/data/auth/user.js` | User object |
| UI state | `src/app/listenerMiddleware.js` | `setUser(payload)` on success |

**Check:** Redux DevTools → `auth` slice has `user` after ~200ms.

---

## 2. Auth — login / logout

| Endpoint | Handler | Notes |
|----------|---------|-------|
| `POST /auth/login` | `auth.js` | Body `{ identifier, password }`; password must be `demo` |
| `POST /auth/logout` | `auth.js` | Returns `{ ok: true }`; listener clears auth |
| `POST /auth/register` | `auth.js` | Always succeeds in mock |

`authApi` login already chains `getMe` after success.

---

## 3. Discover — people & stories

| Hook | URL | Handler | Data |
|------|-----|---------|------|
| `useGetDiscoverPeopleQuery` | `/discover/people` | `discover.js` | `discover/people.js` |
| `useGetDiscoverStoriesQuery` | `/discover/stories` | `discover.js` | `discover/stories.js` |

**Wired in UI:** `components/DiscoverPage.jsx` (`Stories`, `People`).

---

## 4. Profiles — by slug

| Hook | URL | Handler | Data |
|------|-----|---------|------|
| `useGetProfileBySlugQuery(slug)` | `/profiles/:slug` | `profiles.js` | `profiles/by-slug.js` |

**Wired in UI:** `components/ProfileViewPage.jsx`. Unknown slugs still use client fallback UI.

---

## 5. Messages

| Hook | URL | Handler | Data |
|------|-----|---------|------|
| `useGetContactsQuery` | `/messages/contacts` | `messages.js` | `messages/contacts.js` |
| `useGetThreadQuery(contactId)` | `/messages/threads/:id` | `messages.js` | `messages/threads.js` |

**Not wired in UI yet** — still uses `t.raw()` in `MessagesPage.jsx`. To migrate:

```jsx
const { data: contacts = [] } = useGetContactsQuery();
const { data: thread } = useGetThreadQuery(contactId, { skip: !contactId });
```

Map `thread.messages` to bubbles (note `variant` vs old `kind` strings).

---

## 6. Friends

| Hook | URL | Data file |
|------|-----|-----------|
| `useGetFriendsQuery` | `/friends` | `friends/list.js` |
| `useGetFriendSuggestionsQuery` | `/friends/suggestions` | `friends/suggestions.js` |

Wire in `FriendsPage.jsx` same as Discover.

---

## 7. Gifts

| Hook | URL | Data |
|------|-----|------|
| `useGetGiftCatalogQuery` | `/gifts/catalog` | `gifts/catalog.js` |

Wire in `GiftMarketPage.jsx`: `data.categories`, `data.gifts`.

---

## 8. Wallet

| Hook | URL | Data |
|------|-----|------|
| `useGetWalletBalanceQuery` | `/wallet/balance` | `wallet/balance.js` |
| `useGetWalletTransactionsQuery` | `/wallet/transactions` | `wallet/transactions.js` |

Wire in `WalletPage.jsx` (replace hardcoded `$20` / `t.raw("transactions")`).

---

## 9. Settings — blocked users

| Hook | URL | Data |
|------|-----|------|
| `useGetBlockedUsersQuery` | `/settings/blocked-users` | `settings/users.js` (`mockBlockedUsers`) |

Wire in `SettingsPage.jsx` `BlockedUsersModal`.

---

## Switching to the real API

1. Set `NEXT_PUBLIC_USE_MOCK=false`
2. Point `API_URL` + Next rewrites at your backend
3. Keep the same paths in `*Api.js` files
4. Adjust `mocks/data` shapes to match real responses (or transform in handlers)

---

## Adding a new endpoint

1. Add payload in `mocks/data/...`
2. Add route in `mocks/handlers/....js` and register in `handlers/index.js`
3. Add `injectEndpoints` in `src/features/<feature>/<feature>Api.js`
4. `import "./xxxApi"` in `src/app/store.js`
5. Use the generated hook in a component

