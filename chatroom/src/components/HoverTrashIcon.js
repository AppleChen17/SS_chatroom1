import React, { useState } from 'react';

const HoverTrashIcon = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <img
        src={isHovered ? "/trash-hover.svg" : "/trash.svg"}
        alt="trash"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ width: "25px", height: "25px", cursor: "pointer" }}
      />
    );
};

export default HoverTrashIcon;