import { ref, update } from "firebase/database";
import { db } from "Firebase/firebaseconfig.js";
import {  child, get } from "firebase/database";


const getExistingUserData = async (userId) => {

  

}

export const updateFirebase = (keys, value, gameSessionId) => {
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
      update(ref(db, `ping-pong/${gameSessionId}/gamestate/player1_paddle`), {
        y: value,
      });
      break;
    case "PaddleY2":
      update(ref(db, `ping-pong/${gameSessionId}/gamestate/player2_paddle`), {
        y: value,
      });
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
      update(ref(db, `ping-pong/${gameSessionId}/gamestate/ballspeed`), {
        x: value,
      });
      break;
    case "speedy":
      update(ref(db, `ping-pong/${gameSessionId}/gamestate/ballspeed`), {
        y: value,
      });
      break;
    default:
      break;
  }
};

export const updateuserList = (userId, gameSessionId, score, totalPlayedGames) => {
  let playerData;
  // (async () => {
  // getExistingUserData(userId).then( val => {
    // console.log('dfgh', val);
  // }) 
  // })();
  
  const dbRef = ref(db);
  get(child(dbRef, `user-list/${userId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        // userData = snapshot.val();
        playerData = snapshot.val();
        update(ref(db, `user-list/${userId}`), {
          total_games: playerData.total_games + 1,
          gameIds: [...playerData.gameIds, gameSessionId],
          score: playerData.score + score,
        });
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
  
}