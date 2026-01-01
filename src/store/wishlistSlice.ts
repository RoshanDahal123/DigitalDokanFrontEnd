import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";
import { API, APIWITHTOKEN } from "../https";

interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  Product: {
    id: string;
    productName: string;
    productDescription: string;
    productPrice: number;
    productImageUrl: string;
    productDiscount: number;
    productTotalStock: number;
  };
}

interface WishlistState {
  wishlist: Wishlist[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlist: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist(state, action: PayloadAction<Wishlist[]>) {
      state.wishlist = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    removeFromWishlistState(state, action: PayloadAction<string>) {
      state.wishlist = state.wishlist.filter(
        (item) => item.productId !== action.payload
      );
    },
  },
});

export const { setWishlist, setLoading, setError, removeFromWishlistState } =
  wishlistSlice.actions;

// Thunk actions
export const fetchWishlist = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await APIWITHTOKEN.get("/wishlist");
      if (response.status === 200) {
        dispatch(setWishlist(response.data.data));
      }
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || "Failed to fetch wishlist"));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const addToWishlist = (productId: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await APIWITHTOKEN.post("/wishlist", { productId });
      if (response.status === 201) {
        dispatch(fetchWishlist());
        return { success: true };
      }
    } catch (error: any) {
      console.error("Add to wishlist error:", error);
      const message = error.response?.data?.message || "Failed to add to wishlist";
      dispatch(setError(message));
      alert(message);
      return { success: false, message };
    }
  };
};

export const removeFromWishlist = (productId: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await APIWITHTOKEN.delete(`/wishlist/${productId}`);
      if (response.status === 200) {
        dispatch(removeFromWishlistState(productId));
        return { success: true };
      }
    } catch (error: any) {
      console.error("Remove from wishlist error:", error);
      const message = error.response?.data?.message || "Failed to remove from wishlist";
      dispatch(setError(message));
      return { success: false, message };
    }
  };
};

export const checkWishlistStatus = (productId: string) => {
  return async () => {
    try {
      const response = await APIWITHTOKEN.get(`/wishlist/${productId}`);
      return response.data.data.inWishlist;
    } catch (error) {
      return false;
    }
  };
};

export default wishlistSlice.reducer;
