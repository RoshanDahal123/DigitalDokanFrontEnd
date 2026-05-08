import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { fetchWishlist, removeFromWishlist } from "../../store/wishlistSlice";
import Navbar from "../../globals/component/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaTrash, FaArrowRight, FaShoppingBag } from "react-icons/fa";
const baseURL = import.meta.env.IMAGE_UPLOAD_URL|| "http://localhost:4000/";
const Wishlist = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { wishlist, loading } = useAppSelector((store) => store.wishlist);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(fetchWishlist());
  }, [token, dispatch, navigate]);

  const handleRemoveFromWishlist = async (productId: string) => {
    if (window.confirm("Remove this product from wishlist?")) {
      await dispatch(removeFromWishlist(productId));
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8 pb-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
      </>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaHeart className="text-6xl text-red-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Save your favorite products for later!
                </p>
                <Link to="/products">
                  <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto">
                    <FaShoppingBag className="group-hover:animate-bounce" />
                    Start Shopping
                    <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600 text-lg">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>

          {/* Wishlist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
              >
                {/* Product Image */}
                <Link to={`/product/${item.Product.id}`}>
                  <div className="relative h-64 bg-gray-100 overflow-hidden group">
                    <img
                      src={`${baseURL}${item.Product.productImageUrl}`}
                      alt={item.Product.productName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {item.Product.productTotalStock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">OUT OF STOCK</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-6">
                  <Link to={`/product/${item.Product.id}`}>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {item.Product.productName}
                    </h3>
                  </Link>
                  
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      Rs. {item.Product.productPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link to={`/product/${item.Product.id}`} className="flex-1">
                      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                        <FaShoppingCart />
                        View
                      </button>
                    </Link>
                    <button
                      onClick={() => handleRemoveFromWishlist(item.Product.id)}
                      className="bg-red-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all shadow-lg hover:shadow-xl"
                      aria-label="Remove from wishlist"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {/* Stock Status */}
                  <div className="mt-3 text-center">
                    {item.Product.productTotalStock > 0 ? (
                      <span className="text-xs text-green-600 font-semibold">
                        {item.Product.productTotalStock} in stock
                      </span>
                    ) : (
                      <span className="text-xs text-red-600 font-semibold">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="mt-12 text-center">
            <Link to="/products">
              <button className="bg-white text-gray-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto">
                Continue Shopping
                <FaArrowRight />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
