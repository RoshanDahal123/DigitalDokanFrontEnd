import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { useEffect, useState } from "react";
import { fetchCartItems } from "../../store/cartSlice";
import { logoutUser } from "../../store/authSlice";
import { FaShoppingCart, FaSignOutAlt, FaUserPlus, FaSignInAlt, FaTachometerAlt, FaBox, FaClipboardList, FaHeart } from "react-icons/fa";

function Navbar() {
  const reduxToken = useAppSelector((store) => store.auth.user.token);
  const { items } = useAppSelector((store) => store.cart);
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check login status on component mount and when reduxToken changes
  const localStorageToken = localStorage.getItem("token");
  const adminLocalStorageToken = localStorage.getItem("adminToken");
  const isLoggedIn = !!localStorageToken || !!adminLocalStorageToken || !!reduxToken;
  const isAdmin = !!adminLocalStorageToken && (reduxToken === adminLocalStorageToken || !reduxToken);

  useEffect(() => {
    if (isLoggedIn && !isAdmin) {
      dispatch(fetchCartItems());
    }
  }, [isLoggedIn, isAdmin, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white shadow-xl" 
        : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700"
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={`w-12 h-12 rounded-xl ${
              scrolled ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-white/20"
            } flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg`}>
              <FaShoppingCart className={`text-2xl ${scrolled ? "text-white" : "text-white"}`} />
            </div>
            <span className={`text-2xl font-bold ${
              scrolled ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" : "text-white"
            }`}>
              DigitalDookan
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/products" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                scrolled 
                  ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50" 
                  : "text-white hover:bg-white/20"
              }`}
            >
              <FaBox />
              <span>Products</span>
            </Link>
            
            {isLoggedIn && !isAdmin && (
              <>
                <Link 
                  to="/my-orders" 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    scrolled 
                      ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50" 
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <FaClipboardList className="text-xl" />
                  <span>My Orders</span>
                </Link>
                <Link 
                  to="/my-wishlist" 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    scrolled 
                      ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50" 
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <FaHeart className="text-xl" />
                  <span>Wishlist</span>
                </Link>
                <Link 
                  to="/my-cart" 
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    scrolled 
                      ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50" 
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <FaShoppingCart className="text-xl" />
                  <span>Cart</span>
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                      {items.length}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <button className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      scrolled
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-white text-blue-600 hover:bg-blue-50"
                    }`}>
                      <FaTachometerAlt />
                      <span>Dashboard</span>
                    </button>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    scrolled
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  }`}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/register">
                  <button className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    scrolled
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  }`}>
                    <FaUserPlus />
                    <span>Register</span>
                  </button>
                </Link>
                <Link to="/login">
                  <button className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    scrolled
                      ? "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
                      : "bg-white text-blue-600 hover:bg-blue-50"
                  }`}>
                    <FaSignInAlt />
                    <span>Login</span>
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
              scrolled 
                ? "text-gray-700 hover:bg-gray-100" 
                : "text-white hover:bg-white/20"
            }`}
          >
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 space-y-2 animate-fade-in">
            <Link
              to="/products"
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                scrolled
                  ? "text-gray-700 hover:bg-blue-50"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <FaBox />
              <span>Products</span>
            </Link>

            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                        scrolled
                          ? "text-gray-700 hover:bg-blue-50"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <FaTachometerAlt />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-left ${
                        scrolled
                          ? "text-gray-700 hover:bg-red-50"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/my-orders"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                        scrolled
                          ? "text-gray-700 hover:bg-blue-50"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <FaClipboardList />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/my-wishlist"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                        scrolled
                          ? "text-gray-700 hover:bg-blue-50"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <FaHeart />
                      <span>Wishlist</span>
                    </Link>
                    <Link
                      to="/my-cart"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all relative ${
                        scrolled
                          ? "text-gray-700 hover:bg-blue-50"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <FaShoppingCart />
                      <span>Cart</span>
                      {items.length > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                          {items.length}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-left ${
                        scrolled
                          ? "text-gray-700 hover:bg-red-50"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                    scrolled
                      ? "text-gray-700 hover:bg-blue-50"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <FaUserPlus />
                  <span>Register</span>
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                    scrolled
                      ? "text-gray-700 hover:bg-blue-50"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
