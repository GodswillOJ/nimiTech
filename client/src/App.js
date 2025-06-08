import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home.js';
import Navbar from './components/navbar.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        {/* all page routes */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
