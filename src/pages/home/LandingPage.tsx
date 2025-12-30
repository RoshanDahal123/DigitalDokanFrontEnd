import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../globals/component/Navbar";
import Card from "../product/components/Card";
import { fetchProducts } from "../../store/productSlice";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { FaShoppingBag, FaTruck, FaShieldAlt, FaHeadset, FaArrowRight } from "react-icons/fa";

const LandingPage = () => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((store) => store.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  // Get featured products (first 8)
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white pt-24 pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-fade-in">
              Welcome to <span className="text-yellow-300">DigitalDookan</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 font-light">
              Discover amazing products at unbeatable prices. Your one-stop shop for everything you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/products">
                <button className="group py-4 px-10 bg-white text-blue-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                  <FaShoppingBag className="group-hover:animate-bounce" />
                  Shop Now
                  <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
              <Link to="/products">
                <button className="py-4 px-10 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
                  Browse Categories
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTruck className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Fast Delivery</h3>
              <p className="text-gray-600">Get your orders delivered quickly and safely to your doorstep</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Secure Payment</h3>
              <p className="text-gray-600">100% secure payment with trusted payment gateways</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeadset className="text-3xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">24/7 Support</h3>
              <p className="text-gray-600">Round the clock customer support for all your queries</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShoppingBag className="text-3xl text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Best Prices</h3>
              <p className="text-gray-600">Competitive prices on all products with great deals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Check out our handpicked selection of trending products
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {featuredProducts.map((product) => (
                  <Card product={product} key={product.id} />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link to="/products">
                  <button className="group py-4 px-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto">
                    View All Products
                    <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Loading Products...</h3>
              <p className="text-gray-500">Please wait while we fetch the latest products</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Shopping Today!
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-50">
            Join thousands of happy customers and discover the best deals on quality products.
          </p>
          <Link to="/products">
            <button className="py-4 px-12 bg-white text-blue-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
              Explore Products
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-16 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">DigitalDookan</h2>
              <p className="text-gray-400">
                Your trusted online marketplace for quality products at the best prices.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Important Links</h2>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Terms &amp; Conditions</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <Link to="/products" className="hover:text-white transition-colors">Products</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@digitaldookan.com</li>
                <li>Phone: +1 234 567 890</li>
                <li>Address: Kathmandu, Nepal</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} DigitalDookan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
