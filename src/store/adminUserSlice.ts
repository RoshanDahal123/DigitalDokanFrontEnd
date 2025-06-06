import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/type";
import { AppDispatch } from "./store";
import { APIWITHADMINTOKEN } from "../https";

export interface IUser {
  id: string;
  username: string;
  email: string;
}
interface IInitailState {
  users: IUser[];
  status: Status;
}

const initialState: IInitailState = {
  users: [],
  status: Status.LOADING,
};

const adminUserSlice = createSlice({
  name: "adminUser",
  initialState,
  reducers: {
    setAdminUser: (state: IInitailState, action: PayloadAction<IUser[]>) => {
      state.users = action.payload;
    },
    setRemoveUser(state: IInitailState, action: PayloadAction<string>) {
      const index = state.users.findIndex((user) => user.id === action.payload);
      if (index !== -1) {
        state.users.splice(index, 1);
      }
    },
    setStatus(state: IInitailState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
  },
});
export const { setAdminUser, setRemoveUser, setStatus } =
  adminUserSlice.actions;
export default adminUserSlice.reducer;

export function fetchUsers() {
  return async function fetchUsersThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIWITHADMINTOKEN.get("/auth/users");
      const data = response.data.data;
      if (response.status === 200) {
        dispatch(setAdminUser(data));
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
        console.error("Error fetching users:", response.data.message);
      }
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      console.error("Error fetching users:", error);
    }
  };
}

export function deleteUserById(id: string) {
  return async function deleteUserByIdThunk(dispatch: AppDispatch) {
    try {
      const response = await APIWITHADMINTOKEN.delete("/auth/users/" + id);
      if (response.status === 200) {
        dispatch(setRemoveUser(id));
      } else {
        console.error("Error deleting user:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
}
