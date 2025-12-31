import { useEffect, useState } from "react";
import Navbar from "../../globals/component/Navbar";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import {
  fetchMyOrders,
  updateOrderStatusinSlice,
} from "../../store/orderSlice";
import { Link } from "react-router-dom";
import { socket } from "../../App";
import { OrderStatus } from "../my-order-details";
import { 
  FaSearch, 
  FaShoppingBag, 
  FaEye, 
  FaClock, 
  FaCheckCircle, 
  FaTruck, 
  FaTimesCircle,
  FaMoneyBillWave,
  FaArrowRight
} from "react-icons/fa";

const MyOrder = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((store) => store.orders);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const newItems = items.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm) ||
      item.Payment?.paymentMethod.toLowerCase().includes(searchTerm) ||
      item?.orderStatus?.toLowerCase().includes(searchTerm) ||
      item.totalAmount == parseInt(searchTerm)
  );

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, []);

  useEffect(() => {
    socket.on(
      "statusUpdated",
      (data: { userId: string; orderId: string; status: OrderStatus }) => {
        dispatch(updateOrderStatusinSlice(data));
      }
    );
  }, [socket]);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <FaClock className="text-yellow-500 text-xl" />;
      case "delivered":
        return <FaCheckCircle className="text-green-500 text-xl" />;
      case "ontheway":
        return <FaTruck className="text-blue-500 text-xl" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500 text-xl" />;
      default:
        return <FaClock className="text-gray-500 text-xl" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2";
    switch (status?.toLowerCase()) {
      case "pending":
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-700`}>{getStatusIcon(status)} Pending</span>;
      case "delivered":
        return <span className={`${baseClasses} bg-green-100 text-green-700`}>{getStatusIcon(status)} Delivered</span>;
      case "ontheway":
        return <span className={`${baseClasses} bg-blue-100 text-blue-700`}>{getStatusIcon(status)} On the Way</span>;
      case "cancelled":
        return <span className={`${baseClasses} bg-red-100 text-red-700`}>{getStatusIcon(status)} Cancelled</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-700`}>{getStatusIcon(status)} {status}</span>;
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    const baseClasses = "px-3 py-1 rounded-lg text-xs font-semibold";
    switch (method?.toLowerCase()) {
      case "khalti":
        return <span className={`${baseClasses} bg-purple-100 text-purple-700`}>Khalti</span>;
      case "esewa":
        return <span className={`${baseClasses} bg-green-100 text-green-700`}>eSewa</span>;
      case "cod":
        return <span className={`${baseClasses} bg-blue-100 text-blue-700`}>Cash on Delivery</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-700`}>{method}</span>;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              My Orders
            </h1>
            <p className="text-gray-600 text-lg">
              Track and manage all your orders
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="max-w-md">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Status, Payment Method..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 shadow-sm text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Orders List */}
          {newItems.length > 0 ? (
            <div className="space-y-4">
              {newItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 transform hover:-translate-y-1"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FaShoppingBag className="text-white text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-800 mb-1">
                            Order #{item.id.substring(0, 8).toUpperCase()}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaMoneyBillWave className="text-blue-500" />
                              <span className="font-semibold text-gray-800">Rs. {item.totalAmount?.toLocaleString() || 0}</span>
                            </div>
                            <span className="text-gray-400">•</span>
                            {getPaymentMethodBadge(item.Payment?.paymentMethod || "cod")}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status and Action */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div>
                        {getStatusBadge(item.orderStatus || "pending")}
                      </div>
                      <Link to={`/my-orders/${item.id}`}>
                        <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                          <FaEye />
                          View Details
                          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingBag className="text-6xl text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {searchTerm ? "No Orders Found" : "No Orders Yet"}
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "Start shopping to see your orders here"}
              </p>
              <Link to="/products">
                <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto">
                  <FaShoppingBag className="group-hover:animate-bounce" />
                  Start Shopping
                  <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyOrder;
