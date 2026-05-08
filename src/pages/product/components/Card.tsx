import { Link } from "react-router-dom";
import { IProduct } from "../types";
import { useState } from "react";
import { useAppDispatch } from "../../../store/hook";
import { addToWishlist, removeFromWishlist } from "../../../store/wishlistSlice";
import { addToCart } from "../../../store/cartSlice";
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart, FaEye } from "react-icons/fa";
const baseURL = import.meta.env.IMAGE_UPLOAD_URL|| "https://mern-digitaldhokanproject.onrender.com/";
interface ICardProp {
  product: IProduct;
}

const Card: React.FC<ICardProp> = ({ product }) => {
  const dispatch = useAppDispatch();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const token = localStorage.getItem("token");

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!token) {
      alert("Please login to add items to wishlist");
      return;
    }

    if (isInWishlist) {
      await dispatch(removeFromWishlist(product.id));
      setIsInWishlist(false);
    } else {
      await dispatch(addToWishlist(product.id));
      setIsInWishlist(true);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }

    setIsAddingToCart(true);
    await dispatch(addToCart(product.id));
    setIsAddingToCart(false);
  };

  const discountPercentage = product.productDiscount
    ? Math.round(((product.productDiscount - product.productPrice) / product.productDiscount) * 100)
    : 0;

  return (
    <div className="group relative">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden">
        <Link to={`/product/${product.id}`} className="block">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-square">
            <img
              src={`${baseURL}${product.productImageUrl}`}
              alt={product.productName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            
            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl animate-pulse">
                -{discountPercentage}% OFF
              </div>
            )}

            {/* Stock Badge */}
            {product.productTotalStock < 10 && product.productTotalStock > 0 && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                Only {product.productTotalStock} left!
              </div>
            )}

            {product.productTotalStock === 0 && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <span className="text-white text-2xl font-bold bg-red-600 px-6 py-3 rounded-full shadow-xl">
                  OUT OF STOCK
                </span>
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-10"
            >
              {isInWishlist ? (
                <FaHeart className="text-red-500 text-xl animate-pulse" />
              ) : (
                <FaRegHeart className="text-gray-600 text-xl group-hover:text-red-500 transition-colors" />
              )}
            </button>

            {/* View Details Button - Shows on Hover */}
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-blue-600 font-semibold shadow-xl">
                <FaEye />
                View Details
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6">
            {/* Category */}
            <div className="flex items-center justify-between mb-3">
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
                {product?.Category?.categoryName || "Uncategorized"}
              </span>
              {/* Stock Indicator */}
              <div className={`w-3 h-3 rounded-full ${
                product.productTotalStock > 10 ? "bg-green-500" : 
                product.productTotalStock > 0 ? "bg-orange-500" : "bg-red-500"
              } shadow-lg`} />
            </div>

            {/* Product Name */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all min-h-[3.5rem]">
              {product.productName}
            </h3>

            {/* Rating - Only show if product has reviews */}
            {product.averageRating && product.totalReviews && product.totalReviews > 0 ? (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={`${
                        index < Math.round(product.averageRating || 0) ? "text-yellow-400" : "text-gray-300"
                      } text-sm`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  ({product.averageRating.toFixed(1)}) • {product.totalReviews} {product.totalReviews === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            ) : (
              <div className="mb-4 h-6 flex items-center">
                <span className="text-sm text-gray-400">No reviews yet</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Rs. {product.productPrice.toLocaleString()}
                </span>
                {product.productDiscount && product.productDiscount > product.productPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    Rs. {product.productDiscount.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.productTotalStock === 0}
              aria-label="Add to cart"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <FaShoppingCart className={isAddingToCart ? "animate-bounce" : ""} />
              {isAddingToCart ? "Adding..." : product.productTotalStock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Card;
