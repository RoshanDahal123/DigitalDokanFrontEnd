import { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  fetchProductReviews,
  addReview,
  fetchUserProductReview,
  deleteReview,
} from "../../../store/reviewSlice";

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const dispatch = useAppDispatch();
  const { productReviews, userProductReview } = useAppSelector(
    (state) => state.review
  );
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(fetchProductReviews(productId));
    if (token) {
      dispatch(fetchUserProductReview(productId));
    }
  }, [productId, token]);

  useEffect(() => {
    if (userProductReview) {
      setRating(userProductReview.rating);
      setComment(userProductReview.comment);
    }
  }, [userProductReview]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Please login to submit a review");
      return;
    }

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    await dispatch(addReview({ productId, rating, comment }));
    setIsSubmitting(false);
    setShowReviewForm(false);
  };

  const handleDeleteReview = async () => {
    if (userProductReview && window.confirm("Are you sure you want to delete your review?")) {
      await dispatch(deleteReview(userProductReview.id, productId));
      setRating(0);
      setComment("");
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? "cursor-pointer" : "cursor-default"} transition-transform ${interactive && "hover:scale-125"}`}
          >
            {(interactive ? (hoverRating || rating) : rating) >= star ? (
              <FaStar className="text-yellow-400 text-xl" />
            ) : (
              <FaRegStar className="text-gray-300 text-xl" />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12">
      <div className="border-t pt-8">
        <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>

        {/* Overall Rating Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-5xl font-bold text-gray-900">
                  {productReviews?.averageRating || "0"}
                </span>
                <div>
                  {renderStars(Number(productReviews?.averageRating || 0))}
                  <p className="text-sm text-gray-600 mt-1">
                    Based on {productReviews?.totalReviews || 0} reviews
                  </p>
                </div>
              </div>
            </div>

            {token && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                {userProductReview ? "Update Review" : "Write a Review"}
              </button>
            )}
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && token && (
          <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">
              {userProductReview ? "Update Your Review" : "Write Your Review"}
            </h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Rating *
                </label>
                {renderStars(rating, true)}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your experience with this product..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
                {userProductReview && (
                  <button
                    type="button"
                    onClick={handleDeleteReview}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Delete Review
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {productReviews?.reviews && productReviews.reviews.length > 0 ? (
            productReviews.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {review?.User?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review?.User?.username}
                        </p>
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-gray-600 text-lg">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
