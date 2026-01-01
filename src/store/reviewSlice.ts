import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";
import { API, APIWITHTOKEN } from "../https";

interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  User: {
    id: string;
    username: string;
    email: string;
  };
}

interface ProductReviews {
  reviews: Review[];
  averageRating: string;
  totalReviews: number;
}

interface ReviewState {
  productReviews: ProductReviews;
  userReviews: Review[];
  userProductReview: Review | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  productReviews: {
    reviews: [],
    averageRating: "0",
    totalReviews: 0,
  },
  userReviews: [],
  userProductReview: null,
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setProductReviews(state, action: PayloadAction<ProductReviews>) {
      state.productReviews = action.payload;
    },
    setUserReviews(state, action: PayloadAction<Review[]>) {
      state.userReviews = action.payload;
    },
    setUserProductReview(state, action: PayloadAction<Review | null>) {
      state.userProductReview = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setProductReviews,
  setUserReviews,
  setUserProductReview,
  setLoading,
  setError,
} = reviewSlice.actions;

// Thunk actions
export const fetchProductReviews = (productId: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await API.get(`/review/product/${productId}`);
      if (response.status === 200) {
        dispatch(setProductReviews(response.data.data));
      }
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message || "Failed to fetch reviews"));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const addReview = (data: {
  productId: string;
  rating: number;
  comment: string;
}) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await APIWITHTOKEN.post("/review", data);
      if (response.status === 201 || response.status === 200) {
        dispatch(fetchProductReviews(data.productId));
        dispatch(fetchUserProductReview(data.productId));
        alert(response.data.message || "Review submitted successfully!");
        return { success: true };
      }
    } catch (error: any) {
      console.error("Add review error:", error);
      const message = error.response?.data?.message || "Failed to add review";
      dispatch(setError(message));
      alert(message);
      return { success: false, message };
    }
  };
};

export const fetchUserProductReview = (productId: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await APIWITHTOKEN.get(
        `/review/user-product/${productId}`
      );
      if (response.status === 200) {
        dispatch(setUserProductReview(response.data.data));
      }
    } catch (error: any) {
      console.error("Fetch user review error:", error);
      dispatch(setUserProductReview(null));
    }
  };
};

export const deleteReview = (reviewId: string, productId: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await APIWITHTOKEN.delete(`/review/${reviewId}`);
      if (response.status === 200) {
        dispatch(fetchProductReviews(productId));
        dispatch(setUserProductReview(null));
        alert("Review deleted successfully!");
      }
    } catch (error: any) {
      console.error("Delete review error:", error);
      const message = error.response?.data?.message || "Failed to delete review";
      dispatch(setError(message));
      alert(message);
    }
  };
};

export default reviewSlice.reducer;
