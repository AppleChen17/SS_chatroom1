import React, { useState,useEffect } from "react";
import { auth,database } from "../config"; // 從 config.js 導入 auth
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
// useNavigate is "hook" => ask "navigate" function from it ! (router-dom並沒有把 navigate export，必須用 useNavigate 這個 hook 去獲取！!!)
import { useNavigate } from "react-router-dom";
import { createUser } from "../DBfunc";
// import "./Login.css"; => 因為 REACT 中的 css 是全域性的，所以在這裡 login 也會跟著影響其他部分 !!

// main function
const Login = () => {
    const [email, setEmail] = useState(''); //setEmail => change the value of email
    const [password, setPassword] = useState('');
    // hooker
    const navigate = useNavigate();


    // addEventListener functions !!!
    const create_alert = (type, message) => {
        console.log("create alert !",type,message);
        alert(`${type}: ${message}`);
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
            create_alert("success", "Sign in successfully!");
            setEmail("");
            setPassword("");
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
            create_alert("success", "Account created successfully!");
            setEmail("");
            setPassword("");
            await createUser(email);
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
            create_alert("success", "Google signed in successfully!");
            setEmail("");
            setPassword("");
            await createUser(email);
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
                style={{  backgroundColor: "#433232a6",
                    textAlign: "center",
                    width: "600px",
                    padding: "30px",
                    borderRadius: "10px",
                    marginTop: "100px",
                    height: "550px",
                }}
            >
                <h1>Login</h1>
                <h4>Please enter your credentials to log in.</h4>

                <label htmlFor="inputEmail" 
                    className="sr-only" 
                    style={{fontSize: "1.5rem",margin: "1rem 1rem"}}
                >
                    Email address
                </label>
                <input
                    type="email"
                    id="inputEmail"
                    className="form-control"
                    placeholder="Email address"
                    required
                    autofocus
                    // value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="inputPassword" 
                        className="sr-only" 
                        style={{fontSize: "1.5rem",margin: "1rem 1rem"}}
                >
                    Password</label>
                <input
                    type="password"
                    id="inputPassword"
                    className="form-control"
                    placeholder="Password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="btns">
                    <button className="btn btn-lg btn-primary btn-block mb-3" 
                        id="btnLogin"
                        style={{ display: "block",width: "100%", margin: "15px 0", }}
                        onClick={() => handleSignin(email,password)}
                    >
                        Sign in
                    </button>

                    <button className="btn btn-lg btn-info btn-block mb-3" 
                        id="btngoogle"
                        style={{ display: "block",width: "100%", margin: "15px 0", }}
                        onClick={handleGoogle}>
                        Sign in with Google
                    </button>

                    <button className="btn btn-lg btn-secondary btn-block mb-3" 
                            id="btnSignUp"
                            style={{ display: "block",width: "100%", margin: "15px 0", }}
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