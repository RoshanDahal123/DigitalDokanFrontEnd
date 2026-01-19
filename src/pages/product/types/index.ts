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
  productPrice: number;
  productDiscount: number;
  productImageUrl: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  Category: ICategory;
  averageRating?: number;
  totalReviews?: number;
}
export interface IProducts {
  products: IProduct[];
  status: Status;
  product: IProduct | null;
}
