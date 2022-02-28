import { ref, update } from "firebase/database";
import { db } from "Firebase/firebaseconfig.js";

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
      update(ref(db, `ping-pong/${gameSessionId}/ballspeed`), {
        x: value,
      });
      break;
    case "speedy":
      update(ref(db, `ping-pong/${gameSessionId}/ballspeed`), {
        y: value,
      });
      break;
    default:
      break;
  }
};
