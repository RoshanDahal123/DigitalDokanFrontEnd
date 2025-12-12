export enum OrderStatus {
  Preparation = "preparation",
  Cancelled = "cancelled",
  Delivered = "delivered",
  Ontheway = "ontheway",
  Pending = "pending",
}
export enum PaymentMethod {
  COD = "cod",
  Esewa = "esewa",
  Khalti = "khalti",
}

export enum PaymentStatus {
  Paid = "paid",
  Unpaid = "unpaid",
}

export interface IOrderDetail {
  id: string;
  quantity: number;
  createdAt: string;
  orderId: string;
  productId: string;
  Order: {
    orderStatus: OrderStatus;
    addressLine: string;
    city: string;
    state: string;
    totalAmount: number;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    Payment: {
      paymentMethod: PaymentMethod;
      paymentStatus: PaymentStatus;
    };
    userId: string;
    zipCode: string;
  };
  Product: {
    productImageUrl: string;
    productName: string;
    productPrice: number;
    Category: {
      categoryName: string;
    };
  };
}
