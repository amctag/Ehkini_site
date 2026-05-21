import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  status: "idle",
  error: null
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.list = action.payload;
      state.status = "succeeded";
      state.error = null;
    }
  }
});

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer;
