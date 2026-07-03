import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';

// Public pages
import HomePage from './pages/public/HomePage';
import AllProductsPage from './pages/public/AllProductsPage';
import CategoryPage from './pages/public/CategoryPage';
import ProductDetailsPage from './pages/public/ProductDetailsPage';
import SearchResultsPage from './pages/public/SearchResultsPage';
import CartPage from './pages/public/CartPage';
import WishlistPage from './pages/public/WishlistPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import FaqPage from './pages/public/FaqPage';
import CheckoutPage from './pages/public/CheckoutPage';
import OrderSuccessPage from './pages/public/OrderSuccessPage';
import NotFoundPage from './pages/public/NotFoundPage';

// User dashboard
import ProfilePage from './pages/user/ProfilePage';
import EditProfilePage from './pages/user/EditProfilePage';
import MyOrdersPage from './pages/user/MyOrdersPage';
import OrderDetailsPage from './pages/user/OrderDetailsPage';
import ChangePasswordPage from './pages/user/ChangePasswordPage';

// Admin dashboard
import DashboardPage from './pages/admin/DashboardPage';
import ManageProductsPage from './pages/admin/ManageProductsPage';
import AddProductPage from './pages/admin/AddProductPage';
import EditProductPage from './pages/admin/EditProductPage';
import ManageCategoriesPage from './pages/admin/ManageCategoriesPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageOrdersPage from './pages/admin/ManageOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <AllProductsPage /> },
      { path: 'category/:slug', element: <CategoryPage /> },
      { path: 'product/:id', element: <ProductDetailsPage /> },
      { path: 'search', element: <SearchResultsPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'faq', element: <FaqPage /> },
      // Protected user routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'order-success/:id', element: <OrderSuccessPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'profile/edit', element: <EditProfilePage /> },
          { path: 'my-orders', element: <MyOrdersPage /> },
          { path: 'order/:id', element: <OrderDetailsPage /> },
          { path: 'change-password', element: <ChangePasswordPage /> },
        ],
      },
    ],
  },
  // Admin routes with separate layout
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'products', element: <ManageProductsPage /> },
          { path: 'products/add', element: <AddProductPage /> },
          { path: 'products/edit/:id', element: <EditProductPage /> },
          { path: 'categories', element: <ManageCategoriesPage /> },
          { path: 'users', element: <ManageUsersPage /> },
          { path: 'orders', element: <ManageOrdersPage /> },
          { path: 'orders/:id', element: <AdminOrderDetailPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
