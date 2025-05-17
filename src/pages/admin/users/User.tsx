import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import AdminLayout from "../AdminLayout";
import UserTable from "./components/UserTable";
import { fetchUsers } from "../../../store/adminUserSlice";

function User() {
  const dispatch = useAppDispatch();

  const { users } = useAppSelector((state) => state.adminUser);
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);
  return (
    <AdminLayout>
      <UserTable users={users} />
    </AdminLayout>
  );
}
export default User;
