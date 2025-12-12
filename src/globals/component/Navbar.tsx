import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { useEffect, useState } from "react";
import { fetchCartItems } from "../../store/cartSlice";
import { logoutUser } from "../../store/authSlice";

function Navbar() {
  const reduxToken = useAppSelector((store) => store.auth.user.token);
  const { items } = useAppSelector((store) => store.cart);
  const dispatch = useAppDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const localStorageToken = localStorage.getItem("token");
    const adminLocalStorageToken = localStorage.getItem("adminToken");
    const loginStatus =
      !!localStorageToken || !!reduxToken || !!adminLocalStorageToken;
    setIsLoggedIn(loginStatus);

    // console.log(isLoggedIn);
  }, [reduxToken]);
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCartItems());
      // console.log(isLoggedIn);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div>
      <header className="sticky top-0 bg-white shadow">
        <div className="container mx-auto py-3 px-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xl md:text-2xl">
              <div className="w-8 md:w-12 mr-2 md:mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  //{" "}
                  <path
                    fill="#BEE3F8"
                    d="M44,7L4,23l40,16l-7-16L44,7z M36,23H17l18-7l1,6V23z"
                  />
                  <path
                    fill="#3182CE"
                    d="M40.212,10.669l-5.044,11.529L34.817,23l0.351,0.802l5.044,11.529L9.385,23L40.212,10.669 M44,7L4,23 l40,16l-7-16L44,7L44,7z"
                  ></path>
                  <path
                    fill="#3182CE"
                    d="M36,22l-1-6l-18,7l17,7l-2-5l-8-2h12V22z M27.661,21l5.771-2.244L33.806,21H27.661z"
                  ></path>
                </svg>
              </div>
              <Link to="/">DDookan...</Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/products" className="px-4">
                Product
              </Link>
              {isLoggedIn && (
                <Link to="/my-cart" className="px-4">
                  Cart<sup>{items.length > 0 ? items.length : 0}</sup>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    className=" py-3 px-8 text-sm bg-teal-500 hover:bg-teal-600 rounded text-white mr-3 "
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <button
                      type="button"
                      className=" py-3 px-8 text-sm bg-teal-500 hover:bg-teal-600 rounded text-white mr-3 "
                    >
                      Register
                    </button>
                  </Link>
                  <Link to="/login">
                    <button
                      type="button"
                      className=" py-3 px-8 text-sm bg-teal-500 hover:bg-teal-600 rounded text-white "
                    >
                      Login
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden ${
              isOpen ? "block" : "hidden"
            } mt-4 space-y-4`}
          >
            <Link
              to="/products"
              className="block py-2 hover:bg-gray-100 rounded"
            >
              Product
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/my-cart"
                  className="block py-2 hover:bg-gray-100 rounded"
                >
                  Cart <sup>{items.length > 0 ? items.length : 0}</sup>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-left hover:bg-gray-100 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="block py-2 hover:bg-gray-100 rounded"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="block py-2 hover:bg-gray-100 rounded"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
