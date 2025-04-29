import React, { createContext, useState, useContext } from "react";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  return (
    <RoomContext.Provider value={{ selectedRoomId, setSelectedRoomId }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);
