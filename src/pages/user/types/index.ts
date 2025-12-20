import { Status } from "../../../globals/type";

export interface IUser {
  username: string | null;
  email: string | null;
  password: string | null;
  token?: string | null;
}
export interface IAuthState {
  user: IUser;
  status: Status;
  error: string | null;
  successMessage: string | null;
  otpVerified: boolean;
  resetEmail: string | null;
}
export interface ILoginUser {
  email: string;
  password: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IVerifyOtp {
  email: string;
  otp: string;
}

export interface IResetPassword {
  email: string;
  newPassword: string;
  confirmPassword: string;
}
