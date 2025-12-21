import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/type";
import { AppDispatch } from "./store";
import { APIWITHADMINTOKEN } from "../https";
import { IOrderDetail, OrderStatus } from "../pages/my-order-details";

export interface IAdminOrder {
  id: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  Payment: IAdminPayment;
}
export interface IAdminPayment {
  paymentMethod: string;
  paymentStatus: string;
}
export interface IOrderInitialState {
  items: IAdminOrder[];
  status: Status;
  orderDetail: IOrderDetail[];
}
const initialState: IOrderInitialState = {
  items: [],
  status: Status.LOADING,
  orderDetail: [],
};
const adminOrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setItems(state: IOrderInitialState, action: PayloadAction<IAdminOrder[]>) {
      state.items = action.payload;
    },
    setOrderDetails(
      state: IOrderInitialState,
      action: PayloadAction<IOrderDetail[]>
    ) {
      state.orderDetail = action.payload;
    },
    setStatus(state: IOrderInitialState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },

    resetStatus(state: IOrderInitialState) {
      state.status = Status.LOADING;
    },
  },
});

export const { setItems, setStatus, resetStatus, setOrderDetails } =
  adminOrderSlice.actions;
export default adminOrderSlice.reducer;

export function fetchAllOrder() {
  return async function fetchAllOrderThunk(dispatch: AppDispatch) {
    try {
      const response = await APIWITHADMINTOKEN.get("/order/all");
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setItems(response.data.data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function fetchAdminOrderDetail(id: string) {
  return async function fetchAdminOrderDetailThunk(dispatch: AppDispatch) {
    try {
      const response = await APIWITHADMINTOKEN.get("/order/" + id);

      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setOrderDetails(response.data.data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
    }
  };
}
