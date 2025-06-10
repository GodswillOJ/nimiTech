import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/business/home';
import Blog from './pages/blog';
import BlogDetails from './pages/blog/BlogDetailsPage/BlogDetails/BlogDetails';
import BlogPostEditor from './pages/blogCMS/BlogPostEditor/BlogPostEditor';
import Navbar from './components/navbar';
import Footer from './components/footer';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Router>
        <Navbar />
        <div className="app-content">
          <Routes>
            {/* all page routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            {/* temporary usecase for blog CMS routes */}
            <Route path="/blog-editor" element={<BlogPostEditor />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
