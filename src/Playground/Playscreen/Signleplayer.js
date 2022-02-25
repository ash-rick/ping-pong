import React, { useState, useEffect } from "react";
import { ballHit } from "util/ballHitPaddle";
import { aiMove } from "util/comMove";
import { ref, onValue, update } from "firebase/database";

import { useNavigate, useLocation } from "react-router-dom";
import Sketch from "react-p5";
import { db } from "firebase.js";
import "./Playscreen.scss";

function Playscreen(props) {
  let wWidth = window.innerWidth;
  let wHeight = window.innerHeight;

//   const { state } = useLocation();
//   const [startGame, setStartGame] = useState(false);
  const [ballX, setBallX] = useState(wWidth / 2.05);
  const [ballY, setBallY] = useState(wHeight / 2.15);
  const [PaddleY, setPaddleY] = useState(wHeight / 2.5);
  const [PaddleY2, setPaddleY2] = useState(wHeight / 2.5);
  const [player1_score, setPlayer1_Score] = useState();
  const [player2_score, setPlayer2_Score] = useState();
 


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

    pauseBtn = p.createButton(pauseNresume);
    pauseBtn.position(wWidth / 1.5, wHeight / 1.11);
    pauseBtn.hide();

    sel = p.createSelect();
    sel.position(wWidth / 7, wHeight / 1.11);

    resetBtn = p.createButton(startNreset);
    resetBtn.position(wWidth / 2.2, wHeight / 1.11);

    themeBtn = p.createButton(themeType);
    themeBtn.position(wWidth / 1.22, wHeight / 1.11);

    shoWinPlayer = 0;
    // winPlayerName = "";
  };

  const draw = (p, parent) => {
    ;
    // }

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
    p.text("YOU", wWidth / 12, wHeight / 19);

    p.textSize(20);
    p.fill(255, 255, 180);
    p.text("Computer", wWidth / 1.3, wHeight / 19);

    p.textSize(20);
    p.fill(255, 255, 180);
    p.text('score:', wWidth / 5, wHeight / 19);

    p.textSize(20);
    p.fill(255, 255, 180);
    p.text('score:', wWidth / 1.15, wHeight / 19);

    p.textSize(25);
    p.fill(255, 255, 255);
    p.text("Difficulty", wWidth / 18, wHeight / 1.06);
    

    ////////////////////winning screen
    if (shoWinPlayer) {
        navigate("/win", {
            state: {
                winPlayer: shoWinPlayer,
            },
        });
    }
    ///////////////////winning screen

    //////////////boundary checks
    if (ballX >= wWidth / 1.05) {
      speedy = 0;
      setBallX(wWidth / 10);
      setBallY((wHeight - 40) / 2);
      setPlayer1_Score(prevState => prevState + 1);

      if (player1_score === 10) {
        someoneWin('you');
      }
    }
    if (ballX <= wWidth / 20) {
      speedy = 0;
      setBallX(wWidth / 1.1);
      setBallY((wHeight - 40) / 2);

      setPlayer2_Score((prevState) => prevState + 1);

      if (player2_score === 10) {
        someoneWin('computer');
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

    setBallX(prevState => prevState + speedx);
    setBallY((prevState) => prevState + speedy);


    ///////////Controller
    if (PaddleY - 5 >= wHeight / 7.1 && p.keyIsDown(p.UP_ARROW)) {
      setPaddleY((prevState) => prevState - 15);
    } else if (PaddleY + 5 <= wHeight / 1.52 && p.keyIsDown(p.DOWN_ARROW)) {
      setPaddleY(prevState => prevState + 15);
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


    pauseBtn.style("font-size", "30px");
    pauseBtn.style("background-color", col);
    pauseBtn.style("border", 0);
    pauseBtn.style("padding", "4px 10px");
    pauseBtn.mousePressed(pause);

    sel.option("easy", "easy");
    sel.option("medium", "medium");
    sel.option("hard", "hard");
    sel.style("padding", "7px");
    sel.style("font-size", "20px");
    sel.style("font-weight", "600");
    sel.style("background-color", "RGB(163, 183, 193)");
    sel.changed(mySelectEvent);
    

    // for ai move
    if (ballX > wWidth - (100 + Math.floor(Math.random() * followBall))) {
      setPaddleY2(aiMove(ballY, level_max, level_min, dir));
    }
  };

  const pause = () => {
    if (speedx === 0 && speedy === 0) {
      pauseBtn.html("pause");
      speedx = holdSpeedx;
      speedy = holdSpeedy;
    } else {
      pauseBtn.html("resume");
      holdSpeedx = speedx;
      holdSpeedy = speedy;
      speedx = 0;
      speedy = 0;
    }
  };

  const reset = () => {
    resetBtn.position(wWidth / 2.2, wHeight / 1.11);

    if (startNreset === "reset") {
        resetBtn.html("start");
        startNreset = "start";
        sel.removeAttribute("disabled");
        pauseBtn.hide();
        setPlayer1_Score(0);
        setPlayer2_Score(0);
        PaddleX = wWidth / 20;
        setPaddleY(wHeight / 2.5);
        PaddleX2 = wWidth / 1.067;
        setPaddleY2(wHeight / 2.5);
        setBallX((wWidth - 35) / 2);
        setBallY((wHeight - 40) / 2);
        speedx = 0;
        speedy = 0;

    } else if (startNreset === "start") {
        // shoWinPlayer = 0;
        // setPlayer1_Score(0);
        // setPlayer2_Score(0);
        speedx = setSpeed ? setSpeed : 10;
        speedy = 0;

        startNreset = "reset";
        resetBtn.html("reset");
        pauseBtn.html("pause");
        sel.attribute("disabled", true);
        pauseBtn.show();
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

  const mySelectEvent = () => {
    deficulty = sel.selected();

    switch (deficulty) {
      case "easy":
        level_min = 40;
        level_max = 100;
        followBall = 100;
        setSpeed = 5;
        break;
      case "medium":
        level_min = 30;
        level_max = 80;
        followBall = 120;
        setSpeed = 15;
        break;
      case "hard":
        level_min = 20;
        level_max = 60;
        followBall = 150;
        setSpeed = 25;
        break;
      default:
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
