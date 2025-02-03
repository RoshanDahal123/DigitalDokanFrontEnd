export enum Status {
  SUCCESS = "success",
  LOADING = "loading",
  ERROR = "error",
}
export interface IUser {
  username: string | null;
  email: string | null;
  password: string | null;
}
export interface IAuthState {
  user: IUser;
  status: Status;
}
export interface ILoginUser {
  email: string;
  password: string;
}
