import React, { useState, useEffect, useCallback } from "react";
import { ballHit } from "util/ballHitPaddle";
import { ref, onValue, update } from "firebase/database";
import { useNavigate, useLocation } from "react-router-dom";
import Sketch from "react-p5";
import { db } from "Firebase/firebaseconfig.js";
import { getFromSession } from "storage/sessionStorage";
import Timer from "components/timer/Timer";
import { toast } from "react-toastify";
import { updateFirebase } from "Firebase/updateFirebase.js";

function Multiplayer() {
  let wWidth = window.innerWidth;
  let wHeight = window.innerHeight;
  console.log('w', wWidth);
  console.log('h', wHeight);
  const user = JSON.parse(getFromSession("user"));

  const { state } = useLocation();

  const [startGame, setStartGame] = useState(false);
  const [player1_email, setPlayer1_Email] = useState("");
  const [player2_email, setPlayer2_Email] = useState("");
  const [player1_name, setPlayer1_Name] = useState("");
  const [player2_name, setPlayer2_Name] = useState("");
  const [ballX, setBallX] = useState(wWidth / 2);
  const [ballY, setBallY] = useState(wHeight / 2.15);
  const [PaddleY, setPaddleY] = useState(wHeight / 2.5);
  const [PaddleY2, setPaddleY2] = useState(wHeight / 2.5);
  const [player1_score, setPlayer1_Score] = useState(0);
  const [player2_score, setPlayer2_Score] = useState(0);
  const [isWinner, setWinner] = useState({});
  const [speedx, setSpeedX] = useState(0);
  const [speedy, setSpeedY] = useState(0);
  const [p5Btn, setP5Btn] = useState({});
  const [themeType, setThemeType] = useState("light theme");
  const [startNexit, setStartNexit] = useState("start");
  const [resetBtn, setResetBtn] = useState(true);

  const navigate = useNavigate();

  // let isMultiplayer = state.isMultiplayer;
  let resetGame = state.reset;
  let gameSessionId = state.uid;
  let player1 = state.player1_name;
  let player2 = state.player2_name;

  let PaddleX;
  let PaddleX2;
  let dir = [1, -1];

  useEffect(() => {
    onValue(ref(db, `Game/${gameSessionId}`), (snapshot) => {
      const data = snapshot.val();
      setPlayer1_Email(data.players.player1.email);
      setPlayer2_Email(data.players.player2.email);
      setPlayer1_Name(data.players.player1.name);
      setPlayer2_Name(data.players.player2.name);
      setStartGame(data.start);
      setWinner(data.winner);
      setBallX(data.gamestate.ball.x);
      setBallY(data.gamestate.ball.y);
      setPaddleY(data.gamestate.player1_paddle.y);
      setPaddleY2(data.gamestate.player2_paddle.y);
      setPlayer1_Score(data.gamestate.score.player1_score);
      setPlayer2_Score(data.gamestate.score.player2_score);
      setSpeedX(data.gamestate.ballspeed.x);
      setSpeedY(data.gamestate.ballspeed.y);
    });
  }, [gameSessionId]);

  //////////////game reset
  useEffect(() => {
    if (resetGame && resetBtn) {
      updateFirebase("ballX", wWidth / 2, gameSessionId);
      updateFirebase("ballY", wHeight / 2.15, gameSessionId);
      updateFirebase("player1_score", 0, gameSessionId);
      updateFirebase("player2_score", 0, gameSessionId);
      updateFirebase("speedx", 0, gameSessionId);
      updateFirebase("speedy", 0, gameSessionId);
      updateFirebase("winner", null, gameSessionId);
      updateFirebase("start", false, gameSessionId);
      updateFirebase("PaddleY",  wHeight / 2.5, gameSessionId);
      updateFirebase("PaddleY2", wHeight / 2.5, gameSessionId);

      return () => setResetBtn(false);
    }
  }, [gameSessionId, resetGame, resetBtn, wWidth, wHeight]);

  const setup = (p) => {
    p.canvas = p.createCanvas(wWidth, wHeight);

    setP5Btn({
      ...p5Btn,
      startBtn: p.createButton(startNexit),
      themeBtn: p.createButton(themeType),
    });
  };

  const draw = (p) => {
    // p.frameRate(30); //deafult : 60

    p.background("RGB(23, 76, 113)");

    PaddleX = wWidth / 20;
    PaddleX2 = wWidth / 1.07;

    ///////// fps showing
    let fps = p.frameRate();
    p.fill(255);
    p.text("FPS: " + fps.toFixed(2), wWidth / 3.5, wHeight / 19);

    ////////// borders
    p.strokeWeight(4);
    p.line(wWidth / 2, wHeight / 7.5, wWidth / 2, wHeight / 1.21); // middle line
    p.line(wWidth / 20, wHeight / 7.5, wWidth / 20, wHeight / 1.21); // left line
    p.line(wWidth / 1.05, wHeight / 7.5, wWidth / 1.05, wHeight / 1.21); //right line
    p.line(wWidth / 20, wHeight / 7.5, wWidth / 1.05, wHeight / 7.5); //upper line
    p.line(wWidth / 20, wHeight / 1.21, wWidth / 1.05, wHeight / 1.21); // bottom line
    p.strokeWeight(2);

    //////// updating ball position
    updateFirebase("ballX", (ballX + speedx) , gameSessionId);
    updateFirebase("ballY", (ballY + speedy) , gameSessionId);

    /////// themes
    if (themeType === "dark") {
      p.stroke(255);
    } else {
      p.stroke(0);
    }

    ////////////// texts on canvas
    let midc = p.color("RGB(23, 76, 113)");
    p.fill(midc);
    p.circle(wWidth / 2, wHeight / 2.15, wWidth / 10);

    p.textSize(47);
    p.fill(255, 255, 255);
    p.text("Ping Pong", wWidth / 2.4, wHeight / 12);

    p.textSize(20);
    p.fill(255, 255, 180);
    p.text(player1_name, wWidth / 15, wHeight / 19);

    p.textSize(20);
    p.fill(255, 255, 180);
    p.text(player2_name, wWidth / 1.4, wHeight / 19);

    p.textSize(20);
    p.fill(255, 255, 180);
    p.text(`score: ${player1_score}`, wWidth / 5, wHeight / 19);

    p.textSize(20);
    p.fill(255, 255, 180);
    p.text(`score: ${player2_score}`, wWidth / 1.15, wHeight / 19);

    //////////// ball
    let c = p.color(255, 204, 0);
    p.fill(c);
    p.ellipse(ballX, ballY, 20, 20);

    /////////////// ractangle paddle
    c = p.color(65);
    p.fill(c);
    p.rect(PaddleX, PaddleY, 20, 80);

    c = p.color(65);
    p.fill(c);
    p.rect(PaddleX2, PaddleY2, 20, 80);

    ///////////////// set winner
    if (player1_score === 10) {
      updateFirebase(
        "winner",
        {
          name: player1_name,
          email: player1_email,
        },
        gameSessionId
      );
    } else if (player2_score === 10) {
      updateFirebase(
        "winner",
        {
          name: player2_name,
          email: player2_email,
        },
        gameSessionId
      );
    }

    ////////////// boundary checks
    if (ballX >= wWidth / 1.05) {
      updateFirebase("speedy", 0, gameSessionId);
      updateFirebase("ballX", wWidth / 2, gameSessionId);
      updateFirebase("ballY", wHeight / 2.15, gameSessionId);
      updateFirebase("player1_score", player1_score + 1, gameSessionId);
    }
    if (ballX <= wWidth / 20) {
      updateFirebase("speedy", 0, gameSessionId);
      updateFirebase("ballX", wWidth / 2, gameSessionId);
      updateFirebase("ballY", wHeight / 2.15, gameSessionId);
      updateFirebase("player2_score", player2_score + 1, gameSessionId);
    }

    if (ballY > wHeight / 1.25) {
      updateFirebase("ballY", (ballY - 15), gameSessionId);
      updateFirebase("speedy", speedy * -1, gameSessionId);
    }
    if (ballY < wHeight / 7) {
      updateFirebase("ballY", (ballY + 15), gameSessionId);
      updateFirebase("speedy", speedy * -1, gameSessionId);
    }

    /////////// Controller:
    if (user.email === player1_email) {
      if (PaddleY - 15 >= wHeight / 7.1 && p.keyIsDown(p.UP_ARROW)) {
        updateFirebase("PaddleY", (PaddleY - 15), gameSessionId);
      } else if (PaddleY + 15 <= wHeight / 1.47 && p.keyIsDown(p.DOWN_ARROW)) {
        updateFirebase("PaddleY", (PaddleY + 15), gameSessionId);
      }
    } else {
      if (PaddleY2 - 15 >= wHeight / 7.1 && p.keyIsDown(p.UP_ARROW)) {
        updateFirebase("PaddleY2", (PaddleY2 - 15) , gameSessionId);
      } else if (PaddleY2 + 15 <= wHeight / 1.47 && p.keyIsDown(p.DOWN_ARROW)) {
        updateFirebase("PaddleY2", (PaddleY2 + 15), gameSessionId);
      }
    }

    ////////////////// ball hit on paddle case
    let hitright;
    let hitleft;

    hitright = ballHit(
      p, 
      ballX, 
      ballY, 
      10, 
      PaddleX2, 
      PaddleY2, 
      25, 
      85);
   
    hitleft = ballHit(
      p,
      ballX,
      ballY,
      10,
      PaddleX,
      PaddleY,
      25,
      85
    );

    if (hitleft || hitright) {
      if (hitleft) updateFirebase("ballX", (ballX + 20), gameSessionId);
      else updateFirebase("ballX", (ballX - 20), gameSessionId);

      updateFirebase("speedx", (speedx + 1) * -1, gameSessionId);
      updateFirebase(
        "speedy",
        dir[Math.round(Math.random())] * Math.random() * 10,
        gameSessionId
      );
    }

    ////////// buttons styles
    let col = p.color(163, 183, 193);
    p5Btn.startBtn.position(wWidth / 2.15, wHeight / 1.11);
    p5Btn.startBtn.style("font-size", "30px");
    p5Btn.startBtn.style("background-color", col);
    p5Btn.startBtn.style("border", 0);
    p5Btn.startBtn.style("padding", "4px 15px");
    p5Btn.startBtn.mousePressed(start);

    p5Btn.themeBtn.position(wWidth / 1.22, wHeight / 1.11);
    p5Btn.themeBtn.style("font-size", "30px");
    p5Btn.themeBtn.style("background-color", col);
    p5Btn.themeBtn.style("border", 0);
    p5Btn.themeBtn.style("padding", "4px 1%");
    p5Btn.themeBtn.mousePressed(changeTheme);

    if (startGame) {
      setStartNexit("exit");
      p5Btn.startBtn.html("exit");
    }

    /////////////// check winner:
    checkWinner();
  };


  ////////// start btn event
  const start = () => {
    if (startNexit === "start") {
      if (player1_name && player2_name) {
        updateFirebase("speedx", 11, gameSessionId);
        updateFirebase("speedy", 0, gameSessionId);
        updateFirebase("start", true, gameSessionId);
        setStartNexit("exit");
        p5Btn.startBtn.html("exit");
      } else {
        toast.info("...waiting for opponent ", {
          position: "bottom-center",
          theme: "dark",
        });
      }
    } else {
    
      if (user.email === player1_email) {
        updateFirebase(
          "winner",
          {
            name: player2_name,
            email: player2_email,
          },
          gameSessionId
        );
      } else {
        updateFirebase(
          "winner",
          {
            name: player1_name,
            email: player1_email,
          },
          gameSessionId
        );
      }
      exitFromGameSession();
    }
  };

  /////// change theme event
  const changeTheme = () => {
    if (themeType === "dark") {
      setThemeType("light");
      p5Btn.themeBtn.html("light theme");
    } else {
      setThemeType("dark");
      p5Btn.themeBtn.html("dark theme");
    }
  };

  /////// exit game
  const exitFromGameSession = () => {
    navigate("/");
  };

  const checkWinner = () => {
    if (isWinner && isWinner.email === user.email) {
      navigate("/win", {
        state: {
          winPlayer: isWinner,
          gameId: gameSessionId,
          player1: player1_name,
          player2: player2_name,
          player1_score: player1_score,
          player2_score: player2_score
        },
      });
    } else if (isWinner) {
      navigate("/youlose", {
        state: {
          losePlayer: user,
          gameId: gameSessionId,
          player1: player1_name,
          player2: player2_name,
          player1_score: player1_score,
          player2_score: player2_score,
        },
      });
    }
  };

  return (
    <div className="playing-page">
      <Sketch setup={setup} draw={draw}></Sketch>
    </div>
  );
}

export default Multiplayer;
