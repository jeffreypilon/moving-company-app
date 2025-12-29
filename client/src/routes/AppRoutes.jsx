import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardPage from '../pages/DashboardPage';
import AddServicePage from '../pages/AddServicePage';
import ContactsPage from '../pages/ContactsPage';
import ServicesPage from '../pages/ServicesPage';
import PricesPage from '../pages/PricesPage';
import QuickQuotePage from '../pages/QuickQuotePage';
import ViewServicePage from '../pages/ViewServicePage';
import ViewUsersPage from '../pages/ViewUsersPage';
import ViewMessagePage from '../pages/ViewMessagePage';
import ViewQuotePage from '../pages/ViewQuotePage';
import ViewOrdersPage from '../pages/ViewOrdersPage';
import RequestServicePage from '../pages/RequestServicePage';
import NewInquiryPage from '../pages/NewInquiryPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Home Route */}
      <Route path="/" element={<HomePage />} />
      
      {/* Public Routes */}
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/prices" element={<PricesPage />} />
      <Route path="/quick-quote" element={<QuickQuotePage />} />
      
      {/* Login Route */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <LoginPage />
        } 
      />

      {/* Signup Route */}
      <Route 
        path="/signup" 
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <SignupPage />
        } 
      />
      
      {/* Dashboard Route - Protected */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes - Protected */}
      <Route 
        path="/add-service" 
        element={
          <ProtectedRoute>
            <AddServicePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/view-service" 
        element={
          <ProtectedRoute>
            <ViewServicePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/view-users" 
        element={
          <ProtectedRoute>
            <ViewUsersPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/view-message" 
        element={
          <ProtectedRoute>
            <ViewMessagePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/view-quote" 
        element={
          <ProtectedRoute>
            <ViewQuotePage />
          </ProtectedRoute>
        } 
      />
      
      {/* Customer Routes - Protected */}
      <Route 
        path="/request-service" 
        element={
          <ProtectedRoute>
            <RequestServicePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/new-inquiry" 
        element={
          <ProtectedRoute>
            <NewInquiryPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Common Protected Routes */}
      <Route 
        path="/view-orders" 
        element={
          <ProtectedRoute>
            <ViewOrdersPage />
          </ProtectedRoute>
        } 
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
