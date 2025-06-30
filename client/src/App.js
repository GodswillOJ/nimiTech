import { BrowserRouter as Router, useRoutes, useLocation } from 'react-router-dom';
import { dashboardRoutes } from './routes/dashboardRoutes';
import HomePage from './pages/business/home';
import Blog from './pages/blog';
import BlogDetails from './pages/blog/BlogDetailsPage/BlogDetails/BlogDetails';
import BlogPostEditor from './pages/blogCMS/BlogPostEditor/BlogPostEditor';
import About from './pages/business/AboutPage';
import BusinessRegisterPage from './pages/business/RegisterBusiness';
import Services from './pages/business/ServicesPage';
import ContactUs from './pages/business/ContactUs';
import ScrollToTop from './components/ScrollToTop';
import RegisterPage from './pages/business/RegisterBusiness';
import AuthPage from './pages/auth/AuthPage';
import NotFound from './components/NotFound/NotFound';
import Navbar from './components/navbar';
import Footer from './components/Footer/Footer';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/dashboard/UserDashboard';
import { ToastProvider } from './hooks/useToast';

import './App.css';
import PrivacyPolicyPage from './pages/business/PrivacyPolicy';

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
  // { path: '/auth', element: <AdminAuth /> },
  { path: '/auth', element: <AuthPage /> },
  { path: '/dashboard/*', element: <UserDashboard /> },
  { path: '/admin/*', element: <AdminDashboard /> },
  { path: '*', element: <NotFound /> },
];

function App() {
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
