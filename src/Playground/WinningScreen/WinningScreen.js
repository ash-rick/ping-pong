import React, { useEffect } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import { Button } from '@material-ui/core';
import {fireConfetti} from 'Playground/WinningScreen/confetti'
import { getFromSession } from 'storage/sessionStorage';
import { updateuserList } from 'Firebase/updateFirebase'; 
import './WinningScreen.scss'


function WinningScreen() {

  const { state } = useLocation();
  let preGameId = state.gameId;
  let winner = state.winPlayer; 
  let player1 = state.player1;
  let player2 = state.player2;
  let navigateHere = preGameId ? `/multiplayer/${preGameId}` : '/playsolo';
  let user = JSON.parse(getFromSession("user"));
  let user_email_id = user.email.replace(/[^a-zA-Z/d]/g, "");
  const navigate = useNavigate();

  useEffect(() => {
      fireConfetti();
      updateuserList(user_email_id, preGameId, 500, 1);
  },[]);

  return (
    <>
      <div className="winning-background">
        <div className="winner-name-div">
          <p className="winner-name">
            {preGameId ? winner.name : 'You '} Won
          </p>
        </div>
        <div className="winning-screen-btn">
          <Button
            onClick={() =>
              navigate(navigateHere, {
                state: {
                  reset: true,
                  uid: preGameId,
                  player1_name: player1,
                  player2_name: player2,
                },
              })
            }
            className="new-game"
          >
            Play Again
          </Button>
          <Button onClick={() => navigate("/")} className="back">
            Back
          </Button>
        </div>
      </div>
    </>
  );
}

export default WinningScreen