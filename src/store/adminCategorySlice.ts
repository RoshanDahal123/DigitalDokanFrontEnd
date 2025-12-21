import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/type";
import { AppDispatch } from "./store";
import { API, APIWITHADMINTOKEN } from "../https";

interface ICategory {
  id: string;
  categoryName: string;
}
interface ICategoryInitialState {
  items: ICategory[];
  status: Status;
}
const initialState: ICategoryInitialState = {
  items: [],
  status: Status.LOADING,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setItems(state: ICategoryInitialState, action: PayloadAction<ICategory[]>) {
      state.items = action.payload;
    },
    setStatus(state: ICategoryInitialState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    addCategoryItems(
      state: ICategoryInitialState,
      action: PayloadAction<ICategory>
    ) {
      state.items.push(action.payload);
    },
    setDeleteCategoryItem(
      state: ICategoryInitialState,
      action: PayloadAction<string>
    ) {
      const index = state.items.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
    resetStatus(state: ICategoryInitialState) {
      state.status = Status.LOADING;
    },
  },
});

export const {
  setItems,
  setStatus,
  setDeleteCategoryItem,
  addCategoryItems,
  resetStatus,
} = categorySlice.actions;
export default categorySlice.reducer;

export function fetchCategories() {
  return async function fetchCategoriesThunk(dispatch: AppDispatch) {
    try {
      const response = await API.get("/category");
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

export function deleteCategoryItem(id: string) {
  return async function deleteCategoryThunk(dispatch: AppDispatch) {
    try {
      const response = await APIWITHADMINTOKEN.delete("/category/" + id);
      if (response.status === 200) {
        dispatch(setDeleteCategoryItem(id));
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      // Error handling
    }
  };
}

export function addCategoryItem(categoryName: string) {
  return async function addCategoryThunk(dispatch: AppDispatch) {
    try {
      const response = await APIWITHADMINTOKEN.post("/category", {
        categoryName,
      });
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(addCategoryItems(response.data.data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      // Error handling
    }
  };
}
