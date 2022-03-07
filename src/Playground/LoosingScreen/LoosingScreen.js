import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
import "./LoosingScreen.scss";

function LoosingScreen() {
  const { state } = useLocation();
  let preGameId = state.gameId;
  let looser = state.losePlayer;
  let player1 = state.player1;
  let player2 = state.player2;
  let navigateHere = preGameId ? `/multiplayer/${preGameId}` : "/playsolo";

  const navigate = useNavigate();
  return (
    <>
      <div className="winning-background">
        <div className="winner-name-div">
          <p className="winner-name">
            {preGameId ? looser.name : "You "} lose the game
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

export default LoosingScreen;
