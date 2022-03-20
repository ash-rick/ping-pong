import React from "react";
import { ballHit } from "util/ballHitPaddle";
import { aiMove } from "util/comMove";
import { useNavigate} from "react-router-dom";
import Sketch from "react-p5";
import './Singleplayer.scss';



function Singleplayer() {
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
  let winPlayer;
  let themeType;

  let miss ;
  
  let followBall;
  let sel;
  let deficulty;

  const navigate = useNavigate();
  const setup = (p) => {
    p.canvas = p.createCanvas(wWidth, wHeight);

    ballX = wWidth / 2;
    ballY = wHeight / 2.15;
    PaddleY = wHeight / 2.5;
    PaddleY2 = wHeight / 2.5;
    player1_score = 0;
    player2_score = 0;
    speedx = 0;
    speedy = 0;
    PaddleX = wWidth / 20;
    PaddleX2 = wWidth / 1.0675;
    dir = [1, -1];


    miss = 120;
  
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

  };

  const draw = (p, parent) => {
    p.background("RGB(23, 76, 113)");

    p.strokeWeight(4);
    p.line(wWidth / 2, wHeight / 7.5, wWidth / 2, wHeight / 1.21); // middle line
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
    p.circle(wWidth / 2, wHeight / 2.15, wWidth / 10);

    p.textSize(wWidth/25);
    p.fill(255, 255, 255);
    p.text("Ping Pong", wWidth / 2.46, wHeight / 12);

    p.textSize(wWidth / 45);
    p.fill(170, 240, 209);
    p.text("YOU", wWidth / 12, wHeight / 19);

    p.textSize(wWidth / 45);
    p.fill(170, 240, 209);
    p.text("Computer", wWidth / 1.4, wHeight / 19);

    p.textSize(wWidth / 45);
    p.fill(170, 240, 209);
    p.text(`score: ${player1_score}`, wWidth / 6, wHeight / 19);

    p.textSize(wWidth / 45);
    p.fill(170, 240, 209);
    p.text(`score: ${player2_score}`, wWidth / 1.15, wHeight / 19);

    p.textSize(wWidth / 45);
    p.fill(170, 240, 209);
    p.text("Difficulty", wWidth/ 18, wHeight / 1.06);

    ////////////////////winning screen
    if (winPlayer) {
      if (winPlayer === "you") {
        navigate("/win", {
          state: {},
        });
      } else {
        navigate("/youlose", {
          state: {},
        });
      }
    }

    ////////////////////ball position update

    ballX = ballX + speedx;
    ballY = ballY + speedy;

    //////////////boundary checks
    if (ballX >= wWidth) {
      speedy = 0;
      speedx *= -1;
      ballX = wWidth / 1.15;
      ballY = wHeight / 2.15;
      player1_score += 1;

      if (player1_score === 10) {
        winPlayer = "you";
      }
    }
    if (ballX <= wWidth / 20) {
      speedy = 0;
      speedx *= -1;
      ballX = wWidth / 10;
      ballY = wHeight / 2.15;
      player2_score += 1;

      if (player2_score === 10) {
        winPlayer = "computer";
      }
    }
    if (ballY > wHeight / 1.25) {
      speedx *= 1;
      speedy *= -1;
    }
    if (ballY < wHeight / 7) {
      speedx *= 1;
      speedy *= -1;
    }

    ///////////Controller

    if (PaddleY - 5 >= wHeight / 6.9 && p.keyIsDown(p.UP_ARROW)) {
      PaddleY = PaddleY - 15;
    } else if (PaddleY + 5 <= wHeight / 1.47 && p.keyIsDown(p.DOWN_ARROW)) {
      PaddleY = PaddleY + 15;
    }

    /////////////// paddles and ball

    let c = p.color(255, 204, 0);
    p.fill(c);
    p.ellipse(ballX, ballY, 20, 20);

    c = p.color(65);
    p.fill(c);
    p.rect(PaddleX, PaddleY, 20, 80);

    c = p.color(65);
    p.fill(c);
    p.rect(PaddleX2, PaddleY2, 20, 80);

    //////////////////////////-ball hit case
    let hitRight = ballHit(p, ballX, ballY, 10, PaddleX2, PaddleY2, 30, 90);
    let hitLeft = ballHit(p, ballX, ballY, 10, PaddleX, PaddleY, 20, 80);

    if (hitRight || hitLeft) {
      speedx *= -1;
      speedy = dir[Math.round(Math.random())] * Math.random() * 10;
    }

   
    resetBtn.addClass("singleplay-btn");
    resetBtn.mousePressed(reset);

    themeBtn.addClass("singleplay-btn");
    themeBtn.mousePressed(changeTheme);

    pauseBtn.addClass("singleplay-btn");
    pauseBtn.mousePressed(pause);

    sel.option("easy", "easy");
    sel.option("medium", "medium");
    sel.option("hard", "hard");
    sel.addClass("singleplay-btn");

    sel.changed(changeDeficulty);

    // for ai move
    if (ballX > wWidth - (100 + Math.floor(Math.random() * followBall))) {
      PaddleY2 = aiMove(
        wHeight / 1.5,
        wHeight / 7.5,
        ballY,
        Math.random() * miss
      );
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
        ballX = wWidth / 2;
        ballY = wHeight / 2.15;
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

  
  const changeTheme = () => {
    if (themeType === "dark") {
      themeType = "light";
      themeBtn.html("light theme");
    } else {
      themeType = "dark";
      themeBtn.html("dark theme");
    }
  };

  const changeDeficulty = () => {

    deficulty = sel.selected();
    

    switch (deficulty) {
      case "easy":
        
        miss = 130;
        followBall = 70;
        setSpeed = 8;
        break;
      case "medium":
        
        miss = 100; 
        followBall = 120;
        setSpeed = 15;
        break;
      case "hard":
    
        miss = 90
        followBall = 180;
        setSpeed = 22;
        break;
      default:
    }
  };

  
  const exitFromGameSession = () => {
    navigate("/");
  };

  return (
    <div className="playing-page">
      {/* <Timer /> */}
      <Sketch setup={setup} draw={draw}></Sketch>
    </div>
  );
}

export default Singleplayer;
