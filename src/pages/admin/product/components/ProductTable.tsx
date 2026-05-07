import { useCallback, useState } from "react";
import { IProduct } from "../../../product/types";
import ProductModal from "./AddProductModal";
import UpdateProductModal from "./UpdateProductModal";

import { useAppDispatch } from "../../../../store/hook";
import {
  deleteProductItem,
  updateProduct,
} from "../../../../store/adminProductSlice";
import { Link } from "react-router-dom";
import { LiaEditSolid } from "react-icons/lia";

const ProductTable = ({ products }: { products: IProduct[] }) => {
  const [searchItem, setSearchItem] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const filterProduct = products?.filter(
    (product) =>
      product?.productName.toLowerCase().includes(searchItem.toLowerCase()) ||
      product?.id.toLowerCase().includes(searchItem.toLowerCase())
  );
  const dispatch = useAppDispatch();
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const handleClose = useCallback(() => {
    setIsEdit(false);
    setSelectedProductId(null);
  }, []);
  const deleteProduct = async (id: string) => {
    if (id) dispatch(deleteProductItem(id));
  };

  const editProduct = async (id: string) => {
    if (id) {
      setSelectedProductId(id);
      setIsEdit(true);
    }
  };
  
  return (
    <div className="space-y-6">
      {isModalOpen && <ProductModal closeModal={closeModal} />}
      {isEdit && selectedProductId && (
        <UpdateProductModal
          handleClose={handleClose}
          id={selectedProductId}
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={openModal}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium flex items-center gap-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
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
          placeholder="Search products by ID or name..."
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
                  Product ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterProduct.length > 0 ? (
                filterProduct.map((product) => (
                  <tr
                    key={product?.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/admin/product/${product?.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {product?.id?.substring(0, 8)}...
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product?.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        NRs. {product?.productPrice}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {product?.productDiscount}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={`http://localhost:4000/${product?.productImageUrl}`}
                        alt={product?.productName}
                        className="h-12 w-12 rounded-lg object-cover shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product?.productTotalStock > 50
                          ? "bg-green-100 text-green-800"
                          : product?.productTotalStock > 10
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {product?.productTotalStock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => editProduct(product?.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Edit Product"
                        >
                          <LiaEditSolid className="text-xl" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product?.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete Product"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-gray-500 font-medium">No products found</p>
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
      {filterProduct.length > 0 && (
        <div className="flex justify-between items-center px-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filterProduct.length}</span> of{" "}
            <span className="font-semibold">{products.length}</span> products
          </p>
        </div>
      )}
    </div>
  );
};
export default ProductTable;
