import { database } from "./config"; // 從 config.js 導入 auth
import { get, ref, set, update} from "firebase/database";

const isValidChar = (char) => {
    const code = char.charCodeAt(0);
    return (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || (code >= 48 && code <= 57);
}

const encodeEmail = (email) => {
    let encodedEmail = "";
    for (let i = 0; i < email.length; i++) {
        if(isValidChar(email[i])) {
            encodedEmail += email[i];
        }
        else encodedEmail += "_";
    }

    return encodedEmail;
}

const checkUserExists = async (email) => {
    console.log("check user exists !",email);
    const userRef = ref(database, `users/${encodeEmail(email)}`);

    try {
        const find = await get(userRef);
        if (find.exists()) {
            console.log("User exist = ",find.val());
            return true;
        } 
        else {
            console.log("User Not exist !");
            return false;
        }
    } 
    catch (error) {
        console.error("Error checking user existence:", error);
        return false;
    }
}

// const checkChatroomExists = async (name) => {
//     console.log("check chatroom exists !",name);

// }


const addUser = async (email) => {
    const exists = await checkUserExists(email);
    // have already !
    if (exists) return; 

    console.log("add user !", email);
    const ENemail = encodeEmail(email);
    // 以 email 為主 key ，創建新資料 (因為是獨一無二的 !!!)
    const userRef = ref(database, `users/${ENemail}`);
    await set(userRef, {
        email: email,
        chatrooms: [0],
    });

    await addChatroom("General"); // add a default chatroom for the user !
    await init_Chatroom(email); // add user to the default chatroom !
    console.log("add user to chatroom 0 !", email);
}

const init_Chatroom = async (email) => {
    console.log("init chatroom!", email);
    const ENemail = encodeEmail(email);
    const roomRef = ref(database, `Chatroom/0/Members`);
    await update(roomRef, {
        [ENemail]: true 
    });
};

// create a brand new chatroom with NO users !!!
const addChatroom = async (name) => {
    try {
        const chatroomsRef = ref(database, "Chatroom");
        const snapshot = await get(chatroomsRef);
        const chatrooms = snapshot.val() || {};
        const chatroomIds = Object.keys(chatrooms);

        const exists = chatroomIds.some((id) => chatrooms[id].name === name);
        if (exists) {
            console.log("Chatroom already exists:", name);
            return;
        }

        // add new one!
        const newChatroomId = chatroomIds.length; // number of the chatrooms => ID !
        const roomRef = ref(database, `Chatroom/${newChatroomId}`);
        await set(roomRef, {
            name: name,
        });
        console.log("add Chatroom", newChatroomId);
    } 
    catch (error) {
        console.error("Error adding chatroom:", error);
    }
};

const addUserToChatroom = async (email,name) => {
    const chatroomsRef = ref(database, "Chatroom");
    const snapshot = await get(chatroomsRef);
    const chatrooms = snapshot.val() || {};
    const chatroomId = Object.keys(chatrooms);

    let id;
    for (let i = 0; i < chatroomId.length; i++) {
        if (chatrooms[chatroomId[i]].name === name) {
            id = chatroomId[i];
            break;
        }
    }

    const ENemail = encodeEmail(email);
    // console.log("now chatroom num ", chatroomId.length);
    const roomMemRef = ref(database, `Chatroom/${id}/Members`);
    const snapshot2 = await get(roomMemRef);
    console.log("roomMembers",snapshot2.val());
    await update(roomMemRef, {
        [ENemail]: true  // 或其他你想保存的值
    });

    const userRef = ref(database, "users/" + ENemail + "/chatrooms");
    const snapshot3 = await get(userRef);
    // const chatroomsArray = snapshot3.val() || [];
    console.log(`${ENemail} added to chatroom ${id}`);
}

const getUserChatrooms = async (email) => {
    const ENemail = encodeEmail(email);
    const userRef = ref(database, `users/${ENemail}/chatrooms`);
    try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            console.log("User chatrooms:", snapshot.val());
            return snapshot.val(); // return "chatrooms" array !!!
        } else {
            console.log("No chatrooms found");
            return [];
        }
    } catch (error) {
        console.error("Error fetching chatrooms:", error);
        return [];
    }
};

const getChatroomNameById = async (chatroomId) => {
    const chatroomRef = ref(database, `Chatroom/${chatroomId}`);
    try {
        const snapshot = await get(chatroomRef);
        if (snapshot.exists()) {
            console.log(`Chatroom ${chatroomId} data:`, snapshot.val());
            return snapshot.val(); // 返回該聊天室的資料
        } 
        else {
            console.log(`Chatroom ${chatroomId} does not exist.`);
            return null;
        }
    } 
    catch (error) {
        console.error(`Error fetching chatroom ${chatroomId}:`, error);
        return null;
    }
};

export { addUser, addChatroom, addUserToChatroom,getUserChatrooms,getChatroomNameById };
export default checkUserExists;