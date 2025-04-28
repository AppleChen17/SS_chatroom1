import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
// import Home from './pages/Home';
import './styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chatroom from './pages/Chatroom';
import Login from './pages/Login';


function App() {
  // return (
  //   <>
  //     <Navbar />
      
  //     <Routes>
  //       {/* root be Home page !!! */}
  //       {/* <Route path="/home" element={<Home />} /> */}
  //       <Route path="/profile" element={<Profile />} />
  //       <Route path="/chatroom" element={<Chatroom />} />
  //       <Route path="/" element={<Login />} />
  //     </Routes>
  //   </>
  // );

  const location = useLocation(); // get "router" location !

  return (
    <>
      {/* Nabar would only appear in "pages" rather than "LOGIN"!! */}
      {location.pathname !== "/" && <Navbar />}
      
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/chatroom" element={<Chatroom />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  );
}

export default App
