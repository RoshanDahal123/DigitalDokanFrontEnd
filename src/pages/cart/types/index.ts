import { Status } from "../../../globals/type";

export interface ICartProduct {
  id: string;
  productName: string;
  productImageUrl: string;
  productPrice: number;
}
export interface ICartItem {
  Product: ICartProduct;
  productId: string;
  quantity: number;
  id: string;
}
export interface ICartItems {
  items: ICartItem[];
  status: Status;
}
export interface ICartInitialState {
  items: ICartItem[];
  status: Status;
}
