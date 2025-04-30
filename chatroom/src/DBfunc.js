// 覺得以 chatroom 為主儲存在 database 的方式會比較清楚 ! => 所以調整一下 !

import { auth, database } from "./config"; 
import { get, push, ref, set, update, remove} from "firebase/database";
import { updateProfile,updateEmail } from "firebase/auth";

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
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            console.log("User exists:", snapshot.val());
            return true;
        } 
        else {
            console.log("User does not exist.");
            return false;
        }
    } catch (error) {
        console.error("Error checking user existence:", error);
        return false;
    }
}

const createUser = async (email) => {
    const result = await checkUserExists(email);
    if(result) 
    {
        console.log("user already exists !",email);
        // already exist
        return;
    }
    const ENemail = encodeEmail(email);
    const userRef = ref(database, `users/${ENemail}`);
    
    try {
        await set(userRef, {
            email: email,
            // createdAt: Date.now()
        });
        console.log("User created successfully!");
    } catch (error) {
        console.error("Error creating user:", error);
    }
}

// create a brand new chatroom with NO users !!!
// need time => async !! (寫過不等的但是因為其他執行太快所以會有問題，等資料回來的時候function已經執行完)


// 要改成使用 uid 的嗎...?
// const checkUserExists = async (uid) => {
//     console.log("check user exists!", uid);
//     const userRef = ref(database, `users/${uid}`);

//     try {
//         const snapshot = await get(userRef);
//         if (snapshot.exists()) {
//             console.log("User exists:", snapshot.val());
//             return true;
//         } else {
//             console.log("User does not exist.");
//             return false;
//         }
//     } catch (error) {
//         console.error("Error checking user existence:", error);
//         return false;
//     }
// };

// const createUser = async (email) => {
//     const uid = auth.currentUser.uid; // 使用 Firebase Auth 提供的 uid
//     const result = await checkUserExists(uid);
    
//     if (result) {
//         console.log("User already exists!", email);
//         return;
//     }

//     const userRef = ref(database, `users/${uid}`);
    
//     try {
//         await set(userRef, {
//             email: email,
//             uid: uid, // 儲存 uid，這樣即使 email 變更，也能通過 uid 繼續辨識用戶
//             // createdAt: Date.now()
//         });
//         console.log("User created successfully!");
//     } catch (error) {
//         console.error("Error creating user:", error);
//     }
// };

const createChatroom = async (name) => {
    const chatroomRef = ref(database,`chatrooms`);
    // by this way (push!!!!!) => a UNIQUE KEY will be generated for each chatroom ! => easier to identify!
    const newroomRef = push(chatroomRef);

    // 可以再為了可 access 的人 => chatrooms/UNIQUEid/members
    await set(newroomRef, {
        name: name,
        Members: {}, // use [EMAIL] = true !
        Message: {}, // use push(newMsg) -> get unique Id and store the text, sender, time...
        id: newroomRef.key, 
    });

    // CONTINUE USE THE UNIQUE KEY to add members !
    console.log("Chatroom created:", newroomRef.key);
    return newroomRef.key; // IMPORTANT !!!!! 把這個聊天室的 ID 傳回來 !!!
};

const addUserToChatroom = async (roomID, email) => {
    const result = await checkUserExists(email);
    if(!result) 
    {
        alert("not a user in this chatroom web");
        return;
    }

    const roomMemRef = ref(database, `chatrooms/${roomID}/members`);
    await update(roomMemRef, {
        [encodeEmail(email)]: true, // use [EMAIL] = true !
        // 使用 true/false => 不會重複加到同一個人的問題 ! (反正就是一職 true!)
    });

    // /name 的方式不一定代表 folder, 可以是其中的一個 小節點 !!!!
    const roomNameRef = ref(database, `chatrooms/${roomID}/name`);
    const snapshot = await get(roomNameRef);
    const roomName = snapshot.exists() ? snapshot.val() : "(unknown)";

    console.log(`User ${email} added to chatroom ${roomName}`);
}

const createMessage = async(roomID,text,email) => {
    const MsgRef = ref(database,`chatrooms/${roomID}/Message`);
    const newMsgRef = push(MsgRef); // add a message

    await set(newMsgRef, {
        msg: text,
        sender: email,
        time: Date.now(),
        id: newMsgRef.key,
    });
    console.log("Message key:", newMsgRef.key, "roomid = " ,roomID);
    return newMsgRef.key;
};

// load msg in 
const loadMessage = async (roomID) => {
    const MsgRef = ref(database, `chatrooms/${roomID}/Message`);
    const snapshot = await get(MsgRef);
    
    if (snapshot.exists()) 
    {
      const messages = Object.entries(snapshot.val()) // to array !
        .map(([key, value]) => ({
          id: key,        
          sender: value.sender,
          time: value.time, 
          msg: value.msg,
        }))
        .sort((a, b) => a.time - b.time); // 可以排序 !!!
  
      console.log("messages", messages);
      return messages; 
    } 
    else 
    {
      console.log("No messages found.");
      return null;
    }
  };

const updateUserPhotoURL = async (email, photoURL) => {
    const ENemail = encodeEmail(email);
    const userRef = ref(database, `users/${ENemail}`);
  
    try {
      await update(userRef, { photoURL });
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          photoURL: photoURL,
        });
      }
  
      console.log("photoURL updated in both Realtime DB and Auth");
    } 
    catch (error) {
      console.error("Error updating photoURL:", error);
    }
  };

  const changeUserEmail = async (oldEmail, newEmail) => {
    // NEED TO ALSO CHANGE data !!!!
    const oldKey = encodeEmail(oldEmail);
    const newKey = encodeEmail(newEmail);
  
    const oldRef = ref(database, `users/${oldKey}`);
    const newRef = ref(database, `users/${newKey}`);
  
    try {
      await updateEmail(auth.currentUser, newEmail);
  

      const snapshot = await get(oldRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
  
        await set(newRef, { ...data, email: newEmail });
  
        await remove(oldRef);
  
        console.log("Email updated and data migrated successfully!");
      } 
      else 
      {
        console.log("No old data found to migrate.");
      }
    } 
    catch (error) 
    {
      console.error("Failed to update email or migrate data:", error);
    }
  };

export { createChatroom, addUserToChatroom, encodeEmail, createUser,createMessage, loadMessage, updateUserPhotoURL };
export default checkUserExists;