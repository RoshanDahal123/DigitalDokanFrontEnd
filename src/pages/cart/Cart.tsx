import { Link } from "react-router-dom";
import Navbar from "../../globals/component/Navbar";
import {
  handleCartItemUpdate,
  handleDeleteCartItem,
} from "../../store/cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaArrowRight, FaTruck, FaShieldAlt } from "react-icons/fa";
const baseURL = import.meta.env.IMAGE_UPLOAD_URL|| "http://localhost:4000/";
const Cart = () => {
  const { items } = useAppSelector((store) => store.cart);
  const dispatch = useAppDispatch();
  
  const handleUpdate = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch(handleCartItemUpdate(productId, quantity));
  };

  const handleDelete = (productId: string) => {
    dispatch(handleDeleteCartItem(productId));
  };

  const subTotal = items.reduce(
    (total, item) => (item?.Product?.productPrice || 0) * (item?.quantity || 0) + total,
    0
  );

  const totalQuantityInCarts = items.reduce(
    (total, item) => item.quantity + total,
    0
  );

  const shippingPrice = 100;
  const total = subTotal + shippingPrice;

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaShoppingBag className="text-6xl text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <Link to="/products">
                  <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto">
                    <FaShoppingBag className="group-hover:animate-bounce" />
                    Start Shopping
                    <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600 text-lg">
              {totalQuantityInCarts} {totalQuantityInCarts === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item?.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 transform hover:-translate-y-1"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full md:w-40 h-40 flex-shrink-0">
                      <img
                        src={`${baseURL}${item?.Product?.productImageUrl}`}
                        alt={item?.Product?.productName}
                        className="w-full h-full object-cover rounded-xl shadow-md"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {item?.Product?.productName}
                        </h3>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                          Rs. {item?.Product?.productPrice?.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleUpdate(item?.Product?.id, item?.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                            className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 hover:from-blue-100 hover:to-blue-200 flex items-center justify-center text-gray-700 hover:text-blue-600 transition-all shadow-md hover:shadow-lg transform hover:scale-110"
                          >
                            <FaMinus />
                          </button>
                          <span className="w-16 text-center text-xl font-bold text-gray-800">
                            {item?.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdate(item?.Product?.id, item?.quantity + 1)
                            }
                            aria-label="Increase quantity"
                            className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center justify-center text-white transition-all shadow-md hover:shadow-lg transform hover:scale-110"
                          >
                            <FaPlus />
                          </button>
                        </div>

                        {/* Subtotal and Delete */}
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Subtotal</p>
                            <p className="text-2xl font-bold text-gray-800">
                              Rs. {((item?.Product?.productPrice || 0) * (item?.quantity || 0)).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(item?.Product?.id)}
                            aria-label="Remove item from cart"
                            className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 flex items-center justify-center text-white transition-all shadow-md hover:shadow-lg transform hover:scale-110"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-28">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-gray-100">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-lg font-semibold text-gray-800">
                      Rs. {subTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Items</span>
                    <span className="text-lg font-semibold text-gray-800">
                      {totalQuantityInCarts}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b-2 border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FaTruck className="text-blue-600" />
                      Shipping
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                      Rs. {shippingPrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-bold text-gray-800">Total</span>
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link to="/my-checkout">
                  <button className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mb-4">
                    Proceed to Checkout
                    <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </Link>

                <Link to="/products">
                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300">
                    Continue Shopping
                  </button>
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t-2 border-gray-100 space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaShieldAlt className="text-green-600 text-xl" />
                    <span className="text-sm">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaTruck className="text-blue-600 text-xl" />
                    <span className="text-sm">Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
