import { useParams } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { fetchAdminOrderDetail, updateOrderStatusByAdmin, updatePaymentStatusByAdmin } from "../../../store/adminOrderSlice";
import { ChangeEvent, useEffect } from "react";
import { socket } from "../../../App";
import { FaBox, FaCreditCard, FaTruck, FaUser, FaClipboardList } from "react-icons/fa";

const AdminOrderDetail = () => {
  const { id } = useParams();

  const dispatch = useAppDispatch();
  const { orderDetail } = useAppSelector((store) => store.order);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchAdminOrderDetail(id));
    }
  }, [id, dispatch]);

  const handleOrderStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (id && e.target.value) {
      // 1. Dispatch REST API call to robustly update DB and reload order slice
      dispatch(updateOrderStatusByAdmin(id, e.target.value));

      // 2. Emit Socket IO event for client notification handling
      socket.emit("updateOrderStatus", {
        status: e.target.value,
        orderId: id,
        userId: orderDetail[0]?.Order?.userId,
      });
    }
  };

  const handlePaymentStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (id && e.target.value) {
      dispatch(updatePaymentStatusByAdmin(id, e.target.value));
    }
  };

  if (!orderDetail || orderDetail.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full min-h-screen">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  const orderInfo = orderDetail[0]?.Order;

  return (
    <AdminLayout>
      <div className="px-4 py-8 md:px-8 xl:px-12 2xl:container 2xl:mx-auto bg-gray-50 min-h-screen">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="px-8 py-10 text-white flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center shadow-inner">
                <FaClipboardList className="text-4xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-2">
                  Order #{orderDetail[0]?.orderId}
                </h1>
                <p className="text-blue-100 font-medium opacity-90 flex items-center gap-2">
                  Placed on {new Date(orderDetail[0]?.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2 bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-sm">
              <span className="uppercase tracking-widest text-xs font-bold text-blue-100">Order Totals</span>
              <span className="text-4xl font-bold font-mono tracking-tight text-white">Rs. {orderInfo?.totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start w-full">
          
          {/* Left Column: Cart Items */}
          <div className="w-full xl:w-2/3 flex flex-col gap-8">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-3">
                <FaBox className="text-blue-600 text-xl" />
                <h2 className="text-2xl font-black text-gray-800">Customer's Cart</h2>
              </div>
              <div className="p-8 flex flex-col gap-6">
                {orderDetail.map((od) => (
                  <div key={od.id} className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-50">
                    <div className="w-full md:w-32 h-32 flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                      <img
                        className="w-full h-full object-contain"
                        src={`http://localhost:4000/${od?.Product?.productImageUrl}`}
                        alt={od?.Product?.productName}
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between w-full gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{od?.Product?.productName}</h3>
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                          {od?.Product?.Category?.categoryName}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Price</p>
                          <p className="font-bold text-gray-800">Rs. {od?.Product?.productPrice}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Qty</p>
                          <p className="font-bold text-gray-800">{od?.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Subtotal</p>
                          <p className="font-bold text-blue-600 text-lg">Rs. {od?.Product?.productPrice * od?.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Summary Cards below Cart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col gap-4">
                 <div className="flex items-center gap-3">
                   <FaTruck className="text-purple-600 text-xl" />
                   <h3 className="text-xl font-bold text-gray-800">Shipping Method</h3>
                 </div>
                 <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                   <div>
                     <p className="font-bold text-gray-900">DPD Express</p>
                     <p className="text-sm text-gray-500">Delivery within 24 Hours</p>
                   </div>
                   <p className="font-bold text-purple-600">Rs. 100</p>
                 </div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col gap-4">
                 <h3 className="text-xl font-bold text-gray-800">Summary</h3>
                 <div className="flex justify-between items-center text-lg font-black border-t border-gray-100 pt-4 mt-2">
                   <span className="text-gray-600">Total + Shipping</span>
                   <span className="text-blue-600 text-2xl">Rs. {orderInfo?.totalAmount}</span>
                 </div>
              </div>
            </div>

          </div>

          {/* Right Column: Customer & Status Controls */}
          <div className="w-full xl:w-1/3 flex flex-col gap-8">
            
            {/* Status Management */}
            <div className="bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden ring-1 ring-blue-50">
              <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FaBox className="text-blue-500"/> Manage Status
                </h3>
              </div>
              <div className="p-6 flex flex-col gap-6">
                
                {/* Order Status Dropdown */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="orderStatus" className="text-sm font-bold text-gray-700 tracking-wide uppercase">
                    Order Status
                  </label>
                  <div className="relative">
                    <select
                      name="changeOrderStatus"
                      id="orderStatus"
                      value={orderInfo?.orderStatus || 'pending'}
                      onChange={handleOrderStatusChange}
                      className="w-full appearance-none bg-white border-2 border-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparation">Preparation</option>
                      <option value="ontheway">On The Way</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>

                {/* Payment Status Dropdown */}
                <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                  <label htmlFor="paymentStatus" className="text-sm font-bold text-gray-700 tracking-wide uppercase flex items-center gap-2">
                    <FaCreditCard className="text-purple-500" /> Payment Status
                  </label>
                  <div className="relative">
                    <select
                      name="changePaymentStatus"
                      id="paymentStatus"
                      value={orderInfo?.Payment?.paymentStatus || 'unpaid'}
                      onChange={handlePaymentStatusChange}
                      className="w-full appearance-none bg-white border-2 border-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all cursor-pointer"
                    >
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
               <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FaUser className="text-gray-500"/> Customer Details
                </h3>
              </div>
              <div className="p-6 flex flex-col gap-6">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-gray-900 font-semibold">{orderInfo?.firstName} {orderInfo?.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Contact Details</p>
                  <p className="text-gray-900 font-semibold">{orderInfo?.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Shipping Address</p>
                  <address className="text-gray-900 font-semibold not-italic leading-relaxed">
                    {orderInfo?.addressLine} <br />
                    {orderInfo?.city}, {orderInfo?.state} <br />
                    ZIP: {orderInfo?.zipCode || "N/A"}
                  </address>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Payment Method</p>
                  <span className="inline-block px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-bold uppercase tracking-wider border border-green-200 mt-1">
                    {orderInfo?.Payment?.paymentMethod || "N/A"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
export default AdminOrderDetail;
