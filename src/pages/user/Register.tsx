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
  const { status } = useAppSelector(
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
    setLoading(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    dispatch(registerUser(data));
  };
  useEffect(() => {
    if (status === Status.SUCCESS) {
      navigate("/login");
    } else if (status === Status.ERROR) {
      alert("Something went wrong");
    }
  }, [status, navigate]);

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

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  name="username"
                  type="username"
                  required
                  className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm "
                  onChange={handleChange}
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
                  type="email-address"
                  autoComplete="email-address"
                  required
                  className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  onChange={handleChange}
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
                  autoComplete="password"
                  required
                  className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              {loading ? (
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-sky-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                >
                  Loading...
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-sky-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                >
                  Register
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
