import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { resetPassword, clearMessages, setResetEmail, setOtpVerified, clearResetState } from "../../store/authSlice";
import { Status } from "../../globals/type";
import { Link, useNavigate } from "react-router-dom";

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

  // Check on mount and restore from localStorage if needed
  useEffect(() => {
    console.log('[ResetPassword] Component mounted');
    
    // IMPORTANT: Clear messages first to prevent stale SUCCESS from OTP verification
    dispatch(clearMessages());
    console.log('[ResetPassword] Messages cleared');
    
    const storedEmail = localStorage.getItem("resetEmail");
    const storedOtpVerified = localStorage.getItem("otpVerified") === "true";
    
    console.log('[ResetPassword] resetEmail from Redux:', resetEmail);
    console.log('[ResetPassword] resetEmail from localStorage:', storedEmail);
    console.log('[ResetPassword] otpVerified from Redux:', otpVerified);
    console.log('[ResetPassword] otpVerified from localStorage:', storedOtpVerified);
    
    // Restore from localStorage if page was refreshed
    if (!resetEmail && storedEmail) {
      console.log('[ResetPassword] Restoring email from localStorage');
      dispatch(setResetEmail(storedEmail));
    }
    if (!otpVerified && storedOtpVerified) {
      console.log('[ResetPassword] Restoring otpVerified from localStorage');
      dispatch(setOtpVerified(true));
    }
    
    // Check after potential restoration
    const hasEmail = resetEmail || storedEmail;
    const hasVerified = otpVerified || storedOtpVerified;
    
    if (!hasVerified || !hasEmail) {
      console.log('[ResetPassword] Missing verification or email, redirecting to forgot-password');
      navigate("/forgot-password");
      return;
    }
    
    console.log('[ResetPassword] All checks passed, staying on page');
    
    // Set mounted flag after a small delay to ensure messages are cleared
    setTimeout(() => {
      setHasMounted(true);
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount

  useEffect(() => {
    console.log('[ResetPassword] Status changed:', status);
    console.log('[ResetPassword] Success message:', successMessage);
    console.log('[ResetPassword] Has mounted:', hasMounted);
    
    if (status !== "loading") {
      setLoading(false);
    }
    
    // Only process navigation if component has fully mounted (prevents initial stale SUCCESS)
    if (!hasMounted) {
      console.log('[ResetPassword] Not yet mounted, ignoring status');
      return;
    }
    
    if (status === Status.SUCCESS && successMessage) {
      console.log('[ResetPassword] SUCCESS detected after mount, checking message...');
      const messageLC = successMessage.toLowerCase();
      console.log('[ResetPassword] Message in lowercase:', messageLC);
      // Check if message contains both "password" and "reset"
      if (messageLC.includes("password") && messageLC.includes("reset")) {
        console.log('[ResetPassword] ✅ Password reset successful, navigating to login in 3 seconds');
        setTimeout(() => {
          console.log('[ResetPassword] Navigating now...');
          dispatch(clearResetState()); // Clear state before navigation
          navigate("/login");
        }, 3000);
      } else {
        console.log('[ResetPassword] ❌ Message does not match password reset pattern');
      }
    } else {
      console.log('[ResetPassword] No SUCCESS status or no message');
    }
  }, [status, successMessage, navigate, hasMounted]);

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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h2 className="my-3 text-center text-3xl font-bold tracking-tight text-gray-900">
            Reset Password
          </h2>

          <p className="text-center text-sm text-gray-600 mb-6">
            Create a new password for{" "}
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
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={data.newPassword}
                  className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={data.confirmPassword}
                  className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  onChange={handleChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="showPassword"
                name="showPassword"
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
              />
              <label
                htmlFor="showPassword"
                className="ml-2 block text-sm text-gray-700"
              >
                Show passwords
              </label>
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
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-500 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
