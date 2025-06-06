import { IProduct } from "../../../product/types";

import { useAppDispatch } from "../../../../store/hook";

import { Link } from "react-router-dom";
import { LiaEditSolid } from "react-icons/lia";
import { useState } from "react";
import { IAdminOrder } from "../../../../store/adminOrderSlice";

const AdminOrderTable = ({ orders }: { orders: IAdminOrder[] }) => {
  const [searchItem, setSearchItem] = useState<string>("");

  const filterOrder = orders?.filter(
    (order) =>
      order?.id.toLowerCase().includes(searchItem.toLowerCase()) ||
      order?.orderStatus.toLowerCase().includes(searchItem.toLowerCase())
  );
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col">
      <div className=" overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="relative  text-gray-500 focus-within:text-gray-900 mb-4">
            <div className="absolute inset-y-0 left-1 flex items-center pl-3 pointer-events-none ">
              <svg
                className="w-5 h-5"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z"
                  stroke="#9CA3AF"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z"
                  stroke="black"
                  strokeOpacity="0.2"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z"
                  stroke="black"
                  strokeOpacity="0.2"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex justify-between">
              <input
                onChange={(e) => setSearchItem(e.target.value)}
                type="text"
                id="default-search"
                className="block w-80 h-11 pr-5 pl-12 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
                placeholder="Search Order"
              />
            </div>
          </div>
          <div className="overflow-hidden ">
            <table className="min-w-full rounded-xl table-fixed">
              <thead>
                <tr className="bg-gray-50 w-[100%]">
                  <th
                    scope="col"
                    className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                  >
                    Order Id
                  </th>
                  <th
                    scope="col"
                    className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl"
                  >
                    Total Amount
                  </th>
                  <th
                    scope="col"
                    className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                  >
                    Order Status
                  </th>
                  <th
                    scope="col"
                    className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                  >
                    Payment Method
                  </th>

                  <th
                    scope="col"
                    className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl"
                  >
                    Payment Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {filterOrder.length > 0 &&
                  filterOrder.map((order) => {
                    return (
                      <tr
                        key={order?.id}
                        className="bg-white transition-all duration-500 hover:bg-gray-50"
                      >
                        <Link to={`/admin/order/${order?.id}`}>
                          {" "}
                          <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                            {order?.id}
                          </td>
                        </Link>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {order?.totalAmount}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {order?.orderStatus}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {order?.Payment?.paymentMethod}
                        </td>
                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                          {order?.Payment?.paymentStatus}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminOrderTable;
