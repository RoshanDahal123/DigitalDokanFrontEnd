import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { forgotPassword, clearMessages } from "../../store/authSlice";
import { Status } from "../../globals/type";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaKey, FaArrowRight, FaPaperPlane } from "react-icons/fa";

function ForgotPassword() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, successMessage } = useAppSelector(
    (state) => state.auth
  );
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
    if (status === Status.SUCCESS && successMessage) {
      setTimeout(() => {
        navigate("/verify-otp");
      }, 1500);
    }
  }, [status, successMessage, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    dispatch(forgotPassword({ email }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-10 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <FaKey className="text-4xl text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Forgot Password?</h2>
            <p className="text-blue-100">Don't worry, we'll help you reset it</p>
          </div>

          {/* Form Section */}
          <div className="px-8 py-10">
            <p className="text-center text-gray-600 mb-8">
              Enter your email address and we'll send you an OTP code to reset your password.
            </p>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg animate-fade-in">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-green-700 font-medium">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-fade-in">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Reset Code
                    <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all inline-flex items-center gap-2"
              >
                <FaArrowRight className="rotate-180" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-white hover:text-blue-100 font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <FaArrowRight className="rotate-180" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
