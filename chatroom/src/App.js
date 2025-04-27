import React from 'react';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
// import Home from './pages/Home';
import './styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* root be Home page !!! */}
        {/* <Route path="/" element={<Home/>} /> */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App
