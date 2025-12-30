import { useEffect, useState } from "react";
import Navbar from "../../globals/component/Navbar";
import Card from "./components/Card";
import { fetchProducts } from "../../store/productSlice";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { HiAdjustments } from "react-icons/hi";

const Product = () => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((store) => store.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  // Get unique categories
  const categories = ["all", ...new Set(products.map(p => p.Category?.categoryName).filter(Boolean))];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.Category?.categoryName === selectedCategory;
      const matchesPrice = product.productPrice >= priceRange[0] && product.productPrice <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.productPrice - b.productPrice;
        case "price-high":
          return b.productPrice - a.productPrice;
        case "name-az":
          return a.productName.localeCompare(b.productName);
        case "name-za":
          return b.productName.localeCompare(a.productName);
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("default");
    setPriceRange([0, 10000]);
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Discover Amazing <span className="text-yellow-300">Products</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 font-light">
              Shop from our curated collection of premium products
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-3xl mx-auto">
              <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-16 py-5 rounded-2xl text-gray-900 text-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b sticky top-20 z-40 shadow-md">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <HiAdjustments className="text-xl" />
              Filters
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-6 flex-1">
              {/* Category Filter */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <FaFilter className="text-blue-600" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filter by category"
                  className="px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white font-medium text-gray-700 hover:border-purple-300"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                  <BiSortAlt2 className="text-purple-600 text-2xl" />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                  className="px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white font-medium text-gray-700 hover:border-purple-300"
                >
                  <option value="default">Default Sorting</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-az">Name: A to Z</option>
                  <option value="name-za">Name: Z to A</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedCategory !== "all" || sortBy !== "default") && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 font-semibold transition-colors"
                >
                  <FaTimes />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 rounded-xl">
              <span className="text-gray-700 font-bold">
                {filteredProducts.length}
              </span>
              <span className="text-gray-600 ml-1">
                of {products.length} products
              </span>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-xl space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filter by category"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="default">Default Sorting</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-az">Name: A to Z</option>
                  <option value="name-za">Name: Z to A</option>
                </select>
              </div>
              {(searchTerm || selectedCategory !== "all" || sortBy !== "default") && (
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  <FaTimes />
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <Card product={product} key={product.id} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-12">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaSearch className="text-5xl text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">No Products Found</h3>
                <p className="text-gray-600 mb-6 text-lg">Try adjusting your search or filters to find what you're looking for</p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
