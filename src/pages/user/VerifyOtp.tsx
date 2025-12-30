import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { verifyOtp, setResetEmail, clearMessages } from "../../store/authSlice";
import { Status } from "../../globals/type";
import { Link, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaArrowRight, FaCheckCircle, FaRedo } from "react-icons/fa";

function VerifyOtp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { status, error, successMessage, resetEmail } = useAppSelector(
    (state) => state.auth
  );
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    dispatch(clearMessages());
    
    const storedEmail = localStorage.getItem("resetEmail");
    
    if (!resetEmail && storedEmail) {
      dispatch(setResetEmail(storedEmail));
      setIsChecking(false);
      return;
    }
    
    if (resetEmail) {
      setIsChecking(false);
      return;
    }
    
    if (!resetEmail && !storedEmail) {
      navigate("/forgot-password");
      return;
    }
    
    setIsChecking(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
    if (status === Status.SUCCESS && successMessage) {
      if (successMessage.includes("verified")) {
        setTimeout(() => {
          navigate("/reset-password");
        }, 2000);
      }
    }
  }, [status, successMessage, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (resetEmail) {
      dispatch(verifyOtp({ email: resetEmail, otp }));
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-10 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="text-4xl text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Verify OTP</h2>
            <p className="text-blue-100">Enter the code sent to your email</p>
          </div>

          {/* Form Section */}
          <div className="px-8 py-10">
            <p className="text-center text-gray-600 mb-8">
              Enter the 6-digit OTP sent to{" "}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {resetEmail}
              </span>
            </p>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg animate-fade-in">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaCheckCircle className="h-5 w-5 text-green-500" />
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
              {/* OTP Field */}
              <div>
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                  OTP Code
                </label>
                <div className="relative">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={otp}
                    onChange={handleChange}
                    className="w-full px-4 py-6 text-center text-3xl font-bold tracking-[1em] border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900"
                    placeholder="000000"
                  />
                </div>
                <p className="mt-3 text-xs text-center text-gray-500 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  OTP is valid for 2 minutes
                </p>
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
                    Verifying...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Verify OTP
                    <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Action Links */}
            <div className="mt-8 space-y-3">
              <Link
                to="/forgot-password"
                className="flex items-center justify-center gap-2 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <FaRedo />
                Resend OTP
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
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

export default VerifyOtp;
