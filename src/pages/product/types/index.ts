import { Status } from "../../../globals/type";

export interface ICategory {
  id: string;
  categoryName: string;
}
export interface IProduct {
  id: string;
  productName: string;
  productDescription: string;
  productTotalStock: string;
  productDiscount: number | null;
  productImageUrl: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  Category: ICategory;
}
export interface IProducts {
  products: IProduct[];
  status: Status;
}
