import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IData, IOrder, IOrderItems } from "../pages/checkout/types";
import { Status } from "../globals/type";
import { APIWITHTOKEN } from "../https";
import { AppDispatch } from "./store";
import { IOrderDetail, OrderStatus } from "../pages/my-order-details";

const initialState: IOrder = {
  items: [],
  status: Status.LOADING,
  khaltiUrl: null,
  orderDetail: [],
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
    setOrderDetails(state: IOrder, action: PayloadAction<IOrderDetail[]>) {
      state.orderDetail = action.payload;
    },
    updateOrderStatusToCancel(
      state: IOrder,
      action: PayloadAction<{ orderId: string }>
    ) {
      const orderId = action.payload.orderId;

      const data = state.orderDetail.find((order) => order.orderId === orderId);

      if (data) {
        data.Order.orderStatus = OrderStatus.Cancelled;
      }
    },
    updateOrderStatusinSlice(
      state: IOrder,
      action: PayloadAction<{
        status: OrderStatus;
        userId: string;
        orderId: string;
      }>
    ) {
      const { status, orderId } = action.payload;
      const updateOrder = state.items.map((order) =>
        order.id == orderId ? { ...order, orderStatus: status } : order
      );
      console.log(updateOrder, "UO");
      state.items = updateOrder;
    },
  },
});

export default orderSlice.reducer;
export const {
  setItems,
  setStatus,
  setKhaltiUrl,
  setOrderDetails,
  updateOrderStatusToCancel,
  updateOrderStatusinSlice,
} = orderSlice.actions;

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
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function fetchMyOrders() {
  return async function fetchMyOrdersThunk(dispatch: AppDispatch) {
    try {
      const response = await APIWITHTOKEN.get("/order");
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setItems(response.data.data));
      }
      if (response.data.url) {
        dispatch(setKhaltiUrl(response.data.url));
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function fetchMyOrderDetail(id: string) {
  return async function fetchMyOrderDetailThunk(dispatch: AppDispatch) {
    try {
      const response = await APIWITHTOKEN.get("/order/" + id);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setOrderDetails(response.data.data));
      }
      if (response.data.url) {
        dispatch(setKhaltiUrl(response.data.url));
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}
export function cancelMyOrder(id: string) {
  return async function cancelMyOrderThunk(dispatch: AppDispatch) {
    try {
      const response = await APIWITHTOKEN.patch("/order/cancel-order/" + id);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(updateOrderStatusToCancel({ orderId: id }));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}
