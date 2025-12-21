import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct, IProducts } from "../pages/product/types";
import { Status } from "../globals/type";
import { AppDispatch, RootState } from "./store";
import { API } from "../https";

const initialState: IProducts = {
  products: [],
  status: Status.LOADING,
  product: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts(state: IProducts, action: PayloadAction<IProduct[]>) {
      state.products = action.payload;
    },
    setStatus(state: IProducts, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setProduct(state: IProducts, action: PayloadAction<IProduct>) {
      state.product = action.payload;
    },
  },
});
export const { setProducts, setStatus, setProduct } = productSlice.actions;
export default productSlice.reducer;

export function fetchProducts() {
  return async function fetchProductsThunk(dispatch: AppDispatch) {
    try {
      const response = await API.get("product");
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        //response.data must be written for every response
        dispatch(setProducts(response.data.data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function fetchProduct(id: string) {
  return async function fetchProductsThunk(
    dispatch: AppDispatch,
    getState: () => RootState
  ) {
    const store = getState();
    const productExist = store.products.products.find(
      (product: IProduct) => product.id === id
    );
    if (productExist) {
      dispatch(setProduct(productExist));
      dispatch(setStatus(Status.SUCCESS));
    }

    try {
      const response = await API.get("product/" + id);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setProduct(response.data.data[0]));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
    }
  };
}
