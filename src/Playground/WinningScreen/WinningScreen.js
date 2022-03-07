import React, { useEffect } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import { Button } from '@material-ui/core';
import {fireConfetti} from 'Playground/WinningScreen/confetti'
import './WinningScreen.scss'

function WinningScreen() {

  const { state } = useLocation();
  let preGameId = state.gameId;
  let winner = state.winPlayer; 
  let player1 = state.player1;
  let player2 = state.player2;
  let navigateHere = preGameId ? `/multiplayer/${preGameId}` : '/playsolo';

  const navigate = useNavigate();

  useEffect(() => {
      fireConfetti();
  },[]);

  return (
    <>
      <div className="winning-background">
        <div className="winner-name-div">
          <p className="winner-name">
            {preGameId ? winner.name : 'You '} Win
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