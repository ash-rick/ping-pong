import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import "./Startscreen.scss";
import { uid } from "uid";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import { auth } from "Firebase/firebaseconfig.js";
import { db } from "Firebase/firebaseconfig.js";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ref, onValue, update, set } from "firebase/database";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {setInSession} from 'storage/sessionStorage'

function Startscreen(props) {
 
  const [data, setData] = useState(null);
  const [ishared, setIshared] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [uID, setUID] = useState();
  const navigate = useNavigate();

  let wWidth = window.innerWidth;
  let wHeight = window.innerHeight;

  const { gameid } = useParams();


  useEffect(() => {
    if (gameid) {
      setIshared(true);
      setUID(gameid);
    } else if (!uID) {
      setUID(uid());
    }
  }, [gameid, uID]);

  useEffect(() => {
    onValue(ref(db, `ping-pong/${uID}`), (snapshot) => {
        setData(snapshot.val());
        
    });
  }, [uID]);

 
  const gameSessionUrl = window.location.href;

  const [modalIsOpen, setIsOpen] = useState(false);

  const provider = new GoogleAuthProvider();

  const signInWithGoggle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setIsLoggedin(true);
        setInSession("user", JSON.stringify({name: result.user.displayName, email: result.user.email}));

        set(ref(db, `ping-pong/${uID}`), {
          players: {
            player1: {
              name: !ishared
                ? result.user.displayName
                : data.players.player1.name,
              email: !ishared ? result.user.email : data.players.player1.email,
            },
            player2: {
              name: ishared ? result.user.displayName : "",
              email: ishared ? result.user.email : "",
            },
          },

          gamestate: {
            ball: {
              x: wWidth / 2.05,
              y: wHeight / 2.15,
            },
            player1_paddle: {
              y: wHeight / 2.5,
            },
            player2_paddle: {
              y: wHeight / 2.5,
            },
            score: {
              player1_score: 0,
              player2_score: 0,
            },
          },
          start: false,
          winner: {},
          ballspeed:{
            x:0,
            y:0
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      width: "40%",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "rgba(255, 255, 255, 0.9",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, .5)",
    },
  };

  function closeModal() {
    setIsOpen(false);
  }

  Modal.setAppElement("#root");

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => closeModal()}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="modal-content">
          {isLoggedin ? (
            <div>
              {!ishared && (
                <CopyToClipboard text={`${gameSessionUrl}${uID}`}>
                  <Button variant="outlined">
                    Copy link to share with your firend
                  </Button>
                </CopyToClipboard>
              )}
              <Button
                style={{ margin: "5% 20%" }}
                variant="contained"
                className="enter-game-btn"
                onClick={() =>
                  navigate(`/multiplayer/${uID}`, {
                    state: {
                      reset: false,
                      uid: uID,
                      player1_name: data.players.player1.name,
                      player2_name: data.players.player2.name,
                      // player1_email: data.players.player1.email,
                    },
                  })
                }
              >
                Enter Game
              </Button>
            </div>
          ) : (
            <div className="signin-with-google">
              <Button onClick={() => signInWithGoggle()}>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxJzbnX4yyb7ekXoUeb4PXTamKvQ78mefFCw&usqp=CAU"
                  alt="google"
                  height="25%"
                  width="25%"
                />
                Sign in
              </Button>
            </div>
          )}
          <div className="modal-bottom">
            <Button style={{ float: "right" }} onClick={() => closeModal()}>
              close
            </Button>
          </div>
        </div>
      </Modal>
      <div className="starting-page">
        <div className="login-page">
          <p className="game-name">PING PONG</p>
          <div className="all-btn">
            {!ishared && (
              <Button
                className="startscreen-btn"
                onClick={() => navigate("/playsolo")}
              >
                single player
              </Button>
            )}
            <Button className="startscreen-btn" onClick={() => setIsOpen(true)}>
              multiplayer
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Startscreen;
