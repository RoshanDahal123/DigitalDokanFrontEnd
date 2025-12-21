import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { Status } from "../../../../globals/type";
import {
  fetchProduct,
  resetStatus,
  updateProduct,
} from "../../../../store/adminProductSlice";
import { fetchCategories } from "../../../../store/adminCategorySlice";

interface IProduct {
  productName: string;
  productDescription: string;
  productPrice: number;
  productTotalStock: number;
  productDiscount: number;
  categoryId: string;
  productImageUrl: File | string;
}
function UpdateProductModal({
  handleClose,
  id,
}: {
  handleClose: () => void;
  id: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<IProduct>({
    productName: "",
    productDescription: "",
    productPrice: 0,
    productTotalStock: 0,
    productDiscount: 0,
    categoryId: "",
    productImageUrl: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { status } = useAppSelector((store) => store.adminProduct);
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((store) => store.category);

  // Fetch product using id prop
  useEffect(() => {
    if (id) dispatch(fetchProduct(id));
  }, [id, dispatch]);

  const { product } = useAppSelector((store) => store.adminProduct);
  // Prepopulate form with fetched product data
  useEffect(() => {
    if (product) {
      setData(product);
    }
  }, [product]);

  const handleProductChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((data) => ({
      ...data,
      [name]: name === "productImageUrl" ? (e.target.files![0] as File) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setLoading(true);
    try {
      dispatch(updateProduct(data));
    } catch (error) {
      // Error handling
    }
  };

  // Only close modal if the update submission has been made and status becomes SUCCESS
  useEffect(() => {
    if (submitted && status === Status.SUCCESS) {
      setLoading(false);
      handleClose();
      dispatch(resetStatus());
      setSubmitted(false);
    }
  }, [status, submitted, handleClose, dispatch]);

  const handleCategory = () => {
    dispatch(fetchCategories());
  };

  return (
    <>
      <div
        id="modal"
        className="fixed inset-0 z-50 flex items-center justify-center w-[100vw]"
      >
        <div className="fixed inset-0 bg-black/50" />{" "}
        <div className="relative w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add Product
            </h3>
            <button
              id="closeModalButton"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={handleClose}
            >
              <svg
                className="h-4 w-4 inline-block ml-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            <form onSubmit={handleSubmit}>
              {/* Row 1 */}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Earphones"
                  required
                  value={data.productName}
                  onChange={handleProductChange}
                />
              </div>

              {/* Row 2 */}
              <div className="flex gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product Price
                  </label>
                  <input
                    type="number"
                    id=""
                    name="productPrice"
                    className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="999"
                    required
                    value={data.productPrice}
                    onChange={handleProductChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product Total Stock
                  </label>
                  <input
                    type="number"
                    name="productTotalStock"
                    className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="1"
                    required
                    onChange={handleProductChange}
                    value={data.productTotalStock}
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product Discount
                  </label>
                  <input
                    type="number"
                    name="productDiscount"
                    className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="0"
                    required
                    onChange={handleProductChange}
                    value={data.productDiscount}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    name="categoryId"
                    value={data.categoryId} // Added this line
                    className="w-[170px] h-[42px] mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                    onClick={handleCategory}
                    onChange={handleProductChange}
                    required
                  >
                    {items.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                        className="text-gray-900 dark:text-gray-200 bg-gray-400 rounded-md"
                      >
                        {item.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product Image
                </label>
                <input
                  type="file"
                  name="productImageUrl"
                  className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                  required
                  onChange={handleProductChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product Description
                </label>
                <textarea
                  name="productDescription"
                  id=""
                  className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                  onChange={handleProductChange}
                  placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus."
                  value={data.productDescription}
                  rows={4}
                >
                  {data.productDescription}
                </textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  id="cancelButton"
                  className="px-4 py-2 my-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  id="submitUrlButton"
                  className="flex items-center my-4 justify-center px-4 py-2 text-sm font-medium text-white rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 dark:from-indigo-500 dark:to-violet-500 dark:hover:from-indigo-600 dark:hover:to-violet-600"
                >
                  {loading ? "Updating.." : "Update"}
                  <svg
                    className="h-4 w-4 inline-block ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateProductModal;
