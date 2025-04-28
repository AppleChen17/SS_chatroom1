import { useState, useEffect} from 'react';
import { auth,database } from "../config";
import { createChatroom,addUserToChatroom,encodeEmail } from "../DBfunc";
import { ref,onValue } from "firebase/database";

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
            setShowInput(false);
            setNewRoomName("");
        } 
        catch (error) {
            console.error("Create chatroom ERROR:", error);
        }
    };


    const [selectedRoomId, setSelectedRoomId] = useState(null);// for the selected room id 

    const handleRoomClick = (id) => {
        console.log("roomid = ", id);
        setSelectedRoomId(id);
    };

    return (
        <div>
            <button onClick={() => setShowInput(true)}>Add Chatroom</button>

            {/* 顯示輸入框 */}
            {showInput && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter chatroom name"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                    />
                    <button onClick={async () => createRoom(newRoomName)}>Create</button>
                    <button onClick={() => setShowInput(false)}>Cancel</button>
                </div>
            )}
            <button onClick={() => setShowInvite(true)}>Invite user</button>

            {/* 顯示輸入框 */}
            {selectedRoomId && showInvite && (
                <div>
                    <input
                        type="email"
                        placeholder="Enter email to invite"
                        value={newInviteEmail}
                        onChange={(e) => setNewInviteEmail(e.target.value)}
                    />
                    <button onClick={() => addUserToChatroom(selectedRoomId,newInviteEmail)}>Invite</button>
                    <button onClick={() => setShowInvite(false)}>Cancel</button>
                </div>
            )}

            {/* render list */}
            <div>
                {/* {rooms.map((room) => (
                    <button key={room.id} className="room-list-item" onClick={() => handleRoomClick(room.id)}>
                        <h2>{room.name}</h2>
                    </button>
                ))} */}

                {rooms.filter((room) => room.members.includes(encodeEmail(auth.currentUser.email)))
                    .map((room) => (
                        <button
                            key={room.id}
                            className="room-list-item"
                            // !!! IMPORTANT !!! 把這個 onclick 掛在這裡可以取得他的 room.id!!!!!!
                            onClick={() => handleRoomClick(room.id)}
                        >
                            <h2>{room.name}</h2>
                        </button>
        ))}
            </div>
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