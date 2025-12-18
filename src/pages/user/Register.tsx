import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../store/hook";

import { registerUser } from "../../store/authSlice";
import { Status } from "../../globals/type";
import { IAuthState } from "./types";
import { useNavigate } from "react-router-dom";

/**
 * Register component handles the user registration process.
 *
 * @remarks
 * This component uses `useDispatch` and `useSelector` hooks from React Redux.
 *
 * @function useDispatch
 * The `useDispatch` hook is used to dispatch actions to the Redux store.
 * It returns a reference to the `dispatch` function from the Redux store.
 * no type , external type must be given
 *
 * @function useSelector
 * The `useSelector` hook is used to extract data from the Redux store state.
 * It takes a selector function as an argument and returns the selected state.
 * no type ,external type must be given
 */
function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { status, error, successMessage } = useAppSelector(
    (state: { auth: IAuthState }) => state.auth
  );

  const [data, setData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    dispatch(registerUser(data));
  };

  useEffect(() => {
    if (status === Status.SUCCESS && successMessage) {
      setLoading(false);
      // Show success message for 2 seconds before redirecting
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else if (status === Status.ERROR) {
      setLoading(false);
    }
  }, [status, successMessage, navigate]);

  return (
    <div className="bg-gray-100 flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="bg-white shadow-md rounded-md p-6 ">
          <img
            className="mx-auto h-12 w-auto"
            src="https://www.svgrepo.com/show/499664/user-happy.svg"
            alt=""
          />

          <h2 className="my-3 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign up for an account
          </h2>

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
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm "
                  onChange={handleChange}
                  placeholder="Your username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  onChange={handleChange}
                  placeholder="Min 8 chars, include A-Z, a-z, 0-9, @$!%*?&"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, number, and special character
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
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-sky-500 hover:underline font-medium">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
