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
  error: null,
  successMessage: null,
  otpVerified: localStorage.getItem("otpVerified") === "true",
  resetEmail: localStorage.getItem("resetEmail"),
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
    setError(state: IAuthState, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSuccessMessage(state: IAuthState, action: PayloadAction<string | null>) {
      state.successMessage = action.payload;
    },
    clearMessages(state: IAuthState) {
      state.error = null;
      state.successMessage = null;
    },
    setOtpVerified(state: IAuthState, action: PayloadAction<boolean>) {
      state.otpVerified = action.payload;
    },
    setResetEmail(state: IAuthState, action: PayloadAction<string | null>) {
      state.resetEmail = action.payload;
    },
    clearResetState(state: IAuthState) {
      state.otpVerified = false;
      state.resetEmail = null;
      state.error = null;
      state.successMessage = null;
      // Clear from localStorage as well
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("otpVerified");
    },
  },
});
export const { setUser, setStatus, setToken, removeToken, setError, setSuccessMessage, clearMessages, setOtpVerified, setResetEmail, clearResetState } = authSlice.actions;
export default authSlice.reducer;

export function registerUser(data: IUser) {
  return async function registerUserThunk(dispatch: AppDispatch) {
    try {
      dispatch(clearMessages());
      dispatch(setStatus(Status.LOADING));
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email || "")) {
        dispatch(setError("Please enter a valid email address"));
        dispatch(setStatus(Status.ERROR));
        return;
      }

      // Password validation
      if (!data.password || data.password.length < 8) {
        dispatch(setError("Password must be at least 8 characters long"));
        dispatch(setStatus(Status.ERROR));
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(data.password)) {
        dispatch(setError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"));
        dispatch(setStatus(Status.ERROR));
        return;
      }

      const response = await API.post("auth/register", data);
      if (response.status === 201) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setSuccessMessage("Registration successful! Please check your email for verification instructions."));
        dispatch(setUser(data));
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Registration failed. Please try again."));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again later.";
      dispatch(setError(errorMessage));
    }
  };
}

export function loginUser(data: ILoginUser) {
  return async function loginUserThunk(dispatch: AppDispatch) {
    try {
      dispatch(clearMessages());
      dispatch(setStatus(Status.LOADING));

      const response = await API.post("auth/login", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setSuccessMessage("Login successful!"));

        if (response.data.user.role === "admin" && response.data.token) {
          localStorage.setItem("adminToken", response.data.token);
          localStorage.removeItem("token");
          dispatch(setToken(response.data.token));
        } else if (
          response.data.user.role === "customer" &&
          response.data.token
        ) {
          localStorage.setItem("token", response.data.token);
          localStorage.removeItem("adminToken");
          dispatch(setToken(response.data.token));
        }
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Login failed. Please try again."));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      
      // Generic error message for security
      const errorMessage = error.response?.status === 400 
        ? "Credentials not matched. Please check your email and password." 
        : "Login failed. Please try again later.";
      dispatch(setError(errorMessage));
    }
  };
}

export function forgotPassword(data: { email: string }) {
  return async function forgotPasswordThunk(dispatch: AppDispatch) {
    try {
      dispatch(clearMessages());
      dispatch(setStatus(Status.LOADING));

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        dispatch(setError("Please enter a valid email address"));
        dispatch(setStatus(Status.ERROR));
        return;
      }

      const response = await API.post("auth/forget-password", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setSuccessMessage("Password reset OTP has been sent to your email. Please check your inbox."));
        dispatch(setResetEmail(data.email));
        dispatch(setOtpVerified(false));
        // Persist to localStorage to survive tab switches
        localStorage.setItem("resetEmail", data.email);
        localStorage.removeItem("otpVerified");
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to send reset link. Please try again."));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      const errorMessage = error.response?.data?.message || "Failed to send reset link. Please try again later.";
      dispatch(setError(errorMessage));
    }
  };
}

export function verifyOtp(data: { email: string; otp: string }) {
  return async function verifyOtpThunk(dispatch: AppDispatch) {
    try {
      dispatch(clearMessages());
      dispatch(setStatus(Status.LOADING));

      const response = await API.post("auth/verify-otp", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setSuccessMessage("OTP verified successfully. You can now reset your password."));
        dispatch(setOtpVerified(true));
        // Persist to localStorage
        localStorage.setItem("otpVerified", "true");
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Invalid or expired OTP. Please try again."));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      const errorMessage = error.response?.data?.message || "OTP verification failed. Please try again.";
      dispatch(setError(errorMessage));
    }
  };
}

export function resetPassword(data: { email: string; newPassword: string; confirmPassword: string }) {
  return async function resetPasswordThunk(dispatch: AppDispatch) {
    try {
      dispatch(clearMessages());
      dispatch(setStatus(Status.LOADING));

      // Password validation
      if (data.newPassword.length < 8) {
        dispatch(setError("Password must be at least 8 characters long"));
        dispatch(setStatus(Status.ERROR));
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(data.newPassword)) {
        dispatch(setError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"));
        dispatch(setStatus(Status.ERROR));
        return;
      }

      if (data.newPassword !== data.confirmPassword) {
        dispatch(setError("Passwords do not match"));
        dispatch(setStatus(Status.ERROR));
        return;
      }

      const response = await API.post("auth/reset-password", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setSuccessMessage("Password reset successfully! You can now login with your new password."));
        // Don't clear state here - let ResetPassword component handle it after showing success
      } else {
        dispatch(setStatus(Status.ERROR));
        dispatch(setError("Failed to reset password. Please try again."));
      }
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      const errorMessage = error.response?.data?.message || "Failed to reset password. Please try again later.";
      dispatch(setError(errorMessage));
    }
  };
}

export function logoutUser() {
  return async function logoutUserThunk(dispatch: AppDispatch) {
    try {
      dispatch(removeToken());
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      dispatch(setStatus(Status.SUCCESS));
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
    }
  };
}
