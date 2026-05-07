import { Link } from "react-router-dom";
import { useState } from "react";
import { IAdminOrder } from "../../../../store/adminOrderSlice";

const AdminOrderTable = ({ orders }: { orders: IAdminOrder[] }) => {
  const [searchItem, setSearchItem] = useState<string>("");

  const filterOrder = orders?.filter(
    (order) =>
      order?.id.toLowerCase().includes(searchItem.toLowerCase()) ||
      order?.orderStatus.toLowerCase().includes(searchItem.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "delivered" || statusLower === "completed") {
      return "bg-green-100 text-green-800";
    } else if (statusLower === "processing" || statusLower === "pending") {
      return "bg-yellow-100 text-yellow-800";
    } else if (statusLower === "shipped") {
      return "bg-blue-100 text-blue-800";
    } else if (statusLower === "cancelled") {
      return "bg-red-100 text-red-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "paid" || statusLower === "completed") {
      return "bg-green-100 text-green-800";
    } else if (statusLower === "pending") {
      return "bg-yellow-100 text-yellow-800";
    } else if (statusLower === "failed") {
      return "bg-red-100 text-red-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Manage customer orders and shipments</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
            {orders.length} Total Orders
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          onChange={(e) => setSearchItem(e.target.value)}
          type="text"
          placeholder="Search orders by ID or status..."
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Order Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Payment Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterOrder.length > 0 ? (
                filterOrder.map((order) => (
                  <tr
                    key={order?.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/admin/order/${order?.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        #{order?.id?.substring(0, 8)}...
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        NRs. {order?.totalAmount?.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order?.orderStatus)}`}>
                        {order?.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mr-2">
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-900">
                          {order?.Payment?.paymentMethod || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(order?.Payment?.paymentStatus)}`}>
                        {order?.Payment?.paymentStatus || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-gray-500 font-medium">No orders found</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Counter */}
      {filterOrder.length > 0 && (
        <div className="flex justify-between items-center px-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filterOrder.length}</span> of{" "}
            <span className="font-semibold">{orders.length}</span> orders
          </p>
        </div>
      )}
    </div>
  );
};
export default AdminOrderTable;
