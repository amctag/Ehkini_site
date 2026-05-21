import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  status: "idle",
  error: null
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action) {
      state.list = action.payload;
      state.status = "succeeded";
      state.error = null;
    }
  }
});

export const { setProducts } = productsSlice.actions;
export default productsSlice.reducer;
