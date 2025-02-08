import { useEffect } from "react";
import Navbar from "../../globals/component/Navbar";
import Card from "./components/Card";
import { fetchProducts } from "../../store/productSlice";
import { useAppDispatch, useAppSelector } from "../../store/hook";

const Product = () => {
  const dispatch = useAppDispatch();
  const { products, status } = useAppSelector((store) => store.products);
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);
  return (
    <>
      <Navbar />
      <div className="text-center p-10">
        <h1 className="font-bold text-4xl mb-4">Products</h1>
      </div>
      <section
        id="Projects"
        className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5"
      >
        {products.length > 0 &&
          products.map((product) => {
            return <Card product={product} />;
          })}
      </section>
    </>
  );
};
export default Product;
