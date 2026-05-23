import { createSlice } from "@reduxjs/toolkit";
import { clearAuth } from "@/src/features/auth/authSlice";

const initialState = {
  list: [],
  status: "idle",
  error: null,
  recentNameById: {},
  recentSearchRows: []
};

function isMeaningfulUserName(value) {
  const normalized = String(value ?? "").trim();
  if (!normalized) return false;

  const isGenericUser = normalized.toLowerCase() === "user";
  const isUserWithId = /^user\s*#\s*[\w-]+$/i.test(normalized);
  return !isGenericUser && !isUserWithId;
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.list = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    cacheRecentUserName(state, action) {
      const id = action.payload?.id ?? action.payload?.user_id;
      const name = action.payload?.name ?? action.payload?.full_name;
      const idKey = String(id ?? "").trim();
      const nameValue = String(name ?? "").trim();

      if (!idKey || !isMeaningfulUserName(nameValue)) return;
      state.recentNameById[idKey] = nameValue;
    },
    cacheRecentUserNames(state, action) {
      const rows = Array.isArray(action.payload) ? action.payload : [];
      for (const row of rows) {
        const id = row?.id ?? row?.user_id;
        const name = row?.name ?? row?.full_name;
        const idKey = String(id ?? "").trim();
        const nameValue = String(name ?? "").trim();

        if (!idKey || !isMeaningfulUserName(nameValue)) continue;
        state.recentNameById[idKey] = nameValue;
      }
    },
    setRecentSearchRows(state, action) {
      const rows = Array.isArray(action.payload) ? action.payload : [];

      state.recentSearchRows = rows.map((row, index) => {
        if (typeof row === "number" || typeof row === "string") {
          const id = String(row).trim();
          return {
            id: id || `recent-${index}`,
            user_id: id || null,
            name: "",
            full_name: "",
            search_name: ""
          };
        }

        const id = row?.user_id ?? row?.id ?? "";
        return {
          ...row,
          id: id || row?.id || `recent-${index}`,
          user_id: id || row?.user_id || null,
          name: String(row?.name ?? "").trim(),
          full_name: String(row?.full_name ?? "").trim(),
          search_name: String(row?.search_name ?? "").trim()
        };
      });
    },
    upsertRecentSearchRow(state, action) {
      const row = action.payload;
      if (!row || typeof row !== "object") return;

      const id = String(row?.user_id ?? row?.id ?? "").trim();
      if (!id) return;

      const normalizedRow = {
        ...row,
        id,
        user_id: id,
        name: String(row?.name ?? "").trim(),
        full_name: String(row?.full_name ?? "").trim(),
        search_name: String(row?.search_name ?? "").trim()
      };

      state.recentSearchRows = [
        normalizedRow,
        ...state.recentSearchRows.filter((item) => {
          const itemId = String(item?.user_id ?? item?.id ?? "").trim();
          return itemId !== id;
        })
      ];
    },
    removeRecentSearchRow(state, action) {
      const idKey = String(action.payload ?? "").trim();
      if (!idKey) return;
      state.recentSearchRows = state.recentSearchRows.filter((row) => {
        const rowId = String(row?.user_id ?? row?.id ?? "").trim();
        return rowId !== idKey;
      });
    },
    clearRecentSearchRows(state) {
      state.recentSearchRows = [];
    },
    removeRecentUserName(state, action) {
      const idKey = String(action.payload ?? "").trim();
      if (!idKey) return;
      delete state.recentNameById[idKey];
    },
    clearRecentUserNames(state) {
      state.recentNameById = {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(clearAuth, () => initialState);
  }
});

export const {
  setUsers,
  cacheRecentUserName,
  cacheRecentUserNames,
  setRecentSearchRows,
  upsertRecentSearchRow,
  removeRecentSearchRow,
  clearRecentSearchRows,
  removeRecentUserName,
  clearRecentUserNames
} = usersSlice.actions;

export const selectRecentUserNameById = (state, id) => {
  const idKey = String(id ?? "").trim();
  if (!idKey) return "";
  return state.users?.recentNameById?.[idKey] ?? "";
};

export const selectRecentUserNameMap = (state) => state.users?.recentNameById ?? {};
export const selectRecentSearchRows = (state) => state.users?.recentSearchRows ?? [];

export default usersSlice.reducer;
