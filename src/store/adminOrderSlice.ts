import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/type";
import { AppDispatch } from "./store";
import { APIWITHTOKEN } from "../https";
import { OrderStatus } from "../pages/my-order-details";

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
}
const initialState: IOrderInitialState = {
  items: [],
  status: Status.LOADING,
};
const adminOrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setItems(state: IOrderInitialState, action: PayloadAction<IAdminOrder[]>) {
      state.items = action.payload;
    },
    setStatus(state: IOrderInitialState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },

    resetStatus(state: IOrderInitialState) {
      state.status = Status.LOADING;
    },
  },
});

export const { setItems, setStatus, resetStatus } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;

export function fetchAllOrder() {
  return async function fetchAllOrderThunk(dispatch: AppDispatch) {
    try {
      const response = await APIWITHTOKEN.get("/order/all");
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setItems(response.data.data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}

// export function deleteCategoryItem(id: string) {
//   return async function deleteCategoryThunk(dispatch: AppDispatch) {
//     try {
//       const response = await APIWITHTOKEN.delete("/category/" + id);
//       if (response.status === 200) {
//         dispatch(setDeleteCategoryItem(id));
//         dispatch(setStatus(Status.SUCCESS));
//       } else {
//         dispatch(setStatus(Status.ERROR));
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
// }
