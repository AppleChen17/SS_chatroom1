// import React, { useState, useRef, useEffect } from 'react';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';


const Navbar = () => {
  // const [Menu, setOpenMenu] = useState(false);
  // // can catch DOM value !!
  // const menuRef = useRef();
  const navigate = useNavigate();
  const user = "128362786349827423896yhello@gmail.com";
  // const toggleMenu = () => {
  //   setOpenMenu(!Menu);
  // };

  //  => click outside can also close the menu
  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (menuRef.current && (!menuRef.current.contains(e.target))) {
  //       // close it !!!
  //       setOpenMenu(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  return (
    <nav>
      <div className='title'>
        <h1># include &lt; chatroom &gt;</h1>
      </div>

      <div className="profile-area">

        {/* <button>
          <img className='bell' src="/bell-solid.svg" alt="notification" />
        </button> */}

        {/* <button onClick={toggleMenu}>
          <img src="/user-3296.svg" alt="photo" />
        </button> */}

      <Dropdown className = "profile">
        <Dropdown.Toggle id="dropdown-basic">
          {/*  variant="success" => 原本上面好像會造成綠色背景的 toggle 特效 */}
          <img src="/user-3296.svg" alt="photo" />
          {/* <img src="../../public/user-3296.svg" alt="user" /> */}
          <h5>{user}</h5>
        </Dropdown.Toggle>

        <Dropdown.Menu >
        <Dropdown.Item
          className="drop-item"
          onClick={() => navigate('/')} // 跳轉到 /profile
        >
          Home
        </Dropdown.Item>
        <Dropdown.Item
          className="drop-item"
          onClick={() => navigate('/profile')} // 跳轉到 /profile
        >
          View Profile
        </Dropdown.Item>

          <Dropdown.Item className = "drop-item">Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

        {/* if Menu open => then would return this part !!! 
        {Menu && (
          <div className="popup-menu" ref={menuRef}>
            <ul>
              <li>View Profile</li>
              <li>Logout</li>
            </ul>
          </div>
        )} */}
      </div>
    </nav>
  );
};

export default Navbar;