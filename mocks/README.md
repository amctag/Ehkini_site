# Mocks

API-shaped mock data for local development. Populated from `src/messages/en.json` demo content.

- `data/` — response payloads (match future backend contracts)
- `data/index.js` — barrel re-exports for convenient imports
- Wired via mock `baseQuery` when `NEXT_PUBLIC_USE_MOCK=true` — see **[WIRING.md](./WIRING.md)**

**Note:** UI labels (page titles, buttons) stay in i18n. Mocks hold content/data fields only.
Some mocks add `id`, `slug`, and `userId` for API-style linking across features.
