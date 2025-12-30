import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { resetPassword, clearMessages, setResetEmail, setOtpVerified, clearResetState } from "../../store/authSlice";
import { Status } from "../../globals/type";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function ResetPassword() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { status, error, successMessage, otpVerified, resetEmail } = useAppSelector(
    (state) => state.auth
  );
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    dispatch(clearMessages());
    
    const storedEmail = localStorage.getItem("resetEmail");
    const storedOtpVerified = localStorage.getItem("otpVerified") === "true";
    
    if (!resetEmail && storedEmail) {
      dispatch(setResetEmail(storedEmail));
    }
    if (!otpVerified && storedOtpVerified) {
      dispatch(setOtpVerified(true));
    }
    
    const hasEmail = resetEmail || storedEmail;
    const hasVerified = otpVerified || storedOtpVerified;
    
    if (!hasVerified || !hasEmail) {
      navigate("/forgot-password");
      return;
    }
    
    setTimeout(() => {
      setHasMounted(true);
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
    
    if (!hasMounted) {
      return;
    }
    
    if (status === Status.SUCCESS && successMessage) {
      const messageLC = successMessage.toLowerCase();
      if (messageLC.includes("password") && messageLC.includes("reset")) {
        setTimeout(() => {
          dispatch(clearResetState());
          navigate("/login");
        }, 3000);
      }
    }
  }, [status, successMessage, navigate, hasMounted, dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (resetEmail) {
      dispatch(resetPassword({ ...data, email: resetEmail }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-10 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLock className="text-4xl text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-blue-100">Create a new secure password</p>
          </div>

          {/* Form Section */}
          <div className="px-8 py-10">
            <p className="text-center text-gray-600 mb-8">
              Create a new password for{" "}
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
              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={data.newPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <AiFillEyeInvisible className="text-xl" /> : <AiFillEye className="text-xl" />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={data.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-gray-900"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <AiFillEyeInvisible className="text-xl" /> : <AiFillEye className="text-xl" />}
                  </button>
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
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Reset Password
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

export default ResetPassword;
