import { useState, useEffect, useCallback } from 'react';
import { auth,database } from "../config";
import { getUserChatrooms,getChatroomNameById } from "../DBfunc";
import { ref,onValue } from "firebase/database";

// 對某個使用者而言，目前可以 access 到的 chatroom list !
// hint: 要用 onVal => 可以處理即時更新的資料庫資料 (firebase database) !
const RoomList = () => {
    const [rooms, setRooms] = useState([]); // 存儲聊天室 ID
    const [roomNames, setRoomNames] = useState([]); // 存儲聊天室名稱

    // 獲取聊天室名稱的函數
    const getRoomNames = useCallback(async () => {
        const roomNames = await Promise.all(
            rooms.map(async (r) => {
                const chatroomName = await getChatroomNameById(r);
                return chatroomName.name;
            })
        );
        return roomNames;
    }, [rooms]);

    // 獲取聊天室 ID
    useEffect(() => {
        const getRooms = async () => {
            const email = auth.currentUser.email;
            try {
                const fetchedRooms = await getUserChatrooms(email);
                setRooms(fetchedRooms); // 更新聊天室 ID
            } catch (error) {
                console.error("Error fetching chatrooms:", error);
            }
        };

        getRooms();
    }, []);

    // 即時監聽聊天室變化
    useEffect(() => {
        const chatroomsRef = ref(database, "Chatroom");
        const unsubscribe = onValue(chatroomsRef, (snapshot) => {
            const chatrooms = snapshot.val() || {};
            const roomIds = Object.keys(chatrooms);
            const roomNames = roomIds.map((id) => chatrooms[id].name);

            setRooms(roomIds); // 更新聊天室 ID
            setRoomNames(roomNames); // 更新聊天室名稱
        });

        // 清理監聽器
        return () => unsubscribe();
    }, []);

    // 獲取聊天室名稱
    useEffect(() => {
        if (rooms.length > 0) {
            getRoomNames().then((names) => {
                console.log("Chatroom Names:", names);
                setRoomNames(names); // 更新聊天室名稱
            });
        }
    }, [rooms, getRoomNames]);

    // 渲染聊天室名稱
    return (
        <div>
            {roomNames.length > 0 ? (
                roomNames.map((name, index) => (
                    <div key={index} className="room-list-item">
                        <h2>{name}</h2>
                    </div>
                ))
            ) : (
                <p>Loading chatrooms...</p>
            )}
        </div>
    );
};
// const RoomList = () => {

//     // const room = [
//     //     { id: 1, name: 'General' },
//     //     { id: 2, name: 'Technology' },
//     //     { id: 3, name: 'Sports' },
//     // ];

//     const [rooms, setRooms] = useState([]);

//     useEffect(() => {
//         const getRooms = async () => {
//             const email = auth.currentUser.email;
//             try {
//                 const fetchedRooms = await getUserChatrooms(email); // 等待非同步操作完成
//                 setRooms(fetchedRooms); // 更新狀態
//             } catch (error) {
//                 console.error("Error fetching chatrooms:", error);
//             }
//         };

//         getRooms();
//     }, []);

//     rooms.map(async (r) => {
//         const chatroomName = await getChatroomNameById(r); // 獲取聊天室名稱
//         console.log("chatroomName", chatroomName.name); // 確認名稱是否正確
//         console.log("r",r); // 確認聊天室 ID 是否正確
//         return <h3 key={r}>{chatroomName.name}</h3>; // 使用 key 屬性
//     });

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