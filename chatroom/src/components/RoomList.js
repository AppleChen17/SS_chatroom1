import { useState, useEffect} from 'react';
import { auth,database } from "../config";
import { createChatroom,addUserToChatroom,encodeEmail } from "../DBfunc";
import { ref,onValue } from "firebase/database";
import { useRoom } from '../RoomContext'; // useRoom => get the room id ! (is a HOOK !!!)

// 對某個使用者而言，目前可以 access 到的 chatroom list !
// hint: 要用 onValue => 可以處理即時更新的資料庫資料 (firebase database) !
const RoomList = () => {
    //     const room = [
    //     { id: 1, name: 'General' },
    //     { id: 2, name: 'Technology' },
    //     { id: 3, name: 'Sports' },
    // ];
    const [rooms, setRooms] = useState([]); // 存儲聊天室列表
    const [showInput, setShowInput] = useState(false); 
    const [showInvite, setShowInvite] = useState(false); 
    const [newRoomName, setNewRoomName] = useState(""); 
    const [newInviteEmail, setNewInviteEmail] = useState(""); 

    // 渲染 UI 以外的事情 !
    useEffect(() => {
        const roomsRef = ref(database, "chatrooms");

        // 會即時監控但是也會回傳一個 "停止監控" 的 function !
        // onValue would update !! (callback 來執行)
        const unsubscribe = onValue(roomsRef, (snapshot) => {
            const chatrooms = snapshot.val() || {};
            const roomList = Object.entries(chatrooms).map(([id, data]) => ({
                id,
                name: data.name,
                members: data.members ? Object.keys(data.members) : [], // => array
            }));
    
            console.log("RoomList update = ", roomList);
            setRooms(roomList);
        });

        // cleanup function
        // may cause memory leak => when ROOMLIST is closed, it is trying to observe a 
        // unexisting object and sending back the result
        return () => unsubscribe();
    }, []); 

    useEffect(() => {
        console.log("Rooms update = ", rooms);
    }, [rooms]); // dependency is [rooms] array ! => if change then output

    const createRoom = async (name) => {
        try {
            const roomID = await createChatroom(name); 
            await addUserToChatroom(roomID, auth.currentUser.email); // 將當前用戶添加到聊天室
        }
        catch (error) {
            console.error("Create chatroom ERROR:", error);
        }
    };


    // const [selectedRoomId, setSelectedRoomId] = useState(null);// for the selected room id 
    const { selectedRoomId, setSelectedRoomId } = useRoom();

    const handleRoomClick = (id) => {
        console.log("roomid = ", id);
        setSelectedRoomId(id);
    };

    const handleCreateRoom = async(name) => {
        setShowInput(false);
        setNewRoomName("");
        if(name.trim() === "") {
            alert("Please enter a valid chatroom name !");
            return;
        }
        await createRoom(newRoomName);
    }

    const handleInvite = async (roomId, email) => {
        setShowInvite(false);
        setNewInviteEmail("");
        if(email.trim() === "") 
        {
            alert("Please enter a valid email !");
            return;
        }
        try {
            const result = await addUserToChatroom(roomId, email);
            if (result === true) {
              alert(`Invited ${email} to room successfully!`);
            } 
            else {
              alert(`Failed to invite ${email}. Reason: ${result}`);
            }
          } 
          catch (error) {
            alert(`Error inviting user: ${error.message}`);
          }
       
        // console.log("Invite user to room = ", roomId, email);
    }

    return (
        <div className='RoomList'>
            <div 
                className='func-btns'
                style={{ display: "flex", flexDirection: "column"}}
            >
                {/* default row flex */}
                <div
                    style={{ display: "flex", alignItems:"center", justifyContent:"center", flexWrap: "wrap"}}>
                    <h5 style={{width:"100%"}}>Functions</h5>
                    <button 
                        className='func-btn' 
                        onClick={() => setShowInput(true)}
                        style={{ margin: "10px 10px", 
                            width:"100%", 
                            height: "40px", 
                            backgroundColor: "#FAEBD7", 
                            color: "black", 
                            borderRadius: "5px", 
                            border: "none", 
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontFamily: "Lexend Deca",
                            // fontWeight: "bold",
                        }}
                    >
                            Add Chatroom 
                    </button> 
                    {/* input = prompt("user email") */}
                    {/* 顯示輸入框 */}
                    {showInput && (
                        <div 
                            className='input-area'
                            style={{display: "inline"}}
                        >
                            <input
                                type="text"
                                placeholder="Enter chatroom name"
                                value={newRoomName}
                                onChange={(e) => setNewRoomName(e.target.value)}
                                style={{display: "inline", fontSize: "0.7rem", marginRight:"3px"}}
                            />
                            <button 
                                onClick={async () => handleCreateRoom(newRoomName)}
                                style={{backgroundColor:"#F4D4AA",padding:"2px 5px",margin:"2px 2px",
                                    borderRadius:"10px", border:"none",fontFamily: "Lexend Deca",fontSize:"0.7rem",
                                }}
                            >
                                    Create
                            </button>
                            <button 
                                onClick={() => setShowInput(false)}
                                style={{backgroundColor:"#F4D4AA",padding:"2px 5px",margin:"2px 2px",
                                     borderRadius:"10px", border:"none",fontFamily: "Lexend Deca",fontSize:"0.7rem"}}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>


                <div style={{ display: "flex", alignItems:"center", justifyContent:"center", flexWrap: "wrap"}}>
                    <button 
                        className='func-btn' 
                        onClick={() => setShowInvite(true)}
                        style={{ margin: "10px 10px", 
                            // width:"150px", 
                            width: "100%",
                            height: "40px", 
                            backgroundColor: "#FAEBD7", 
                            color: "black", 
                            borderRadius: "5px", 
                            border: "none", 
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontFamily: "Lexend Deca",
                        }}
                    >
                        Invite user
                    </button>

                    {/* 顯示輸入框 */}
                    {selectedRoomId && showInvite && (
                        <div className='input-area' style={{display: "inline"}}>
                            <input
                                type="email"
                                placeholder="Enter email to invite"
                                value={newInviteEmail}
                                onChange={(e) => setNewInviteEmail(e.target.value)}
                                style={{display: "inline", fontSize: "0.7rem", marginRight:"5px"}}
                            />
                            <button 
                                onClick={() => handleInvite(selectedRoomId,newInviteEmail)}
                                style={{backgroundColor:"#F4D4AA",padding:"2px 5px",margin:"2px 2px",
                                    borderRadius:"10px", border:"none",fontFamily: "Lexend Deca",fontSize:"0.7rem"}}
                            >
                                Invite
                            </button>

                            <button 
                                onClick={() => setShowInvite(false)}
                                style={{backgroundColor:"#F4D4AA",padding:"2px 5px",margin:"2px 2px",
                                    borderRadius:"10px", border:"none",fontFamily: "Lexend Deca",fontSize:"0.7rem"}}
                            >
                                    Cancel
                            </button>
                        </div>
                    )}
                </div>

            </div>


            {/* render list */}
            <div className="room-list" >
                {/* {rooms.map((room) => (
                    <button key={room.id} className="room-list-item" onClick={() => handleRoomClick(room.id)}>
                        <h2>{room.name}</h2>
                    </button>
                ))} */}
                <h5 style={{width:"95%"}}>Your Rooms</h5>

                {auth.currentUser &&                 
                <div style={{overflowY: "scroll", maxHeight: "225px"}}>
                    {rooms.filter((room) => room.members.includes(encodeEmail(auth.currentUser.email)))
                        .map((room) => (
                            // <button
                            //     key={room.id}
                            //     className="room-list-item"
                            //     // !!! IMPORTANT !!! 把這個 onclick 掛在這裡可以取得他的 room.id!!!!!!
                            //     onClick={() => handleRoomClick(room.id)}
                            // >
                            //     <h4>{room.name}</h4>
                            // </button>
                            <button
                                key={room.id}
                                className={`room-list-item ${selectedRoomId === room.id ? 'active-room' : ''}`}
                                onClick={() => handleRoomClick(room.id)}
                            >
                                <h6>{room.name}</h6>
                            </button>
                        ))}
                </div>}


            </div>

            {/* <div style={{height:"300px"}}>hi</div> */}
        </div>
    );
};

// };
    // return (
    //     room.map((r)=>{
    //         return (
    //             // for REACT easier to know which item is which !!! (easier to identify and modify)
    //             <div 
    //             key={r.id} 
    //             className="room-list-item"
    //             style={{
    //                 // textAlign: "left",
    //                 width: "85vw",
    //                 height: "50px",
    //                 margin: "10px 20px",
    //                 padding: "0.2rem 1rem",
    //                 border: "1px solid black",
    //                 borderRadius: "20px",
    //                 boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
    //                 backgroundColor: "#f5f5f5",
    //             }}
    //             >
    //                 <h2>{r.name}</h2>
    //             </div>
    //         )
    //     })
    // );
// };

export default RoomList;
// export default selectedRoomId;

// export { RoomList,selectedRoomId };