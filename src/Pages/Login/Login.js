import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { TextField } from "@material-ui/core";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { auth } from "Firebase/firebaseconfig";
import { toast } from "react-toastify";
import { setInSession } from "storage/sessionStorage";
import "./Login.scss";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState({});
    const [isLoginPage, setIsLoginPage] = useState(true);

   onAuthStateChanged(auth, (currentUser) => {
     setUser(currentUser);
   });


   const register = async () => {
     try {
       const user = await createUserWithEmailAndPassword(auth, email, password);
       toast.success(`welcom to the game dashboard`, {
         theme: "dark",
       });

     } catch (error) {
       let index = error.message.indexOf("/");
       toast.error(error.message.slice(index + 1, -2), {
         theme: "dark",
       });
     }
   };

   const login = async () => {
     try {
       const user = await signInWithEmailAndPassword(auth, email, password);

       toast.success(`loggedin success`, {
         theme: "dark",
       });
     
     } catch (error) {
       let index = error.message.indexOf("/");
       toast.error(error.message.slice(index + 1, -2), {
         theme: "dark",
         position: "top-center",
       });
     }
   };

   const logout = async () => {
     await signOut(auth);
     toast.warn("you logged out to game dashboard", {
       theme: "dark",
       position: "bottom-center",
     });
   };
  const handleSubmit = (event) => {
    event.preventDefault();
  }

  const Gprovider = new GoogleAuthProvider();

  const signInWithGoggle = () => {
    signInWithPopup(auth, Gprovider)
      .then((result) => {
        setInSession(
          "user",
          JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
          })
        );
        toast.success(`loggedin success`, {
          theme: "dark",
        });
     
      }).catch((error) => {
        toast.error(error.message, {
          theme:'dark',
          position:'top-center'
        })
      });
    }


    const FBprovider = new FacebookAuthProvider();

    const signInWithFaceBook = () => {
      signInWithPopup(auth, FBprovider)
        .then((result) => {

          const user = result.user;
          console.log(user);
          const credential = FacebookAuthProvider.credentialFromResult(result);
          const accessToken = credential.accessToken;

        })
        .catch((error) => {
       
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
        
          const email = error.email;
          const credential = FacebookAuthProvider.credentialFromError(error);

      });
    }

  return (
    <div className="container">
      <div className="login">
        <h2 className="login-text">
          {isLoginPage ? "Login" : "Sign up"} to Game Dashboard
        </h2>
        <form onSubmit={handleSubmit}>
          <Stack
            spacing={29}
            direction="row"
            justifyContent="center"
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Box>
              <Stack spacing={3}>
                <lable className="input-lable">Email</lable>
                <TextField
                  id="standard-basic"
                  className="input-text"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <lable className="input-lable">Password</lable>
                <TextField
                  id="standard-basic"
                  className="input-text"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="contained"
                  type="submit"
                  className="login-btn"
                  onClick={() => (isLoginPage ? login() : register())}
                >
                  {isLoginPage ? "Login" : "Sign in"}
                </Button>
              </Stack>
            </Box>
            <Box className="provider-block">
              <Stack spacing={5}>
                <Button
                  variant="outlined"
                  className="provider-btn"
                  onClick={() => signInWithGoggle()}
                >
                  <GoogleIcon className="provider-icons" />
                  Continue with Google
                </Button>
                <Button
                  variant="outlined"
                  className="provider-btn"
                  onClick={() => signInWithFaceBook()}
                >
                  <FacebookIcon className="provider-icons" />
                  Continue with Facebook
                </Button>
                
              </Stack>
            </Box>
          </Stack>
        </form>
        {isLoginPage ? (
          <p className="bottom-text">
            Not in game-dev app?
            <span className="bottom-link" onClick={() => setIsLoginPage(false)}>
              Sign up
            </span>
          </p>
        ) : (
          <p className="bottom-text">
            already have an account?
            <span className="bottom-link" onClick={() => setIsLoginPage(true)}>
              Login
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
