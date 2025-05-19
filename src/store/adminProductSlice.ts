import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/type";

import { AppDispatch } from "./store";
import { API, APIWITHTOKEN } from "../https";

interface IProduct {
  productName: string;
  productDescription: string;
  productPrice: number;
  productTotalStock: number;
  productDiscount: number;
  categoryId: string;
  productImageUrl: File | string;
  id?: string;
}
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
    resetStatus: (state: IProducts) => {
      state.status = Status.LOADING;
    },
  },
});
export const { setProducts, setStatus, setDeleteProduct, resetStatus } =
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

export function addProduct(data: IProduct) {
  return async function addProductThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIWITHTOKEN.post("/product", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        dispatch(fetchProducts());
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      console.error("Error adding product:", error);
    }
  };
}
