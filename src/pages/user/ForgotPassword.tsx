import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { forgotPassword, clearMessages, clearResetState } from "../../store/authSlice";
import { Status } from "../../globals/type";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, successMessage } = useAppSelector(
    (state) => state.auth
  );
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    console.log('[ForgotPassword] Component mounted');
    // Clear any previous messages when component mounts
    dispatch(clearMessages());
    // DON'T clear reset state - user might be coming back to resend OTP
  }, [dispatch]);

  useEffect(() => {
    console.log('[ForgotPassword] Status:', status, 'Message:', successMessage);
    if (status !== "loading") {
      setLoading(false);
    }
    if (status === Status.SUCCESS && successMessage) {
      console.log('[ForgotPassword] OTP sent successfully, will navigate to verify-otp');
      // Small delay to ensure localStorage is set before navigation
      setTimeout(() => {
        const storedEmail = localStorage.getItem("resetEmail");
        console.log('[ForgotPassword] Before navigation, resetEmail in localStorage:', storedEmail);
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
    <div className="bg-gray-100 flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="bg-white shadow-md rounded-md p-6">
          <div className="flex justify-center mb-4">
            <svg
              className="h-12 w-12 text-sky-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>

          <h2 className="my-3 text-center text-3xl font-bold tracking-tight text-gray-900">
            Forgot Password?
          </h2>

          <p className="text-center text-sm text-gray-600 mb-6">
            Enter your email address and we'll send you an OTP to reset your password.
          </p>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-sky-400 hover:bg-opacity-75"
                }`}
              >
                {loading ? "Sending OTP..." : "Send Reset OTP"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-sky-500 hover:underline font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
