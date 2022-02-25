import React, { useState, useEffect } from "react";
import { ballHit } from "util/ballHitPaddle";
import { aiMove } from "util/comMove";
import {ref, onValue, update } from "firebase/database";

import { useNavigate, useLocation } from "react-router-dom";
import Sketch from "react-p5";
import { db } from "firebase.js";
import "./Playscreen.scss";

function Playscreen(props) {



  let wWidth = window.innerWidth;
  let wHeight = window.innerHeight;

  const { state } = useLocation();

  const [startGame, setStartGame] = useState(false);
  const [ballX, setBallX] = useState(wWidth / 2.05);
  const [ballY, setBallY] = useState(wHeight / 2.15);
  const [PaddleY, setPaddleY] = useState(wHeight / 2.5);
  const [PaddleY2, setPaddleY2] = useState(wHeight / 2.5);
  const [player1_score, setPlayer1_Score] = useState(0);
  const [player2_score, setPlayer2_Score] = useState(0);
// const [player2_score, setPlayer2_Score] = useState(0);

  let isMultiplayer = state.isMultiplayer;
  let gameSessionId = state.uid;
  let player1 = state.player1_name;
  let player2 = state.player2_name;

  useEffect(() => {
    if(isMultiplayer) {
      onValue(ref(db, `ping-pong/${gameSessionId}`), (snapshot) => {
        console.log(snapshot.val());
        const data = snapshot.val();
        setStartGame(data.start);
        setBallX(data.gamestate.ball.x);
        setBallY(data.gamestate.ball.y);
        setPaddleY(data.gamestate.player1_paddle.y);
        setPaddleY2(data.gamestate.player2_paddle.y);
        setPlayer1_Score(data.gamestate.score.player1_score);
        setPlayer2_Score(data.gamestate.score.player2_score);

      });
    }
  }, [gameSessionId, isMultiplayer]);

  console.log(startGame);

  var PaddleX, PaddleX2;
  var speedx, speedy;
  let setSpeed;
  let holdSpeedx, holdSpeedy;
  var dir;

  let pauseBtn;
  let resetBtn;
  let themeBtn;

  let startNreset;
  let pauseNresume;
  let shoWinPlayer;
  // let winPlayerName;
  let themeType;

  let level_min;
  let level_max;
  let followBall;
  let sel;
  let deficulty;

  const navigate = useNavigate();
  const setup = (p) => {
    p.canvas = p.createCanvas(wWidth, wHeight);

  
    speedx = 0;
    speedy = 0;
    PaddleX = wWidth / 20;  
    PaddleX2 = wWidth / 1.067;
    dir = [1, -1];

    level_min = 40;
    level_max = 100;
    followBall = 50;
    deficulty = "easy";

    pauseNresume = "pause";
    startNreset = "start";
    themeType = "light theme";

    if (!isMultiplayer) {
      pauseBtn = p.createButton(pauseNresume);
      pauseBtn.position(wWidth / 1.5, wHeight / 1.11);
      pauseBtn.hide();

      sel = p.createSelect();
      sel.position(wWidth / 7, wHeight / 1.11);
    }

    resetBtn = p.createButton(startNreset);
    resetBtn.position(wWidth / 2.2, wHeight / 1.11);

    themeBtn = p.createButton(themeType);
    themeBtn.position(wWidth / 1.22, wHeight / 1.11);

  };

  const draw = (p) => {

    update(ref(db, `ping-pong/${gameSessionId}`), {
      gamestate: {
        ball: {
          x: ballX,
          y: ballY,
        },
        player1_paddle: {
          y: PaddleY,
        },
        player2_paddle: {
          y: PaddleY2,
        },
        score: {
          player1_score: player1_score,
          player2_score: player2_score,
        },
      },
      start: startGame,
    });
  

    p.background("RGB(23, 76, 113)");

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

    ////////////////////winning screen
    if (shoWinPlayer) {
      navigate("/win", {
        state: {
          winPlayer: shoWinPlayer,
          gameId: gameSessionId,
        },
      });
    }
    ///////////////////winning screen

    //////////////boundary checks
    if (ballX >= wWidth / 1.05) {
      speedy = 0;
      setBallX(wWidth / 10);
      setBallY((wHeight - 40) / 2);
      setPlayer1_Score(player1_score + 1);

      if (player1_score === 10) {
        someoneWin(player1);
      }
    }
    if (ballX <= wWidth / 20) {
      speedy = 0;
      setBallX(wWidth / 1.1);
      setBallY((wHeight - 40) / 2);
      setPlayer2_Score(player2_score + 1);

      if (player2_score === 10) {
        someoneWin(player2);
      }
    }
    if (ballY > wHeight / 1.22) {
      speedx *= 1;
      speedy *= -1;
    }
    if (ballY < wHeight / 7.3) {
      speedx *= 1;
      speedy *= -1;
    }
    //////////////boundary checks

    let c = p.color(255, 204, 0);
    p.fill(c);
    p.ellipse(ballX, ballY, 20, 20);

    setBallX(ballX + speedx);
    setBallY(ballY + speedy);

    ///////////Controller
    if (PaddleY2 - 5 >= 69 && p.keyIsDown(83)) {
      setPaddleY2(PaddleY2 - 15);
    } else if (PaddleY2 + 5 <= wHeight / 1.52 && p.keyIsDown(87)) {
      setPaddleY2(PaddleY2 + 15);
    }

    if (PaddleY - 5 >= wHeight / 7.1 && p.keyIsDown(p.UP_ARROW)) {
      setPaddleY(PaddleY - 15);
    } else if (PaddleY + 5 <= wHeight / 1.52 && p.keyIsDown(p.DOWN_ARROW)) {
      setPaddleY(PaddleY + 15);
    }
    ///////////Controller

    ///////////////ractangle paddle
    c = p.color(65);
    p.fill(c);
    p.rect(PaddleX, PaddleY, 20, 80);

    c = p.color(65);
    p.fill(c);
    p.rect(PaddleX2, PaddleY2, 20, 80);

    ////////////////////////////////

    let hitRight = ballHit(p, ballX, ballY, 10, PaddleX2, PaddleY2, 24, 84);
    let hitLeft = ballHit(p, ballX, ballY, 10, PaddleX, PaddleY, 24, 84);

    if (hitRight || hitLeft) {
      speedx *= -1;
      speedy = dir[Math.round(Math.random())] * Math.random() * 10;
    }

    let col = p.color(163, 183, 193); //use color instead of fill

    resetBtn.style("font-size", "30px");
    resetBtn.style("background-color", col);
    resetBtn.style("border", 0);
    resetBtn.style("padding", "4px 10px");
    resetBtn.mousePressed(reset);

    themeBtn.style("font-size", "30px");
    themeBtn.style("background-color", col);
    themeBtn.style("border", 0);
    themeBtn.style("padding", "4px 1%");
    themeBtn.mousePressed(changeTheme);

    console.log(startGame);

    if (isMultiplayer && startGame) {
      alert("no");
      startNreset = "exit";
      resetBtn.html("exit");
      speedx = 10;
    }
  };


  const reset = () => {

    resetBtn.position(wWidth / 2.2, wHeight / 1.11);
    if (startNreset === "start") {

      speedx = 10;
      speedy = 0;

      startNreset = "exit";
      resetBtn.html("exit");

    } else {
      exitFromGameSession();
    }
  };

  const someoneWin = (who) => {
    shoWinPlayer = who;
    return who;
  };

  const changeTheme = () => {
    if (themeType === "dark") {
      themeType = "light";
      themeBtn.html("light theme");
    } else {
      themeType = "dark";
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

export default Playscreen;
