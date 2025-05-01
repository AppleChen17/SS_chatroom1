import React, { useState,useEffect } from "react";
import { auth } from "../config"; // 從 config.js 導入 auth
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
// useNavigate is "hook" => ask "navigate" function from it ! (router-dom並沒有把 navigate export，必須用 useNavigate 這個 hook 去獲取！!!)
import { useNavigate } from "react-router-dom";
import { createUser } from "../DBfunc";
import { useRoom } from "../RoomContext";
// import "./Login.css"; => 因為 REACT 中的 css 是全域性的，所以在這裡 login 也會跟著影響其他部分 !!


  
// main function
const Login = () => {
    const [email, setEmail] = useState(''); //setEmail => change the value of email
    const [password, setPassword] = useState('');
    // hooker
    const navigate = useNavigate();
    const { setSelectedRoomId } = useRoom();

    // useEffect(() => {
    //   const unsubscribe = onAuthStateChanged(auth, (user) => {
    //     // console.log("Auth state changed:", user?.email);
    //     setSelectedRoomId(null); // 每次登入狀態變化時重設聊天室
    //   });
  
    //   return () => unsubscribe();
    // }, []);
    // const { setSelectedRoomId } = useRoom(); // get the room id ! (is a HOOK !!!)
    // // setSelectedRoomId(null);
    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //       console.log("user changed:", user?.email);
    //       setSelectedRoomId(null);
    //     });
      
    //     return () => unsubscribe(); 
    //   }, []);
    
    // addEventListener functions !!!
    const create_alert = (type, message) => {
        console.log("create alert !",type,message);
        alert(`${type}: ${message}`);
    };

    const requestPermission = () => {
        if (Notification.permission === "default") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") console.log("granted!");
                else console.log("denied!");
            });
        } 
        else if (Notification.permission === "granted") {
            console.log("Permission already granted");
        }
    };

    const createChromeNotification = () => {
        if (Notification.permission === "granted") 
            {
        //   setTimeout(() => {
            new Notification("Login Success", {
              body: "Log in chat room success",
              icon: "/bell-solid.svg", // 注意：這必須是 public 資料夾內的圖片路徑
            });
            console.log("create chrome notification!");}
        //   }, 100); // 加一點 delay 確保畫面穩定後再送
        // } 
        else {
          console.log("Notification permission is not granted.");
        }
      };
    
    // SIGNIN
    const handleSignin = (email,password) => {
        console.log("sign in !");
        console.log(email, password);

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in    
            const user = userCredential.user;
            console.log("user",user);
            createChromeNotification();
            // create_alert("success", "Sign in successfully!");
            setEmail("");
            setPassword("");
            // createChromeNotification();
            navigate("/chatroom");
        })
        .catch((error) => {
            console.error("Signin failed:", error.message);
            create_alert("error", `Signup failed: ${error.message}`);
        });
    };

    // SIGNUP
    const handleSignup = (email,password) => {
        console.log("sign up new account !");
        console.log(email, password);


        // is A 獨立函數 (是從 firebase 內導入的獨立函數)，auth 作為第一個參數傳給他就好 !
        createUserWithEmailAndPassword(auth,email, password)
        .then(async (userCredential) => {
            // Signed in    
            const user = userCredential.user;
            console.log("user",user);
            createChromeNotification();
            // create_alert("success", "Account created successfully!");
            setEmail("");
            setPassword("");
            await createUser(email);
            // createChromeNotification();
            navigate("/chatroom");
        })
        .catch((error) => {
            console.error("Signup failed:", error.message);
            create_alert("error", `Signup failed: ${error.message}`);
        });
    };

    // GOOGLE
    const handleGoogle = () => {
        console.log("Google gmail !");
        // console.log(email,password);
        signInWithPopup(auth, new GoogleAuthProvider())
        .then(async (userCredential) => {
            createChromeNotification();
            // create_alert("success", "Google signed in successfully!");
            setEmail("");
            setPassword("");
            // createChromeNotification();
            await createUser(auth.currentUser.email);
            navigate("/chatroom");
        })
        .catch((error) => {
            create_alert("error", error.message);
        });
    }

    return (
        // work as <body> </body>
        <div className="login-page"
            style={{
                margin: 0,
                padding: 0,
                boxSizing: "border-box",
                backgroundColor: "#e85e5ea6",
                color: "white",
                display: "flex",
                justifyContent: "center",
                height: "100vh",
            }}
        >
            <div 
                className="login-area"
                style={{  backgroundColor: "#4332326",
                    textAlign: "center",
                    width: "450px",
                    padding: "30px",
                    borderRadius: "10px",
                    marginTop: "100px",
                    height: "400px",
                }}
            >

                {/* className="my-element" */}
                <h1 className="login">
                    {/* ref: https://www.youtube.com/shorts/AUafNbgATw8 */}
                    <span className="L" style={{animationDelay: "0s"}}>L</span>
                    <span className="o" style={{animationDelay: "0.1s"}}>o</span>
                    <span className="g" style={{animationDelay: "0.2s"}}>g</span>
                    <span className="i" style={{animationDelay: "0.3s"}}>i</span>
                    <span className="n" style={{animationDelay: "0.4s"}}>n</span>
                    {/* Login */}
                </h1>
                <button style={{all:"unset"}}>
                    <img className='bell' 
                    src="/bell-solid.svg" 
                    alt="notification" 
                    onClick={requestPermission}
                    />
                </button>
                <h6>Please enter your credentials to log in.</h6>

                <label htmlFor="inputEmail" 
                    className="sr-only" 
                    style={{fontSize: "1rem",margin: "0.2rem 0.2rem"}}
                >
                    <label >Email address</label>
                    {/* <label>Email address</label>  */}
                    {/* style={{color: "#f7c37e"}} */}
                </label>
                <input
                    type="email"
                    id="inputEmail"
                    className="form-control"
                    placeholder="Email address"
                    required
                    autoFocus
                    // value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="inputPassword" 
                        className="sr-only" 
                        style={{fontSize: "1rem",margin: "0.2rem 0.2rem"}}
                >
                    <label>Password</label>
                    {/* <label style={{color: "#f7c37e"}}>word</label> */}
                    {/* Password */}
                </label>
                <input
                    type="password"
                    id="inputPassword"
                    className="form-control"
                    placeholder="Password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="btns">
                    <button className="btn btn-lg btn-primary btn-block mb-2" 
                        id="btnLogin"
                        style={{ display: "block",width: "100%", margin: "10px 0px", fontSize: "1rem", }}
                        onClick={() => handleSignin(email,password)}
                    >
                        Sign in
                    </button>

                    <button className="btn btn-lg btn-info btn-block mb-2" 
                        id="btngoogle"
                        style={{ display: "block",width: "100%", fontSize: "1rem" }}
                        onClick={handleGoogle}>
                        Sign in with Google
                    </button>

                    <button className="btn btn-lg btn-secondary btn-block mb-22" 
                            id="btnSignUp"
                            style={{ display: "block",width: "100%", fontSize: "1rem" }}
                            onClick={() => handleSignup(email,password)}>
                        New account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;

// export default withStyles(styles)(Login);