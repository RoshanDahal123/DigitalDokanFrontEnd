import { Link } from "react-router-dom";
import { IProduct } from "../types";
import { useState, useEffect } from "react";
import { useAppDispatch } from "../../../store/hook";
import { addToWishlist, removeFromWishlist } from "../../../store/wishlistSlice";
import { addToCart } from "../../../store/cartSlice";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";

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
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
        <Link to={`/product/${product.id}`} className="block">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-gray-100">
            <img
              src={`http://localhost:4000/${product.productImageUrl}`}
              alt={product.productName}
              className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                -{discountPercentage}%
              </div>
            )}

            {/* Stock Badge */}
            {product.productTotalStock < 10 && product.productTotalStock > 0 && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Only {product.productTotalStock} left
              </div>
            )}

            {product.productTotalStock === 0 && (
              <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Out of Stock
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
            >
              {isInWishlist ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-gray-600 text-xl hover:text-red-500" />
              )}
            </button>

            {/* Quick Add to Cart */}
            <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.productTotalStock === 0}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BsCart3 className="text-xl" />
                {isAddingToCart ? "Adding..." : product.productTotalStock === 0 ? "Out of Stock" : "Quick Add to Cart"}
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-5">
            {/* Category */}
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              {product?.Category?.categoryName}
            </span>

            {/* Product Name */}
            <h3 className="mt-2 text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {product.productName}
            </h3>

            {/* Rating */}
            <div className="flex items-center mt-2 gap-1">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`${
                    index < 4 ? "text-yellow-400" : "text-gray-300"
                  } text-sm`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">(4.0)</span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.productPrice}
                </span>
                {product.productDiscount && product.productDiscount > product.productPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.productDiscount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Card;
