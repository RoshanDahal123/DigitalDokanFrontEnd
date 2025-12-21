import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/type";

import { AppDispatch, RootState } from "./store";
import { API, APIWITHADMINTOKEN } from "../https";

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
  product: IProduct;
}
const initialState: IProducts = {
  products: [],
  status: Status.LOADING,
  product: {
    productName: "",
    productDescription: "",
    productPrice: 0,
    productTotalStock: 0,
    productDiscount: 0,
    categoryId: "",
    productImageUrl: "",
  },
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
    setProduct(state: IProducts, action: PayloadAction<IProduct>) {
      state.product = action.payload;
    },
  },
});
export const {
  setProducts,
  setStatus,
  setDeleteProduct,
  resetStatus,
  setProduct,
} = adminProductSlice.actions;
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
      const response = await APIWITHADMINTOKEN.post("/product", data, {
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

export function deleteProductItem(id: string) {
  return async function deleteProductItemThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIWITHADMINTOKEN.delete("/product/" + id);
      if (response.status === 200) {
        dispatch(setDeleteProduct(id));
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      console.error("Error deleting product:", error);
    }
  };
}

export function updateProduct(data: IProduct) {
  return async function updateProductThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));

    try {
      const response = await APIWITHADMINTOKEN.post(
        "/product/" + data.id,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        //dispatch(fetchProducts());
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setProduct(response.data.data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      console.error("Error updating product:", error);
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
      //@ts-ignore
      (product: IProduct) => product.id === id
    );
    if (productExist) {
      //@ts-ignore
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
