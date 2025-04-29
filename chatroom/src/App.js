import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
// import Home from './pages/Home';
import './styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chatroom from './pages/Chatroom';
import Login from './pages/Login';
// import { RoomProvider } from './RoomContext'; 
import ChatInput from './components/ChatInput';
import RoomList from './components/RoomList';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config";
import { useRoom } from "./RoomContext";


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
      {/* <RoomProvider> */}
        {location.pathname !== "/" && <Navbar />}
      
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/chatroom" element={<Chatroom />} />
          <Route path="/chatinput" element={<ChatInput />} />
          <Route path="/roomlist" element={<RoomList />} />
          <Route path="/app" element={<App />} />
          <Route path="/" element={<Login />} />
        </Routes>
      {/* </RoomProvider> */}
    </>
  );
}

export default App
