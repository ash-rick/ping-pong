import React, { useState, useEffect, useCallback} from "react";
import { ballHit } from "util/ballHitPaddle";
import {ref, onValue, update } from "firebase/database";
import { useNavigate, useLocation } from "react-router-dom";
import Sketch from "react-p5";
import { db } from "firebase.js";
import "./Multiplayer.scss";

function Multiplayer() {


  let wWidth = window.innerWidth;
  let wHeight = window.innerHeight;

  const { state } = useLocation();

  const [startGame, setStartGame] = useState(false);
  const [ballX, setBallX] = useState(wWidth / 2.05);
  const [ballY, setBallY] = useState(wHeight / 2.15);
  const [PaddleY, setPaddleY] = useState(wHeight / 2.5);
  const [PaddleY2, setPaddleY2] = useState(wHeight / 2.5);
  const [PaddleX, setPaddleX] = useState(wWidth / 20);
  const [PaddleX2, setPaddleX2] = useState(wWidth / 1.067);
  const [player1_score, setPlayer1_Score] = useState(0);
  const [player2_score, setPlayer2_Score] = useState(0);
  const [isWinner, setWinner] = useState('');
  const [speedx, setSpeedX] = useState(0);
  const [speedy, setSpeedY] = useState(0);
  const [hitLeftPaddle, setHitLeftPaddle] = useState(false);
  const [hitRightPaddle, setHitRightPaddle] = useState(false);
  const [dir, setDir] = useState([1, -1]);
  const [themeType, setThemeType] = useState('light');
  // const [resetBtn, setResetBtn] = useState()


  // let isMultiplayer = state.isMultiplayer;
  let gameSessionId = state.uid;
  let player1 = state.player1_name;
  let player2 = state.player2_name;
  
  let startBtn;
  let themeBtn;
  let startNexit;
  // let dir;
 
  useEffect(() => {

      onValue(ref(db, `ping-pong/${gameSessionId}`), (snapshot) => {
        console.log(snapshot.val().ballspeed.x);
        console.log(snapshot.val().ballspeed.y);
        const data = snapshot.val();
        
        setStartGame(data.start);
        setBallX(data.gamestate.ball.x);
        setBallY(data.gamestate.ball.y);
        setWinner(data.winner);
        setPaddleX(data.gamestate.player1_paddle.x);
        setPaddleX2(data.gamestate.player2_paddle.x);
        setPaddleY(data.gamestate.player1_paddle.y);
        setPaddleY2(data.gamestate.player2_paddle.y);
        setPlayer1_Score(data.gamestate.score.player1_score);
        setPlayer2_Score(data.gamestate.score.player2_score);
        setSpeedX(data.ballspeed.x);
        setSpeedY(data.ballspeed.y);
        setHitLeftPaddle(data.hitpaddle.left);
        setHitRightPaddle(data.hitpaddle.right);
      });
  }, [gameSessionId]);



  const setup = (p) => {
    p.canvas = p.createCanvas(wWidth, wHeight);
    // dir = [1, -1];
    console.log(speedy)
  };
  

  const navigate = useNavigate();
  
  const updateFireBase = useCallback(
    (keys, value) => {
      switch (keys) {
        case "ballX":
          update(ref(db, `ping-pong/${gameSessionId}/gamestate/ball`), {
            x: value,
          });
          break;

        case "ballY":
          update(ref(db, `ping-pong/${gameSessionId}/gamestate/ball`), {
            y: value,
          });
          break;
        case "player1_score":
          update(ref(db, `ping-pong/${gameSessionId}/gamestate/score`), {
            player1_score: value,
          });
          break;
        case "player2_score":
          update(ref(db, `ping-pong/${gameSessionId}/gamestate/score`), {
            player2_score: value,
          });
          break;
        case "PaddleY":
          update(
            ref(db, `ping-pong/${gameSessionId}/gamestate/player1_paddle`),{
              y: value,
            }
          );
          break;
        case "PaddleY2":
          update(
            ref(db, `ping-pong/${gameSessionId}/gamestate/player2_paddle`),{
              y: value,
            }
          );
          break;
        case "PaddleX":
          update(
            ref(db, `ping-pong/${gameSessionId}/gamestate/player1_paddle`),{
              x: value,
            }
          );
          break;
        case "PaddleX2":
          update(
            ref(db, `ping-pong/${gameSessionId}/gamestate/player2_paddle`),{
              x: value,
            }
          );
          break;
        case "start":
          update(ref(db, `ping-pong/${gameSessionId}`), {
            start: value,
          });
          break;
        case "winner":
          update(ref(db, `ping-pong/${gameSessionId}`), {
            winner: value,
          });
          break;
        case "speedx":
          update(ref(db, `ping-pong/${gameSessionId}/ballspeed`), {
            x: value,
          });
          break;
        case "speedy":
          update(ref(db, `ping-pong/${gameSessionId}/ballspeed`), {
            y: value,
          });
          break;
        case "hitleft":
          update(ref(db, `ping-pong/${gameSessionId}/hitpaddle`), {
            left: value,
          });
          break;
        case "hitright":
          update(ref(db, `ping-pong/${gameSessionId}/hitpaddle`), {
            right: value,
          });
          break;
        default:
          break;
      }
    }, [gameSessionId]
  );
  
  const draw = (p) => {
    p.background("RGB(23, 76, 113)");
    console.log(hitLeftPaddle, hitRightPaddle);
    updateFireBase("ballX", ballX + speedx);
    updateFireBase("ballY", ballY + speedy);

    updateFireBase("PaddleX", wWidth / 20);
    updateFireBase("PaddleX2", wWidth / 1.067);

    startNexit = "start";

    startBtn = p.createButton(startNexit);
    startBtn.position(wWidth / 2.2, wHeight / 1.11);

    themeBtn = p.createButton(themeType);
    themeBtn.position(wWidth / 1.22, wHeight / 1.11);

    p.strokeWeight(4);
    p.line((wWidth - 35) / 2, wHeight / 7.5, (wWidth - 35) / 2, wHeight / 1.21); // middle line
    p.line(wWidth / 20, wHeight / 7.5, wWidth / 20, wHeight / 1.21); // left line
    p.line(wWidth / 1.05, wHeight / 7.5, wWidth / 1.05, wHeight / 1.21); //right line
    p.line(wWidth / 20, wHeight / 7.5, wWidth / 1.05, wHeight / 7.5); //upper line
    p.line(wWidth / 20, wHeight / 1.21, wWidth / 1.05, wHeight / 1.21); // bottom line
    p.strokeWeight(2);

    if (themeType === "dark") {
      p.stroke(255);
    } else {
      p.stroke(0);
    }
    //////////////texts on canvas
    let midc = p.color("RGB(23, 76, 113)");
    p.fill(midc);
    p.circle(wWidth / 2.05, wHeight / 2.15, wWidth / 10);

    p.textSize(47);
    p.fill(255, 255, 255);
    p.text("Ping Pong", wWidth / 2.46, wHeight / 12);

    p.textSize(20);
    p.fill(255, 255, 180);
    p.text(player1, wWidth / 12, wHeight / 19);

    p.textSize(20);
    p.fill(255, 255, 180);
    p.text(player2, wWidth / 1.3, wHeight / 19);

    p.textSize(20);
    p.fill(255, 255, 180);
    p.text(`score: ${player1_score}`, wWidth / 5, wHeight / 19);

    p.textSize(20);
    p.fill(255, 255, 180);
    p.text(`score: ${player2_score}`, wWidth / 1.15, wHeight / 19);

    //////////////boundary checks
    if (ballX >= wWidth / 1.05) {
        
      updateFireBase("ballX", wWidth / 2.05);
      updateFireBase("ballY", wHeight / 2.15);
      updateFireBase("speedy", 0);
      updateFireBase("player1_score", player1_score + 1);

      if (player1_score === 10) {
        console.log(player1);
        updateFireBase("winner", player1);
      }
    
    }
    if (ballX <= wWidth / 20) {

      updateFireBase("ballX", wWidth / 2.05);
      updateFireBase("ballY", wHeight / 2.15);
      updateFireBase("speedy", 0);
      updateFireBase("player2_score", player2_score + 1);

      if (player2_score === 10) {
        console.log(player2);
        updateFireBase("winner", player2);
      }
     
   
    }

    if (ballY > wHeight / 1.22) {
      updateFireBase("speedx", speedx * 1);
      updateFireBase("speedy", speedy * -1);
    }
    if (ballY < wHeight / 7.3) {
      updateFireBase("speedx", speedx * 1);
      updateFireBase("speedy", speedy * -1);
    }
   

    let c = p.color(255, 204, 0);
    p.fill(c);
    p.ellipse(ballX, ballY, 20, 20);

    ///////////Controller:
    if (PaddleY2 - 5 >= wHeight / 7.1 && p.keyIsDown(87)) {
      updateFireBase("PaddleY2", PaddleY2 - 15);
    } else if (PaddleY2 + 5 <= wHeight / 1.47 && p.keyIsDown(83)) {
      updateFireBase("PaddleY2", PaddleY2 + 15);
    }

    if (PaddleY - 5 >= wHeight / 7.1 && p.keyIsDown(p.UP_ARROW)) {
      updateFireBase("PaddleY", PaddleY - 15);
    } else if (PaddleY + 5 <= wHeight / 1.47 && p.keyIsDown(p.DOWN_ARROW)) {
      updateFireBase("PaddleY", PaddleY + 15);
    }
   

    ///////////////ractangle paddle
    c = p.color(65);
    p.fill(c);
    p.rect(PaddleX, PaddleY, 20, 80);

    c = p.color(65);
    p.fill(c);
    p.rect(PaddleX2, PaddleY2, 20, 80);

   

    ///////////////////////////ball hit on paddle case
    updateFireBase(
      "hitright",
      ballHit(p, ballX, ballY, 10, PaddleX2, PaddleY2, 25, 85)
    );
    updateFireBase(
      "hitleft",
      ballHit(p, ballX, ballY, 10, PaddleX, PaddleY, 25, 85)
    );
      
    if (hitLeftPaddle || hitRightPaddle) {
      console.log("hit");
      updateFireBase("speedx", speedx * -1);
      updateFireBase("speedy", dir[Math.round(Math.random())] * Math.random() * 10);
      updateFireBase('hitleft', false);
      updateFireBase('hitright', false);
    }
    

    // console.log(hitRightPaddle, hitLeftPaddle);

    let col = p.color(163, 183, 193);

    startBtn.style("font-size", "30px");
    startBtn.style("background-color", col);
    startBtn.style("border", 0);
    startBtn.style("padding", "4px 10px");
    startBtn.mousePressed(start);

    themeBtn.style("font-size", "30px");
    themeBtn.style("background-color", col);
    themeBtn.style("border", 0);
    themeBtn.style("padding", "4px 1%");
    themeBtn.mousePressed(changeTheme);

    if (startGame) {
      // alert("no");
      startNexit = "exit";
      startBtn.html("exit");
      updateFireBase("speedx", 10);
      updateFireBase("speedy", 0);
      updateFireBase('start', false);
    }

    ////////////////////to winning screen:
    if (isWinner) {
      navigate("/win", {
        state: {
          winPlayer: isWinner,
          gameId: gameSessionId,
        },
      });
    }
    
  };


  const start = () => {

    if (startNexit === "start") {
      updateFireBase("speedx", 10);
      updateFireBase("speedy", 0);
      updateFireBase('start', true)
      startNexit = "exit";
      startBtn.html("exit");

    } else {
      exitFromGameSession();
    }
  };


  const changeTheme = () => {
    if (themeType === "dark") {
      setThemeType("light");
      themeBtn.html("light theme");
    } else {
      setThemeType("dark");
      themeBtn.html("dark theme");
    }
  };



  const exitFromGameSession = () => {
    navigate("/");
  };

  return (
    <div className="playing-page">
      <Sketch setup={setup} draw={draw}></Sketch>
    </div>
  );
}

export default Multiplayer;

