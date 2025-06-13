import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { dashboardRoutes } from './routes/dashboardRoutes';
import HomePage from './pages/business/home';
import Blog from './pages/blog';
import BlogDetails from './pages/blog/BlogDetailsPage/BlogDetails/BlogDetails';
import BlogPostEditor from './pages/blogCMS/BlogPostEditor/BlogPostEditor';
import NotFound from './components/NotFound/NotFound';
import RegisterPage from './pages/business/RegisterBusiness';
import Navbar from './components/navbar';
import Footer from './components/footer';
import './App.css';

// define other static routes
const baseRoutes = [
  { path: '/', element: <HomePage /> },
  { path: '/blogs', element: <Blog /> },
  { path: '/blogs/:id', element: <BlogDetails /> },
  { path: '/blog-editor', element: <BlogPostEditor /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '*', element: <NotFound /> },
];

function AppRoutes() {
  const routes = useRoutes([...baseRoutes, ...dashboardRoutes]);
  return routes;
}

function App() {
  return (
    <div className="app-container">
      <Router>
        <Navbar />
        <div className="app-content">
          <AppRoutes />
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
