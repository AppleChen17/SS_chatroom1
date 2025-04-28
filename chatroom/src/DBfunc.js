// 覺得以 chatroom 為主儲存在 database 的方式會比較清楚 ! => 所以調整一下 !

import { database } from "./config"; // 從 config.js 導入 auth
import { get, push, ref, set, update} from "firebase/database";

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


// create a brand new chatroom with NO users !!!
// need time => async !! (寫過不等的但是因為其他執行太快所以會有問題，等資料回來的時候function已經執行完)
const createChatroom = async (name) => {
    const chatroomRef = ref(database,`chatrooms`);
    // by this way (push!!!!!) => a UNIQUE KEY will be generated for each chatroom ! => easier to identify!
    const newroomRef = push(chatroomRef);

    // 可以再為了可 access 的人 => chatrooms/UNIQUEid/members
    await set(newroomRef, {
        name: name,
        Members: {}, // use [EMAIL] = true !
    });

    // CONTINUE USE THE UNIQUE KEY to add members !
    console.log("Chatroom created:", newroomRef.key);
    return newroomRef.key; // IMPORTANT !!!!! 把這個聊天室的 ID 傳回來 !!!
};

const addUserToChatroom = async (roomID, email) => {
    const roomMemRef = ref(database, `chatrooms/${roomID}/members`);
    await update(roomMemRef, {
        [encodeEmail(email)]: true, // use [EMAIL] = true !
        // 使用 true/false => 不會重複加到同一個人的問題 ! (反正就是一職 true!)
    });

    // /name 的方式不一定代表 folder, 可以是其中的一個 小節點 !!!!
    const roomNameRef = ref(database, `Chatroom/${roomID}/name`);
    const snapshot = await get(roomNameRef);
    const roomName = snapshot.exists() ? snapshot.val() : "(unknown)";

    console.log(`User ${email} added to chatroom ${roomName}`);
}

export { createChatroom, addUserToChatroom, encodeEmail};
export default checkUserExists;