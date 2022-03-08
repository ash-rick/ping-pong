import { ref, update } from "firebase/database";
import { db } from "Firebase/firebaseconfig.js";
import { child, get } from "firebase/database";

const getExistingPlayerData = async (path) => {
  const snapshot = await get(child(ref(db), `user-list/${path}`));
  return snapshot.val();
};

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

export const updateuserList = (
  userId,
  gameSessionId,
  score,
  totalPlayedGames,
  status,
  player1_score,
  player2_score
) => {


  let playerData;

  getExistingPlayerData(userId).then((val) => {
    playerData = val;
    let gameids_data = playerData.gameIds ? playerData.gameIds : {};
   
    gameids_data[gameSessionId] = {
      score: [
        Math.max(player1_score, player2_score),
        Math.min(player1_score, player2_score),
      ],
      status: status,
    };


    update(ref(db, `user-list/${userId}`), {
      total_games: playerData.total_games ? playerData.total_games + 1 : 1,
      gameIds: gameids_data,
      score: playerData.score ? playerData.score + score : score,
    });
  });
};
