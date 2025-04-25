import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IData, IOrder, IOrderItems } from "../pages/checkout/types";
import { Status } from "../globals/type";
import { APIWITHTOKEN } from "../https";
import { AppDispatch } from "./store";
const initialState: IOrder = {
  items: [],
  status: Status.LOADING,
  khaltiUrl: null,
};
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setItems(state: IOrder, action: PayloadAction<IOrderItems[]>) {
      state.items = action.payload;
    },
    setStatus(state: IOrder, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setKhaltiUrl(state: IOrder, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
  },
});

export default orderSlice.reducer;
const { setItems, setStatus, setKhaltiUrl } = orderSlice.actions;

export function orderItem(data: IData) {
  return async function orderItemThunk(dispatch: AppDispatch) {
    try {
      const response = await APIWITHTOKEN.post("/order", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setItems(response.data.data));
      }
      if (response.data.url) {
        dispatch(setKhaltiUrl(response.data.url));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}
