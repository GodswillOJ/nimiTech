import { BrowserRouter as Router, useLocation, useRoutes } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Navbar from './components/navbar';
import NotFound from './components/NotFound/NotFound';
import Blog from './pages/blog';
import BlogDetails from './pages/blog/BlogDetailsPage/BlogDetails/BlogDetails';
import BlogPostEditor from './pages/blogCMS/BlogPostEditor/BlogPostEditor';
import About from './pages/business/AboutPage';
import HomePage from './pages/business/home';
import BusinessRegisterPage from './pages/business/RegisterBusiness';
import Services from './pages/business/ServicesPage';
import { dashboardRoutes } from './routes/dashboardRoutes';
import ScrollToTop from './components/ScrollToTop';
import RegisterPage from './pages/business/RegisterBusiness';
import AuthPage from './pages/auth/AuthPage';

import './App.css';

// define other static routes
const baseRoutes = [
  { path: '/', element: <HomePage /> },
  { path: '/our-services', element: <Services /> },
  { path: '/about', element: <About /> },
  { path: '/blogs', element: <Blog /> },
  { path: '/blogs/:id', element: <BlogDetails /> },
  { path: '/blog-editor', element: <BlogPostEditor /> },
  { path: '/services', element: <BusinessRegisterPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/auth', element: <AuthPage /> },
  { path: '*', element: <NotFound /> },
];

function App() {
  return (
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
  );
}

function AppRoutes() {
  const routes = useRoutes([...baseRoutes, ...dashboardRoutes]);
  return routes;
}
// Component to conditionally render Footer
function ConditionalFooter() {
  const location = useLocation();

  // Don't show footer on homepage
  if (location.pathname === '/') {
    return null;
  }
  if (location.pathname.startsWith('/auth')) {
    return null;
  }
  return <Footer />;
}

function ConditionalNavbar() {
  const location = useLocation();

  // Don't show navbar on homepage
  if (location.pathname.startsWith('/auth')) {
    return null;
  }
  return <Navbar />;
}

export { App, AppRoutes, ConditionalFooter, ConditionalNavbar };
