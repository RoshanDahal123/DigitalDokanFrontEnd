import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { useEffect } from "react";
import { fetchProduct } from "../../../store/productSlice";
import AdminLayout from "../AdminLayout";
import SingleProduct from "./components/SingleProduct";

function SingleProductAdmin() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { product } = useAppSelector((store) => store.products);
  useEffect(() => {
    if (id) dispatch(fetchProduct(id));
  }, []);

  return (
    <AdminLayout>
      {product ? <SingleProduct product={product} /> : <p>Loading...</p>}
    </AdminLayout>
  );
}
export default SingleProductAdmin;
