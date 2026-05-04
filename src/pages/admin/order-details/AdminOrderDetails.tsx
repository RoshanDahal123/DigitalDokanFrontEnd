import { useParams } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { fetchAdminOrderDetail, updateOrderStatusByAdmin } from "../../../store/adminOrderSlice";
import { ChangeEvent, useEffect } from "react";
import { socket } from "../../../App";

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

  return (
    <AdminLayout>
      <>
        <div className="py-2 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
          <div className="flex justify-start item-start space-y-2 flex-col">
            <h1 className="text-3xl text-gray-800  lg:text-4xl font-semibold leading-7 lg:leading-9">
              Order #{orderDetail[0]?.orderId}
            </h1>
            <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">
              {new Date(orderDetail[0]?.createdAt).toLocaleDateString()}
            </p>
            <p>Order Status : {orderDetail[0]?.Order?.orderStatus}</p>
          </div>
          <div className="flex justify-start item-start space-y-2 flex-col"></div>
          <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
            <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
              <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">
                  Customer’s Cart
                </p>
                {orderDetail.length > 0 &&
                  orderDetail.map((od) => {
                    return (
                      <div
                        key={od.id}
                        className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full"
                      >
                        <div className="pb-4 md:pb-8 w-full md:w-40">
                          <img
                            className="w-full hidden md:block"
                            src={`http://localhost:4000/${od?.Product?.productImageUrl}`}
                            alt="dress"
                          />
                        </div>
                        <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                          <div className="w-full flex flex-col justify-start items-start space-y-8">
                            <h3 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">
                              {od?.Product?.productName}
                            </h3>
                            <div className="flex justify-start items-start flex-col space-y-2">
                              <p className="text-sm dark:text-white leading-none text-gray-800">
                                <span className="dark:text-gray-400 text-gray-300">
                                  Category:{" "}
                                </span>{" "}
                                {od?.Product?.Category?.categoryName}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between space-x-8 items-start w-full">
                            <p className="text-base dark:text-white xl:text-lg leading-6">
                              Rs.{od?.Product?.productPrice}{" "}
                            </p>
                            <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">
                              {od?.quantity}
                            </p>
                            <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">
                              Rs.{od?.Product?.productPrice * od?.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="flex justify-center flex-col md:flex-row  items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                  <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                    Summary
                  </h3>
                  <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                    <div className="flex justify-between w-full">
                      <p className="text-base dark:text-white leading-4 text-gray-800">
                        Total+Shipping
                      </p>
                      <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                        Rs.{orderDetail[0]?.Order?.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                  <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                    Shipping
                  </h3>
                  <div className="flex justify-between items-start w-full">
                    <div className="flex justify-center items-center space-x-4">
                      <div className="w-8 h-8">
                        <img
                          className="w-full h-full"
                          alt="logo"
                          src="https://i.ibb.co/L8KSdNQ/image-3.png"
                        />
                      </div>
                      <div className="flex flex-col justify-start items-center">
                        <p className="text-lg leading-6 dark:text-white font-semibold text-gray-800">
                          DPD Delivery
                          <br />
                          <span className="font-normal">
                            Delivery with 24 Hours
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold leading-6 dark:text-white text-gray-800">
                      Rs.100
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
              <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                Customer
              </h3>
              <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                <div className="flex flex-col justify-start items-start flex-shrink-0">
                  <div className="flex justify-center w-full md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                    <div className="flex justify-start items-start flex-col space-y-2">
                      <p className="text-sm dark:text-gray-300 leading-5 text-gray-600">
                        Phone No: {orderDetail[0]?.Order?.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                  <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                    <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                      <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                        Shipping Address
                      </p>
                      <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                        Full Name :{orderDetail[0]?.Order?.firstName}{" "}
                        {orderDetail[0]?.Order?.lastName}
                      </p>
                      <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                        {orderDetail[0]?.Order?.addressLine},
                        {orderDetail[0]?.Order?.city},
                        {orderDetail[0]?.Order?.state}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4">
                    {/* <div className="flex w-full justify-center items-center md:justify-start md:items-start">
                      <label htmlFor="">Change Payment Status</label>
                      <select
                        name=""
                        id=""
                        className="w-full md:w-48 lg:w-64 xl:w-72 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="paid">paid</option>
                        <option value="unpaid">unpaid</option>
                      </select>
                    </div> */}

                    <div className="flex w-full justify-center items-center md:justify-start md:items-start">
                      <label htmlFor="" className="text-gray-900 font-bold  ">
                        {" "}
                        Change Order Status
                      </label>
                      <select
                        name="changeOrderStatus"
                        className="w-full md:w-48 lg:w-64 xl:w-72 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        id=""
                        value={orderDetail[0]?.Order?.orderStatus || 'pending'}
                        onChange={handleOrderStatusChange}
                      >
                        <option value="pending">pending</option>
                        <option value="delivered">delivered</option>
                        <option value="ontheway">ontheway</option>
                        <option value="preparation">preparation</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </AdminLayout>
  );
};
export default AdminOrderDetail;
