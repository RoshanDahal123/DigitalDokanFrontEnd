import { useParams } from "react-router-dom";
import Navbar from "../../globals/component/Navbar";
import { cancelMyOrder, fetchMyOrderDetail } from "../../store/orderSlice";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { OrderStatus } from ".";
import { 
  FaTruck, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaUser,
  FaShoppingBag,
  FaMoneyBillWave,
  FaBoxOpen
} from "react-icons/fa";

const MyOrderDetail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { orderDetail } = useAppSelector((store) => store.orders);

  const handleCancelOrder = () => {
    if (id) {
      dispatch(cancelMyOrder(id));
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchMyOrderDetail(id));
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <FaClock className="text-yellow-500 text-2xl" />;
      case "delivered":
        return <FaCheckCircle className="text-green-500 text-2xl" />;
      case "ontheway":
        return <FaTruck className="text-blue-500 text-2xl" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500 text-2xl" />;
      default:
        return <FaClock className="text-gray-500 text-2xl" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-6 py-3 rounded-full text-base font-semibold inline-flex items-center gap-3";
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              Order Details
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <p className="text-lg">
                Order #{orderDetail[0]?.orderId?.substring(0, 8).toUpperCase()}
              </p>
              <span className="text-gray-400">•</span>
              <p className="text-lg">
                {orderDetail[0]?.createdAt && new Date(orderDetail[0].createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <span className="text-gray-400">•</span>
              {orderDetail[0]?.Order?.orderStatus && getStatusBadge(orderDetail[0].Order.orderStatus)}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FaShoppingBag className="text-blue-600" />
                  Order Items
                </h2>
                <div className="space-y-6">
                  {orderDetail.length > 0 &&
                    orderDetail.map((od) => (
                      <div
                        key={od.id}
                        className="flex gap-6 pb-6 border-b border-gray-100 last:border-0"
                      >
                        <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden shadow-md">
                          <img
                            src={`http://localhost:4000/${od?.Product?.productImageUrl}`}
                            alt={od?.Product?.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                              {od?.Product?.productName}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Category: <span className="font-semibold">{od?.Product?.Category?.categoryName}</span>
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">Price:</span>
                              <span className="text-lg font-bold text-gray-800">Rs. {od?.Product?.productPrice}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaBoxOpen className="text-blue-600" />
                              <span className="text-gray-600">Qty:</span>
                              <span className="font-semibold text-gray-800">{od?.quantity}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                Rs. {(od?.Product?.productPrice * od?.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Price Summary */}
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FaMoneyBillWave className="text-green-600" />
                  Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      Rs. {orderDetail[0]?.Order?.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 pt-4">
                    <FaTruck className="text-blue-600 text-xl" />
                    <div>
                      <p className="font-semibold text-gray-800">Standard Delivery</p>
                      <p className="text-sm">Delivery within 24-48 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FaUser className="text-purple-600" />
                  Customer
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaUser className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-semibold text-gray-800">
                        {orderDetail[0]?.Order?.firstName} {orderDetail[0]?.Order?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaPhone className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-semibold text-gray-800">{orderDetail[0]?.Order?.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Shipping Address</p>
                      <p className="font-semibold text-gray-800">
                        {orderDetail[0]?.Order?.addressLine}
                      </p>
                      <p className="text-gray-600">
                        {orderDetail[0]?.Order?.city}, {orderDetail[0]?.Order?.state}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cancel Order Button */}
                {orderDetail[0]?.Order?.orderStatus !== OrderStatus.Cancelled && (
                  <button
                    onClick={handleCancelOrder}
                    className="mt-6 w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <FaTimesCircle />
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrderDetail;
