import { ballHit } from 'util/ballHitPaddle'
import { aiMove } from 'util/comMove';
// import { getDatabase, ref, set } from "firebase/database";
import { fireConfetti } from "../WinningScreen/confetti";
// import { useNavigate } from 'react-router-dom';

export let hitPad = 0;
export default function sketch(p){
  // const navigate = useNavigate();


    var ballX, ballY;
    var PaddleX, PaddleY, PaddleX2, PaddleY2;
    var speedx, speedy;
    let setSpeed;
    let holdSpeedx, holdSpeedy;
    var dir;
    let player1_score = 0;
    let player2_score = 0;
    let wWidth = window.innerWidth;
    let wHeight = window.innerHeight;
    let pauseBtn;
    let resetBtn;
    let themeBtn;
    
    let startNreset;
    let pauseNresume;
    let shoWinPlayer;
    let winPlayerName;
    let themeType;

    let level_min;
    let level_max;
    let followBall; 
    let sel; 

    p.setup = () => {
      p.canvas = p.createCanvas(wWidth, wHeight);
    
      ballX = (wWidth-35)/2;
      ballY = (wHeight-40)/2;
      speedx = 0;
      speedy = 0;
      PaddleX = wWidth/20;
      PaddleY = wHeight/2.5;
      PaddleX2 = wWidth/1.067;
      PaddleY2 = wHeight / 2.5;
      dir = [1, -1];

      level_min = 40;
      level_max = 100;
      followBall = 50; 

      pauseNresume = "pause";
      startNreset = "start";
      themeType = "light theme";
      pauseBtn = p.createButton(pauseNresume);
      pauseBtn.position(wWidth/1.5, wHeight/1.11);

      resetBtn = p.createButton(startNreset);
      resetBtn.position(wWidth/2.2, wHeight / 1.11);

      themeBtn = p.createButton(themeType);
      themeBtn.position(wWidth/1.22, wHeight / 1.11);


      pauseBtn.hide();
      shoWinPlayer = 0;
      winPlayerName = ''; 
      
      sel = p.createSelect();
      sel.position(wWidth / 7, wHeight / 1.11);

    };
   
  
    p.draw = () => {
      p.background("RGB(23, 76, 113)");

      hitPad = 0;

      p.strokeWeight(4);
      p.line(
        (wWidth - 35) / 2,
        wHeight / 7.5,
        (wWidth - 35) / 2,
        wHeight / 1.21
      ); // middle line
      p.line(wWidth / 20, wHeight / 7.5, wWidth / 20, wHeight / 1.21); // left line
      p.line(wWidth / 1.05, wHeight / 7.5, wWidth / 1.05, wHeight / 1.21); //right line
      p.line(wWidth / 20, wHeight / 7.5, wWidth / 1.05, wHeight / 7.5); //upper line
      p.line(wWidth / 20, wHeight / 1.21, wWidth / 1.05, wHeight / 1.21); // bottom line
      p.strokeWeight(2);

      if (themeType === "dark") p.stroke(255);
      else {
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
      p.text("You", wWidth / 12, wHeight / 19);

      p.textSize(20);
      p.fill(255, 255, 180);
      p.text("Computer", wWidth / 1.3, wHeight / 19);

      p.textSize(20);
      p.fill(255, 255, 180);
      p.text(`score: ${player1_score}`, wWidth / 7, wHeight / 19);

      p.textSize(20);
      p.fill(255, 255, 180);
      p.text(`score: ${player2_score}`, wWidth / 1.15, wHeight / 19);

      p.textSize(25);
      p.fill(255, 255, 255);
      p.text("Difficulty", wWidth / 18, wHeight / 1.06);

      ////////////////////winning screen
      if (shoWinPlayer) {
        // navigate("/")
        // setTimeout(() => {
          // fireConfetti.reset();
          // shoWinPlayer=false;
        // }, 1000);
        let c = p.color("RGB(0, 0, 0)");
        p.fill(c);
        p.rect(wWidth / 20, wHeight / 7.5, wWidth/1.11, wHeight/1.45);

        p.textSize(50);
        p.fill(255, 255, 180);
        fireConfetti();
        winPlayerName = (shoWinPlayer === 1 ? "player1" : "computer") + " WIN";
        p.text(winPlayerName, 480, 260);

        ballX = 757.5;
        ballY = 210;
        speedx = 0;
        speedy = 0;
        pauseBtn.hide();
        startNreset = "start";
        resetBtn.html("New Game");
        resetBtn.position(wWidth / 2.4, wHeight / 1.11);
        resetBtn.mousePressed(reset);
      }
      ///////////////////winning screen

      //////////////boundary checks
      if (ballX >= wWidth / 1.05) {
        speedy = 0;
        ballX = wWidth / 10;
        ballY = (wHeight - 40) / 2;
        player1_score += 1;
        if (player1_score === 10) {
          someoneWin(1);
        }
      }
      if (ballX <= wWidth / 20) {
        speedy = 0;
        ballX = wWidth / 1.1;
        ballY = (wHeight - 40) / 2;
        player2_score += 1;
        if (player2_score === 10) {
          someoneWin(2);
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

      ballX = ballX + speedx;
      ballY = ballY + speedy;

      // this is controller of computer
      // if (PaddleY2 - 5 >= 69 && p.keyIsDown(p.UP_ARROW)) {
      //   PaddleY2 = PaddleY2 - 7;
      // } else if (PaddleY2 + 5 <= 372 && p.keyIsDown(p.DOWN_ARROW)) {
      //   PaddleY2 = PaddleY2 + 7;
      // }

      ///////////Controller
      if (PaddleY - 5 >= (wHeight / 7.1) && p.keyIsDown(p.UP_ARROW)) {
        PaddleY = PaddleY - 15;
      } else if (PaddleY + 5 <= wHeight / 1.52 && p.keyIsDown(p.DOWN_ARROW)) {
        PaddleY = PaddleY + 15;
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
      pauseBtn.style("font-size", "30px");
      pauseBtn.style("background-color", col);
      pauseBtn.style("border", 0);
      pauseBtn.style("padding", "4px 10px");
      pauseBtn.mousePressed(pause);

      resetBtn.style("font-size", "30px");
      resetBtn.style("background-color", col);
      resetBtn.style("border", 0);
      resetBtn.style("padding", "4px 10px");
      resetBtn.mousePressed(reset);

      themeBtn.style("font-size", "30px");
      themeBtn.style("background-color", col);
      themeBtn.style("border", 0);
      themeBtn.style("padding", "4px 10px");
      themeBtn.mousePressed(changeTheme);

      sel.option("easy", "easy");
      sel.option("medium", "medium");
      sel.option("hard", "hard");
      sel.option("legend", "legend");
      // sel.selected("medium");
      sel.style("padding", "7px");
      sel.style("font-size", "20px");
      sel.style("font-weight", "600");
      sel.style("background-color", "RGB(163, 183, 193)");
      // console.log(sel.value())
      sel.changed(mySelectEvent);

      // for ai move
      if (ballX > wWidth - (100 + Math.floor(Math.random() * followBall))) {
        console.log(Math.floor(Math.random() * followBall));
        // if(pauseNresume==="pause")
        // {
        PaddleY2 = aiMove(ballY, level_max, level_min, dir);
        // }
      }
    };

 
  const pause = () => {
    if(speedx === 0 && speedy === 0) {
      pauseBtn.html("pause");
      speedx = holdSpeedx;
      speedy = holdSpeedy;
     
    }
    else {
      pauseBtn.html("resume");
      holdSpeedx = speedx;
      holdSpeedy = speedy;
      speedx = 0;   
      speedy = 0;
      
    }
  }

  const reset = () => {
    
    resetBtn.position(wWidth / 2.2, wHeight / 1.11);
    let deficulty = sel.selected();

    if(startNreset === 'reset') {
      resetBtn.html('start');
      startNreset = 'start';
      sel.removeAttribute("disabled");
      pauseBtn.hide();
      player1_score = 0;
      player2_score = 0;
      PaddleX = wWidth / 20;
      PaddleY = wHeight / 2.5;
      PaddleX2 = wWidth / 1.067;
      PaddleY2 = wHeight / 2.5;
      ballX = (wWidth - 35) / 2;
      ballY = (wHeight - 40) / 2;
      speedx = 0;
      speedy = 0;
    }
    else if(startNreset === 'start' || startNreset === 'newgame'){
      startNreset = 'reset';
      resetBtn.html("reset");
      pauseBtn.html("pause");
      sel.attribute("disabled", true);
      pauseBtn.show();
      shoWinPlayer = 0;
      player1_score = 0;
      player2_score = 0;
      speedx = setSpeed ? setSpeed : 10;
      speedy = 0;
    }
   
    // p.setup();

  }


  const someoneWin = (who) => {
    shoWinPlayer = who;
    return who;
  
  }

  const changeTheme = () => {
    if(themeType === 'dark') {
      themeType = 'light';
      themeBtn.html('light theme');
    }
    else {
      themeType = 'dark';
      themeBtn.html("dark theme");

    }
  }


  const mySelectEvent = () => {
    let deficulty = sel.selected();

    switch(deficulty) {
      case 'easy':
        level_min = 40;
        level_max = 100;
        followBall = 50;
        setSpeed = 5; 
        break;
      case 'medium':
        level_min = 20;
        level_max = 80;
        followBall =  120;
        setSpeed = 15;
        break;
      case 'hard':
        level_min = 10;
        level_max = 50;
        followBall = 150;
        setSpeed = 25;
        break;
      case 'legend':
        level_min = 0;
        level_max = 20;
        followBall = 200;
        setSpeed = 35;
    }

  }
}