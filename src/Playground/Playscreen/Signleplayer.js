import React, { useState} from "react";
import { ballHit } from "util/ballHitPaddle";
import { aiMove } from "util/comMove";
import { useNavigate} from "react-router-dom";
import Sketch from "react-p5";


function Singleplayer(props) {
  let wWidth = window.innerWidth;
  let wHeight = window.innerHeight;

  let ballX;
  let ballY;
  let PaddleY ;
  let PaddleY2;
  let player1_score;
  let player2_score;
 


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

    ballX = wWidth / 2.05;
    ballY = wHeight / 2.15;
    PaddleY = wHeight / 2.5;
    PaddleY2 = wHeight / 2.5;
    player1_score = 0;
    player2_score = 0;
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
  };

  const draw = (p, parent) => {
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
    p.text(`score:${player1_score}`, wWidth / 6, wHeight / 19);

    p.textSize(20);
    p.fill(255, 255, 180);
    p.text(`score:${player2_score}`, wWidth / 1.15, wHeight / 19);

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
      ballX = wWidth / 2.05;
      ballY = wHeight / 2.15;
      player1_score = player1_score + 1;

      if (player1_score === 10) {
        someoneWin("you");
      }
    }
    if (ballX <= wWidth / 20) {
      speedy = 0;
      ballX = wWidth / 2.05;
      ballY = wHeight / 2.15;
      player2_score = player2_score + 1;

      if (player2_score === 10) {
        someoneWin("computer");
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

    ///////////Controller

    if (PaddleY - 5 >= wHeight / 6.9 && p.keyIsDown(p.UP_ARROW)) {
      PaddleY = PaddleY - 15;
    } else if (PaddleY + 5 <= wHeight / 1.47 && p.keyIsDown(p.DOWN_ARROW)) {
      PaddleY = PaddleY + 15;
    }
    
   

    ///////////////ractangle paddle
    c = p.color(65);
    p.fill(c);
    p.rect(PaddleX, PaddleY, 20, 80);

    c = p.color(65);
    p.fill(c);
    p.rect(PaddleX2, PaddleY2, 20, 80);

    ////////////////////////////////


    ////////////////////ball position update

    ballX = ballX + speedx;
    ballY = ballY + speedy;


    //////////////////////////-ball hit case
    let hitRight = ballHit(p, ballX, ballY, 10, PaddleX2, PaddleY2, 24, 84);
    let hitLeft = ballHit(p, ballX, ballY, 10, PaddleX, PaddleY, 24, 84);

    if (hitRight || hitLeft) {
      speedx *= -1;
      speedy = dir[Math.round(Math.random())] * Math.random() * 10;
    }
    
    let col = p.color(163, 183, 193);

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
    sel.changed(chamgeDeficulty);

    // for ai move
    if (ballX > wWidth - (100 + Math.floor(Math.random() * followBall))) {
      PaddleY2 = aiMove(ballY, level_max, level_min, dir);
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
        player1_score = 0;
        player2_score = 0;
        PaddleX = wWidth / 20;
        PaddleY = wHeight / 2.5;
        PaddleX2 = wWidth / 1.067;
        PaddleY2 = wHeight / 2.5;
        ballX = ((wWidth - 35) / 2);
        ballY = ((wHeight - 40) / 2);
        speedx = 0;
        speedy = 0;

    } else if (startNreset === "start") {
       
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

  const chamgeDeficulty = () => {
    deficulty = sel.selected();

    switch (deficulty) {
      case "easy":
        level_min = 30;
        level_max = 60;
        followBall = 150;
        setSpeed = 5;
        break;
      case "medium":
        level_min = 30;
        level_max = 50;
        followBall = 170;
        setSpeed = 15;
        break;
      case "hard":
        level_min = 20;
        level_max = 40;
        followBall = 200;
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

export default Singleplayer;
