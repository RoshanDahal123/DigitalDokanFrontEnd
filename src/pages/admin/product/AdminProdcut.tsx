import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import AdminLayout from "../AdminLayout";
import { fetchProducts } from "../../../store/adminProductSlice";
import ProductTable from "./components/ProductTable";

const AdminProduct = () => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((store) => store.adminProduct);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  return (
    <AdminLayout>
      <ProductTable products={products} />
    </AdminLayout>
  );
};
export default AdminProduct;
