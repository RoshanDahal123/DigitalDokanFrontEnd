import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import AdminLayout from "../AdminLayout";
import AdminOrderTable from "./components/AdminOrderTable";
import { fetchAllOrder } from "../../../store/adminOrderSlice";

function AdminOrder() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.order);
  useEffect(() => {
    dispatch(fetchAllOrder());
  }, []);

  return (
    <AdminLayout>
      <AdminOrderTable orders={items} />
    </AdminLayout>
  );
}
export default AdminOrder;
