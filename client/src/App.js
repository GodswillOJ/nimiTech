import { BrowserRouter as Router, useRoutes, useLocation } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/navbar';
import Footer from './components/Footer/Footer';
import Newsletter from './components/blog/Modal/NewsLetter/Newsletter';
import Loader from './components/blog/SuspenseLoader/Loader';
import { ToastProvider } from './hooks/useToast';

import './App.css';

// Lazy load components to improve initial bundle size
const HomePage = lazy(() => import('./pages/business/home'));
const Blog = lazy(() => import('./pages/blog'));
const BlogDetails = lazy(() => import('./pages/blog/BlogDetailsPage/BlogDetails/BlogDetails'));
const BlogPostEditor = lazy(() => import('./pages/blogCMS/BlogPostEditor/BlogPostEditor'));
const About = lazy(() => import('./pages/business/AboutPage'));
const BusinessRegisterPage = lazy(() => import('./pages/business/RegisterBusiness'));
const Services = lazy(() => import('./pages/business/ServicesPage'));
const ContactUs = lazy(() => import('./pages/business/ContactUs'));
const RegisterPage = lazy(() => import('./pages/business/RegisterBusiness'));
const AuthPage = lazy(() => import('./pages/auth/AuthPage'));
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword/ForgotPassword'));
const VerifyOTP = lazy(() => import('./components/Auth/VerifyOTP/VerifyOTP'));
const ResetPassword = lazy(() => import('./components/Auth/ResetPassword/ResetPassword'));
const NotFound = lazy(() => import('./components/NotFound/NotFound'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserDashboard = lazy(() => import('./pages/dashboard/UserDashboard'));
const PrivacyPolicyPage = lazy(() => import('./pages/business/PrivacyPolicy'));

// define other static routes
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
  { path: '/register', element: <RegisterPage /> },
  { path: '/auth', element: <AuthPage /> },
  { path: '/auth/forgot-password', element: <ForgotPassword /> },
  { path: '/auth/verify-otp', element: <VerifyOTP /> },
  { path: '/auth/reset-password', element: <ResetPassword /> },
  { path: '/dashboard/*', element: <UserDashboard /> },
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
  return <Suspense fallback={<Loader />}>{routes}</Suspense>;
}

function ConditionalNavbar() {
  const location = useLocation();

  // Don't show navbar on homepage, auth pages, or admin pages
  if (location.pathname.startsWith('/auth') || location.pathname.startsWith('/auth')) {
    return null;
  }
  return <Navbar />;
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

export { App, AppRoutes, ConditionalFooter, ConditionalNavbar };
