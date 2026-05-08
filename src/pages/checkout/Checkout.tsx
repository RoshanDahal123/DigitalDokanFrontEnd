import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Navbar from "../../globals/component/Navbar";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { IData, PaymentMethod } from "./types";
import { orderItem } from "../../store/orderSlice";
import { clearCart } from "../../store/cartSlice";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCity, 
  FaFlag, 
  FaMailBulk,
  FaShoppingBag,
  FaTruck,
  FaShieldAlt,
  FaCheckCircle
} from "react-icons/fa";
import { KhaltiLogo, EsewaLogo, CODLogo } from "../../components/PaymentLogos";
const baseURL = import.meta.env.IMAGE_UPLOAD_URL|| "https://mern-digitaldhokanproject.onrender.com/";
function Checkout() {
  const { items } = useAppSelector((store) => store.cart);
  const { khaltiUrl } = useAppSelector((store) => store.orders);
  const dispatch = useAppDispatch();
  const subTotal = items.reduce(
    (total, item) => (item?.Product?.productPrice || 0) * (item?.quantity || 0) + total,
    0
  );

  const shippingCost = 100;
  const total = subTotal + shippingCost;
  const [data, setData] = useState<IData>({
    firstName: "",
    lastName: "",
    addressLine: "",
    city: "",
    totalAmount: 0,
    zipCode: "",
    email: "",
    phoneNumber: "",
    state: "",
    paymentMethod: PaymentMethod.Cod,
    products: [],
  });
  const [paymentMethod, setpaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.Cod
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const productData =
      items.length > 0
        ? items.map((item) => {
            return {
              quantity: item.quantity,
              productId: item?.Product?.id,
            };
          })
        : [];
    const finalData = {
      ...data,
      products: productData,
      totalAmount: total,
    };
    await dispatch(orderItem(finalData));
    await dispatch(clearCart());
  };

  const handlePaymentMethod = (paymentData: PaymentMethod) => {
    setpaymentMethod(paymentData);
    setData({
      ...data,
      paymentMethod: paymentData,
    });
  };

  useEffect(() => {
    if (khaltiUrl) {
      window.location.href = khaltiUrl;
      return;
    }
  }, [khaltiUrl]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              Checkout
            </h1>
            <p className="text-gray-600 text-lg">
              Complete your order in just a few steps
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Details Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                        1
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Personal Details
                      </h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative">
                        <FaUser className="absolute left-4 top-4 text-gray-400" />
                        <input
                          type="text"
                          name="firstName"
                          onChange={handleChange}
                          placeholder="First Name"
                          required
                          className="pl-12 pr-4 py-4 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-blue-500 text-gray-800 w-full rounded-xl focus:outline-none transition-all duration-300 shadow-sm"
                        />
                      </div>
                      <div className="relative">
                        <FaUser className="absolute left-4 top-4 text-gray-400" />
                        <input
                          type="text"
                          name="lastName"
                          onChange={handleChange}
                          placeholder="Last Name"
                          required
                          className="pl-12 pr-4 py-4 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-blue-500 text-gray-800 w-full rounded-xl focus:outline-none transition-all duration-300 shadow-sm"
                        />
                      </div>
                      <div className="relative">
                        <FaEnvelope className="absolute left-4 top-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          onChange={handleChange}
                          placeholder="Email Address"
                          required
                          className="pl-12 pr-4 py-4 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-blue-500 text-gray-800 w-full rounded-xl focus:outline-none transition-all duration-300 shadow-sm"
                        />
                      </div>
                      <div className="relative">
                        <FaPhone className="absolute left-4 top-4 text-gray-400" />
                        <input
                          type="tel"
                          name="phoneNumber"
                          onChange={handleChange}
                          placeholder="Phone Number"
                          required
                          className="pl-12 pr-4 py-4 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-blue-500 text-gray-800 w-full rounded-xl focus:outline-none transition-all duration-300 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                        2
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Shipping Address
                      </h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative md:col-span-2">
                        <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-400" />
                        <input
                          type="text"
                          name="addressLine"
                          onChange={handleChange}
                          placeholder="Street Address"
                          required
                          className="pl-12 pr-4 py-4 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-blue-500 text-gray-800 w-full rounded-xl focus:outline-none transition-all duration-300 shadow-sm"
                        />
                      </div>
                      <div className="relative">
                        <FaCity className="absolute left-4 top-4 text-gray-400" />
                        <input
                          type="text"
                          name="city"
                          onChange={handleChange}
                          placeholder="City"
                          required
                          className="pl-12 pr-4 py-4 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-blue-500 text-gray-800 w-full rounded-xl focus:outline-none transition-all duration-300 shadow-sm"
                        />
                      </div>
                      <div className="relative">
                        <FaFlag className="absolute left-4 top-4 text-gray-400" />
                        <input
                          type="text"
                          name="state"
                          onChange={handleChange}
                          placeholder="State/Province"
                          required
                          className="pl-12 pr-4 py-4 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-blue-500 text-gray-800 w-full rounded-xl focus:outline-none transition-all duration-300 shadow-sm"
                        />
                      </div>
                      <div className="relative">
                        <FaMailBulk className="absolute left-4 top-4 text-gray-400" />
                        <input
                          type="text"
                          name="zipCode"
                          onChange={handleChange}
                          placeholder="ZIP / Postal Code"
                          required
                          className="pl-12 pr-4 py-4 bg-gray-50 focus:bg-white border-2 border-gray-200 focus:border-blue-500 text-gray-800 w-full rounded-xl focus:outline-none transition-all duration-300 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                        3
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Payment Method
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Khalti Payment Option */}
                      <div
                        onClick={() => handlePaymentMethod(PaymentMethod.Khalti)}
                        className={`cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 ${
                          paymentMethod === PaymentMethod.Khalti
                            ? "border-purple-600 bg-purple-50 shadow-lg"
                            : "border-gray-200 hover:border-purple-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-12 bg-white rounded-lg shadow-md flex items-center justify-center p-1">
                              <KhaltiLogo />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800 text-lg">Khalti</h4>
                              <p className="text-sm text-gray-600">Digital Wallet Payment</p>
                            </div>
                          </div>
                          {paymentMethod === PaymentMethod.Khalti && (
                            <FaCheckCircle className="text-3xl text-purple-600" />
                          )}
                        </div>
                      </div>

                      {/* eSewa Payment Option */}
                      <div
                        onClick={() => handlePaymentMethod(PaymentMethod.Esewa)}
                        className={`cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 ${
                          paymentMethod === PaymentMethod.Esewa
                            ? "border-green-600 bg-green-50 shadow-lg"
                            : "border-gray-200 hover:border-green-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-12 bg-white rounded-lg shadow-md flex items-center justify-center p-1">
                              <EsewaLogo />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800 text-lg">eSewa</h4>
                              <p className="text-sm text-gray-600">Digital Wallet Payment</p>
                            </div>
                          </div>
                          {paymentMethod === PaymentMethod.Esewa && (
                            <FaCheckCircle className="text-3xl text-green-600" />
                          )}
                        </div>
                      </div>

                      {/* Cash on Delivery Option */}
                      <div
                        onClick={() => handlePaymentMethod(PaymentMethod.Cod)}
                        className={`cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 ${
                          paymentMethod === PaymentMethod.Cod
                            ? "border-blue-600 bg-blue-50 shadow-lg"
                            : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-12 bg-white rounded-lg shadow-md flex items-center justify-center p-1">
                              <CODLogo />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800 text-lg">Cash on Delivery</h4>
                              <p className="text-sm text-gray-600">Pay when you receive</p>
                            </div>
                          </div>
                          {paymentMethod === PaymentMethod.Cod && (
                            <FaCheckCircle className="text-3xl text-blue-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    {paymentMethod === PaymentMethod.Cod && (
                      <button
                        type="submit"
                        className="group w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                      >
                        <FaTruck className="text-2xl group-hover:animate-bounce" />
                        Place Order - Cash on Delivery
                      </button>
                    )}
                    {paymentMethod === PaymentMethod.Khalti && (
                      <button
                        type="submit"
                        className="group w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                      >
                        <FaShieldAlt className="text-2xl group-hover:animate-bounce" />
                        Pay with Khalti
                      </button>
                    )}
                    {paymentMethod === PaymentMethod.Esewa && (
                      <button
                        type="submit"
                        className="group w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                      >
                        <FaShieldAlt className="text-2xl group-hover:animate-bounce" />
                        Pay with eSewa
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-gray-100">
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
                      >
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden shadow-md">
                          <img
                            src={`${baseURL}${item.Product?.productImageUrl}`}
                            alt={item?.Product?.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-800 truncate">
                            {item?.Product?.productName}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Qty: {item?.quantity}
                          </p>
                          <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-1">
                            Rs. {(item?.Product?.productPrice * item?.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FaShoppingBag className="text-5xl text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No items in cart</p>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-lg font-semibold text-gray-800">
                      Rs. {subTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b-2 border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FaTruck className="text-blue-600" />
                      Shipping
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                      Rs. {shippingCost}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-bold text-gray-800">Total</span>
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 border-t-2 border-gray-100 space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaShieldAlt className="text-green-600 text-xl" />
                    <span className="text-sm">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaTruck className="text-blue-600 text-xl" />
                    <span className="text-sm">Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaCheckCircle className="text-purple-600 text-xl" />
                    <span className="text-sm">100% Satisfaction Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
