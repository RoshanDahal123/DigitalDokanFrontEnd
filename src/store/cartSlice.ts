import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICartInitialState, ICartItem } from "../pages/cart/types";
import { Status } from "../globals/type";

const initialState: ICartInitialState = {
  items: [],
  status: Status.LOADING,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItem(state: ICartInitialState, action: PayloadAction<ICartItem[]>) {
      state.items = action.payload;
    },
    setStatus(state: ICartInitialState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
  },
});
export const { setItem, setStatus } = cartSlice.actions;
export default cartSlice.reducer;
