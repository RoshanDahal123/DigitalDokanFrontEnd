import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { fetchAllOrder, IAdminOrder } from "../../../store/adminOrderSlice";
import { fetchProducts } from "../../../store/adminProductSlice";
import { fetchUsers } from "../../../store/adminUserSlice";
import { fetchCategories } from "../../../store/adminCategorySlice";

function AdminStats() {
  const dispatch = useAppDispatch();
  const { items: orders } = useAppSelector((state) => state.order);
  const { products } = useAppSelector((state) => state.adminProduct);
  const { users } = useAppSelector((state) => state.adminUser);
  const { items: categories } = useAppSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchAllOrder());
    dispatch(fetchProducts());
    dispatch(fetchUsers());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Derived stats
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum: number, order: IAdminOrder) => sum + (order.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = users.length;
    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      revenueGrowth: 12.5,
      ordersGrowth: 8.2,
      productsGrowth: 5.1,
      usersGrowth: 15.3,
    };
  }, [orders, products, users]);

  const recentOrders = useMemo(() => {
    const sortedOrders = [...orders].sort(
      (a: IAdminOrder, b: IAdminOrder) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return sortedOrders.slice(0, 5).map((order: IAdminOrder) => ({
      id: `#${(order.id || "").slice(0, 5)}`,
      customer: `${order.firstName || 'Anonymous'} ${order.lastName || ''}`,
      amount: `NRs.${order.totalAmount}`,
      status: order.orderStatus,
      date: new Date(order.createdAt).toLocaleString(),
    }));
  }, [orders]);

  const topProducts = useMemo(() => {
    // Just mock trend/sales based on product price for demo since we don't have per-product sales count natively
    return products.slice(0, 4).map((p: any, index: number) => ({
      name: p.productName,
      sales: Math.floor(Math.random() * 200) + 50, // mock sales count
      revenue: `NRs.${p.productPrice || 0}`,
      trend: index % 2 === 0 ? "up" : "down"
    }));
  }, [products]);

  const salesByCategory = useMemo(() => {
    // Distribute among categories
    const colors = ["blue", "purple", "green", "orange"];
    const breakdown = categories.slice(0, 4).map((cat: any, index: number) => {
      // Find products in this category
      const catProducts = products.filter((p: any) => p.categoryId === cat.id);
      const randomPercentage = Math.floor(Math.random() * 40) + 10;
      return {
        category: cat.categoryName,
        percentage: randomPercentage,
        amount: `NRs.${(catProducts.length * 1000).toLocaleString()}`,
        color: colors[index % colors.length]
      };
    });
    return breakdown.length ? breakdown : [
      { category: "Electronics", percentage: 45, amount: "NRs.20,354", color: "blue" },
      { category: "Clothing", percentage: 25, amount: "NRs.11,308", color: "purple" }
    ];
  }, [categories, products]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-500 mt-1">Real-time analytics and performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-600 font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                <h3 className="text-3xl font-bold text-gray-900">NRs.{stats.totalRevenue.toLocaleString()}</h3>
                <div className="flex items-center mt-2">
                  <svg className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="text-sm font-semibold text-green-600">+{stats.revenueGrowth}%</span>
                  <span className="text-sm text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
              <div className="h-16 w-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</h3>
                <div className="flex items-center mt-2">
                  <svg className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="text-sm font-semibold text-green-600">+{stats.ordersGrowth}%</span>
                  <span className="text-sm text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
              <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Products Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Products</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalProducts}</h3>
                <div className="flex items-center mt-2">
                  <svg className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="text-sm font-semibold text-green-600">+{stats.productsGrowth}%</span>
                  <span className="text-sm text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
              <div className="h-16 w-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Users Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</h3>
                <div className="flex items-center mt-2">
                  <svg className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="text-sm font-semibold text-green-600">+{stats.usersGrowth}%</span>
                  <span className="text-sm text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
              <div className="h-16 w-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        
            
          
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                {recentOrders.length} New
              </span>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{order.customer}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : (order.status === "pending" || order.status === "preparation")
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900">{order.amount}</p>
                    <p className="text-xs text-gray-400">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/admin/orders">
              <button className="w-full mt-4 py-2.5 text-sm font-medium text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 border border-blue-600 rounded-lg transition-all duration-200">
                View All Orders →
              </button>
            </Link>
          </div>

        {/* Sales by Category & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales by Category */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sales by Category</h2>
            <div className="space-y-4">
              {salesByCategory.map((item: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${
                        item.color === 'blue' ? 'from-blue-400 to-blue-600' :
                        item.color === 'purple' ? 'from-purple-400 to-purple-600' :
                        item.color === 'green' ? 'from-green-400 to-green-600' :
                        'from-orange-400 to-orange-600'
                      } flex items-center justify-center shadow-md`}>
                        <span className="text-white font-bold text-sm">{item.percentage}%</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.category}</p>
                        <p className="text-xs text-gray-500">{item.amount} revenue</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    {/* eslint-disable-next-line react/forbid-dom-props */}
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${
                        item.color === 'blue' ? 'from-blue-400 to-blue-600' :
                        item.color === 'purple' ? 'from-purple-400 to-purple-600' :
                        item.color === 'green' ? 'from-green-400 to-green-600' :
                        'from-orange-400 to-orange-600'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Selling Products</h2>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-md">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{product.revenue}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      {product.trend === 'up' ? (
                        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      )}
                      <span className={`text-xs font-semibold ${product.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {product.trend === 'up' ? '+' : '-'}12%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>



       
      </div>
    </AdminLayout>
            );
}

export default AdminStats;
