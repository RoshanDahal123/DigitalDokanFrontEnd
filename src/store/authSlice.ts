import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IAuthState, ILoginUser, IUser } from "../pages/user/types";
import { Status } from "../globals/type";

import { AppDispatch } from "./store";
import { API } from "../https";

const initialState: IAuthState = {
  user: {
    username: null,
    email: null,
    password: null,
    token: null,
  },
  status: Status.LOADING,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state: IAuthState, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
    setStatus(state: IAuthState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setToken(state: IAuthState, action: PayloadAction<string>) {
      state.user.token = action.payload;
    },
    removeToken(state: IAuthState) {
      state.user.token = null;
    },
  },
});
export const { setUser, setStatus, setToken, removeToken } = authSlice.actions;
export default authSlice.reducer;

export function registerUser(data: IUser) {
  return async function registerUserThunk(dispatch: AppDispatch) {
    try {
      const response = await API.post("auth/register", data);
      if (response.status === 201) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setUser(data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function loginUser(data: ILoginUser) {
  return async function loginUserThunk(dispatch: AppDispatch) {
    try {
      const response = await API.post("auth/login", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));

        if (response.data.user.role === "admin" && response.data.token) {
          localStorage.setItem("adminToken", response.data.token);
          dispatch(setToken(response.data.token));
        } else if (
          response.data.user.role === "customer" &&
          response.data.token
        ) {
          localStorage.setItem("token", response.data.token);
          dispatch(setToken(response.data.token));
        }
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function forgotPassword(data: { email: string }) {
  return async function forgotPasswordThunk(dispatch: AppDispatch) {
    try {
      const response = await API.post("auth/forgot-password", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function logoutUser() {
  return async function logoutUserThunk(dispatch: AppDispatch) {
    try {
      dispatch(removeToken());
      localStorage.removeItem("token");
      dispatch(setStatus(Status.SUCCESS));
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}
