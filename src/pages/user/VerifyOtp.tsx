import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { verifyOtp, setResetEmail, clearMessages } from "../../store/authSlice";
import { Status } from "../../globals/type";
import { Link, useNavigate } from "react-router-dom";

function VerifyOtp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { status, error, successMessage, resetEmail } = useAppSelector(
    (state) => state.auth
  );
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  // Check on mount and restore from localStorage if needed
  useEffect(() => {
    console.log('[VerifyOtp] Component mounted');
    
    // IMPORTANT: Clear messages first to prevent stale SUCCESS status from causing navigation
    dispatch(clearMessages());
    console.log('[VerifyOtp] Messages cleared');
    
    console.log('[VerifyOtp] resetEmail from Redux:', resetEmail);
    
    const storedEmail = localStorage.getItem("resetEmail");
    console.log('[VerifyOtp] resetEmail from localStorage:', storedEmail);
    
    // If no email in Redux but exists in localStorage, restore it
    if (!resetEmail && storedEmail) {
      console.log('[VerifyOtp] Restoring email from localStorage');
      dispatch(setResetEmail(storedEmail));
      setIsChecking(false);
      return;
    }
    
    // If we have email in Redux, we're good
    if (resetEmail) {
      console.log('[VerifyOtp] Email exists in Redux, staying on page');
      setIsChecking(false);
      return;
    }
    
    // If no email anywhere, redirect
    if (!resetEmail && !storedEmail) {
      console.log('[VerifyOtp] No email found, redirecting to forgot-password');
      navigate("/forgot-password");
      return;
    }
    
    setIsChecking(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  useEffect(() => {
    console.log('[VerifyOtp] Status changed:', status);
    console.log('[VerifyOtp] Success message:', successMessage);
    
    if (status !== "loading") {
      setLoading(false);
    }
    if (status === Status.SUCCESS && successMessage) {
      console.log('[VerifyOtp] SUCCESS detected, checking if OTP was verified...');
      // Only navigate if the success is from OTP verification (not from forgot password)
      if (successMessage.includes("verified")) {
        console.log('[VerifyOtp] OTP verified, navigating to reset password in 2 seconds');
        setTimeout(() => {
          navigate("/reset-password");
        }, 2000);
      } else {
        console.log('[VerifyOtp] SUCCESS is from forgot password, NOT navigating');
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

  // Show loading while checking authentication state
  if (isChecking) {
    return (
      <div className="bg-gray-100 flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-sky-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="my-3 text-center text-3xl font-bold tracking-tight text-gray-900">
            Verify OTP
          </h2>

          <p className="text-center text-sm text-gray-600 mb-6">
            Enter the 6-digit OTP sent to{" "}
            <span className="font-semibold">{resetEmail}</span>
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
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                OTP Code
              </label>
              <div className="mt-1">
                <input
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  value={otp}
                  className="px-2 py-3 mt-1 block w-full text-center text-2xl tracking-widest rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500"
                  onChange={handleChange}
                  placeholder="000000"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 text-center">
                OTP is valid for 2 minutes
              </p>
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
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link
              to="/forgot-password"
              className="block text-sm text-sky-500 hover:underline font-medium"
            >
              Resend OTP
            </Link>
            <Link
              to="/login"
              className="block text-sm text-gray-500 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
