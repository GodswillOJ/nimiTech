import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation, useRoutes } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop';
import Newsletter from './components/blog/Modal/NewsLetter/Newsletter';
import Loader from './components/blog/SuspenseLoader/Loader';
import ProtectedRoute from './components/business/protectedRoute/protectedRoute';
import Navbar from './components/navbar';
import { ToastProvider } from './hooks/useToast';
import ChatWidget from './components/Chat/ChatWidget';

import './App.css';

import HomePage from './pages/business/home';
import Blog from './pages/blog';
import BlogDetails from './pages/blog/BlogDetailsPage/BlogDetails/BlogDetails';
import BlogPostEditor from './pages/blogCMS/BlogPostEditor/BlogPostEditor';
import About from './pages/business/AboutPage';
import BusinessRegisterPage from './pages/business/RegisterBusiness';
import Services from './pages/business/ServicesPage';
import ContactUs from './pages/business/ContactUs';
import Success from './pages/business/success';
import RegisterPage from './pages/business/RegisterBusiness';
import AuthPage from './pages/auth/AuthPage';
import ForgotPassword from './components/Auth/ForgotPassword/ForgotPassword';
import VerifyOTP from './components/Auth/VerifyOTP/VerifyOTP';
import ResetPassword from './components/Auth/ResetPassword/ResetPassword';
import NotFound from './components/NotFound/NotFound';
import AdminDashboard from './pages/admin/AdminDashboard';
import PrivacyPolicyPage from './pages/business/PrivacyPolicy';

const UserDashboard = lazy(() => import('./pages/dashboard/UserDashboard'));
const baseRoutes = [
  { path: '/', element: <HomePage /> },
  { path: '/our-services', element: <Services /> },
  { path: '/about', element: <About /> },
  { path: '/blogs', element: <Blog /> },
  { path: '/blogs/:id', element: <BlogDetails /> },
  { path: '/blog-editor', element: <BlogPostEditor /> },
  { path: '/blog-editor/:id', element: <BlogPostEditor /> },
  { path: '/privacy-policy', element: <PrivacyPolicyPage /> },
  { path: '/services', element: <BusinessRegisterPage /> },
  { path: '/contact-us', element: <ContactUs /> },
  {
    path: '/success',
    element: (
      <ProtectedRoute>
        <Success />
      </ProtectedRoute>
    ),
  },
  { path: '/register', element: <RegisterPage /> },
  { path: '/auth', element: <AuthPage /> },
  { path: '/auth/forgot-password', element: <ForgotPassword /> },
  { path: '/auth/verify-otp', element: <VerifyOTP /> },
  { path: '/auth/reset-password', element: <ResetPassword /> },
  {
    path: '/dashboard/*',
    element: (
      <Suspense fallback={<Loader />}>
        <UserDashboard />
      </Suspense>
    ),
  },
  { path: '/admin/*', element: <AdminDashboard /> },
  { path: '*', element: <NotFound /> },
];

function App() {
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  useEffect(() => {
    const handleOpenNewsletterModal = () => {
      setShowNewsletterModal(true);
    };

    // Listen for the custom event dispatched by the Footer
    window.addEventListener('openNewsletterModal', handleOpenNewsletterModal);

    return () => {
      window.removeEventListener('openNewsletterModal', handleOpenNewsletterModal);
    };
  }, []);

  return (
    <ToastProvider>
      <div className="app-container">
        <Router>
          <Navbar />
          <ScrollToTop />
          <ConditionalNavbar />
          <div className="app-content">
            <AppRoutes />
          </div>
          <ConditionalFooter />

          {/* AI Chat Widget - Available on all pages */}
          <ConditionalChatWidget />

          {/* Global Newsletter Modal */}
          <Newsletter
            isOpen={showNewsletterModal}
            onClose={() => setShowNewsletterModal(false)}
            onSuccess={() => {
              // Optional: Handle success callback
              console.log('Newsletter subscription successful');
            }}
            onDismiss={() => {
              // Optional: Handle dismiss callback
              console.log('Newsletter modal dismissed');
            }}
          />
        </Router>
      </div>
    </ToastProvider>
  );
}

function AppRoutes() {
  const routes = useRoutes([...baseRoutes]);
  return routes;
}

function ConditionalNavbar() {
  const location = useLocation();

  // Don't show navbar on homepage, auth pages, or admin pages
  if (location.pathname.startsWith('/auth') || location.pathname.startsWith('/auth')) {
    return null;
  }
  return <Navbar />;
}

function ConditionalChatWidget() {
  const location = useLocation();

  // Show chat widget on all pages except admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <ChatWidget
      config={{
        apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:10000',
        position: 'bottom-right',
      }}
    />
  );
}

function ConditionalFooter() {
  const location = useLocation();

  // Don't show footer on homepage, admin pages, auth pages, or dashboard pages
  if (
    location.pathname === '/' ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/auth') ||
    location.pathname.startsWith('/dashboard')
  ) {
    return null;
  }
  return <Footer />;
}

export { App, AppRoutes, ConditionalFooter, ConditionalNavbar, ConditionalChatWidget };
