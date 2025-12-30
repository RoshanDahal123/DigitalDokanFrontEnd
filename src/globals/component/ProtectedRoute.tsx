import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hook";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const reduxToken = useAppSelector((store) => store.auth.user.token);
  const localStorageToken = localStorage.getItem("token");
  const localStorageAdminToken = localStorage.getItem("adminToken");

  const isLoggedIn = !!(reduxToken || localStorageToken || localStorageAdminToken);
  const isAdmin = !!(localStorageAdminToken && (reduxToken === localStorageAdminToken || !reduxToken));

  if (!isLoggedIn) {
    // Redirect to products page for regular users, login for admin routes
    return <Navigate to={requireAdmin ? "/login" : "/products"} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
