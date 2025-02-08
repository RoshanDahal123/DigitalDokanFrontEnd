import { Status } from "../../../globals/type";

export interface IUser {
  username: string | null;
  email: string | null;
  password: string | null;
  token: string | null;
}
export interface IAuthState {
  user: IUser;
  status: Status;
}
export interface ILoginUser {
  email: string;
  password: string;
}
