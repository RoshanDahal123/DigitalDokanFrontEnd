import { Status } from "../../../globals/type";
import { IOrderDetail } from "../../my-order-details";
export interface IProduct {
  productId: string;
  quantity: number;
  orderStatus?: string;
  totalAmount?: number;
  Payment?: {
    paymentMethod: PaymentMethod;
  };
}
export interface IOrderItems extends IProduct {
  id: string;
}

export interface IOrder {
  status: Status;
  items: IOrderItems[];
  khaltiUrl: string | null;
  orderDetail: IOrderDetail[];
}
export enum PaymentMethod {
  Esewa = "esewa",
  Khalti = "khalti",
  Cod = "cod",
}

export interface IData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  addressLine: string;
  state: string;
  city: string;
  zipCode: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  products: IProduct[];
}
