import { useEffect, useState } from "react";
import { fetchProduct } from "../../store/productSlice";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../globals/component/Navbar";
import { addToCart } from "../../store/cartSlice";
import { addToWishlist, removeFromWishlist, checkWishlistStatus } from "../../store/wishlistSlice";
import { fetchProductReviews } from "../../store/reviewSlice";
import ReviewSection from "./components/ReviewSection";
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart, FaBox, FaTruck, FaShieldAlt, FaRegStar } from "react-icons/fa";
import { BsLightning } from "react-icons/bs";

function SingleProduct() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { product } = useAppSelector((store) => store.products);
  const { productReviews } = useAppSelector((store) => store.review);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
      dispatch(fetchProductReviews(id));
      checkWishlist();
    }
  }, [id]);

  const checkWishlist = async () => {
    if (id && token) {
      const inWishlist = await dispatch(checkWishlistStatus(id));
      setIsInWishlist(inWishlist);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (id) {
      setIsAddingToCart(true);
      await dispatch(addToCart(id));
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!token) {
      alert("Please login to add items to wishlist");
      navigate("/login");
      return;
    }

    if (id) {
      try {
        if (isInWishlist) {
          const result:any = await dispatch(removeFromWishlist(id));
          if (result?.success) {
            setIsInWishlist(false);
            alert("Removed from wishlist!");
          }
        } else {
          const result:any = await dispatch(addToWishlist(id));
          if (result?.success) {
            setIsInWishlist(true);
            alert("Added to wishlist!");
          }
        }
        // Re-check wishlist status
        await checkWishlist();
      } catch (error) {
        console.error("Wishlist toggle error:", error);
      }
    }
  };

  const discountPercentage = product?.productDiscount
    ? Math.round(((product.productDiscount - product.productPrice) / product.productDiscount) * 100)
    : 0;

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <button onClick={() => navigate("/")} className="hover:text-blue-600">Home</button>
          <span>/</span>
          <button onClick={() => navigate("/products")} className="hover:text-blue-600">Products</button>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.productName}</span>
        </nav>

        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Section */}
            <div>
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-4">
                <img
                  src={`http://localhost:4000/${product.productImageUrl}`}
                  alt={product.productName}
                  className="w-full h-[500px] object-cover"
                />
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                    -{discountPercentage}% OFF
                  </div>
                )}
                {product.productTotalStock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">OUT OF STOCK</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col">
              {/* Category Badge */}
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold w-fit mb-4">
                {product.Category?.categoryName}
              </span>

              {/* Product Name */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.productName}
              </h1>

              {/* Rating - Only show if there are reviews */}
              {productReviews && productReviews.totalReviews > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, index) => {
                      const averageRating = productReviews?.averageRating 
                        ? parseFloat(productReviews.averageRating) 
                        : 0;
                      const isFullStar = index < Math.floor(averageRating);
                      const isHalfStar = index === Math.floor(averageRating) && averageRating % 1 >= 0.5;
                      
                      return isFullStar ? (
                        <FaStar key={index} className="text-yellow-400 text-xl" />
                      ) : isHalfStar ? (
                        <FaStar key={index} className="text-yellow-400 text-xl" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                      ) : (
                        <FaRegStar key={index} className="text-gray-300 text-xl" />
                      );
                    })}
                  </div>
                  <span className="text-gray-600">
                    ({productReviews.averageRating}) • {productReviews.totalReviews} {productReviews.totalReviews === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-bold text-gray-900">
                    ${product.productPrice}
                  </span>
                  {product.productDiscount && product.productDiscount > product.productPrice && (
                    <>
                      <span className="text-2xl text-gray-500 line-through">
                        ${product.productDiscount}
                      </span>
                      <span className="text-lg text-green-600 font-semibold">
                        Save ${product.productDiscount - product.productPrice}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.productTotalStock > 0 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <FaBox />
                    <span className="font-semibold">
                      {product.productTotalStock > 10 
                        ? "In Stock" 
                        : `Only ${product.productTotalStock} left in stock!`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <FaBox />
                    <span className="font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.productDescription}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.productTotalStock === 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FaShoppingCart />
                  {isAddingToCart ? "Adding..." : product.productTotalStock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className="px-6 py-4 bg-white border-2 border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all"
                >
                  {isInWishlist ? (
                    <FaHeart className="text-red-500 text-2xl" />
                  ) : (
                    <FaRegHeart className="text-gray-600 text-2xl hover:text-red-500" />
                  )}
                </button>
              </div>

              {/* Features */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <FaTruck className="text-blue-600 text-xl" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <BsLightning className="text-yellow-500 text-xl" />
                  <span>Fast delivery in 3-5 business days</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaShieldAlt className="text-green-600 text-xl" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {id && <ReviewSection productId={id} />}
      </div>
    </div>
  );
}

export default SingleProduct;
