import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/type";
import { IProduct } from "../pages/product/types";
import { AppDispatch } from "./store";
import { API, APIWITHTOKEN } from "../https";
interface IProducts {
  products: IProduct[];
  status: Status;
}
const initialState: IProducts = {
  products: [],
  status: Status.LOADING,
};

const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<IProduct[]>) => {
      state.products = action.payload;
    },
    setStatus: (state: IProducts, action: PayloadAction<Status>) => {
      state.status = action.payload;
    },
    setDeleteProduct: (state: IProducts, action: PayloadAction<string>) => {
      const index = state.products.findIndex(
        (product) => product.id === action.payload
      );
      if (index !== -1) {
        state.products.splice(index, 1);
      }
    },
  },
});
export const { setProducts, setStatus, setDeleteProduct } =
  adminProductSlice.actions;
export default adminProductSlice.reducer;

export function fetchProducts() {
  return async function fetchProductsThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.get("/product");

      if (response.status === 200) {
        dispatch(setProducts(response.data.data));
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      console.error("Error fetching products:", error);
    }
  };
}
