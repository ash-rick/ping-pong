import { Box, Stack } from "@mui/material";
import { ref, onValue } from "firebase/database";
import { db } from "Firebase/firebaseconfig.js";
import { StarRate } from "@material-ui/icons";
import "./Leaderboard.scss";
import React, { useEffect, useState } from "react";

function Leaderboard() {
  const [leaderBoard, setLeaderBoard] = useState([]);
  

  let gameLevelScore = 0;

  useEffect(() => {
    onValue(ref(db, `UserList`), (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      setLeaderBoard(sortByPosition(data ? data : []));
    });
  }, []);

  const sortByPosition = (obj) => {
    const order = [];
    let res = [];

    if (Object.keys(obj).length > 0) {
      console.log(obj);
      let wins = 1;
      Object.keys(obj).forEach((key) => {

        let loc = window.location.hostname;
        loc = loc.slice(0, loc.indexOf('.'));
        loc = loc.slice(0, loc.lastIndexOf('-'));
        let gameIs;
        let status;

        Object.values([(key, obj[key]["gameID"])]).map(u => Object.values(u).map(o => o.map((k) => {  
          gameIs = k.game
          status = k.status
        })));
       
        if(gameIs === loc){
            gameLevelScore += status === 'won' ? 10 : 0;
          res.push([key, gameLevelScore]);
        }
        else {
          res.push(Object.values([(key, obj[key]["totalScore"])]))
        }
      });
      res.sort(function (a, b) {
        return b[1] - a[1];
      });
      console.log(res);
      res.forEach((key) => {
        console.log(key);
        order.push(obj[key[0]]);
      });
      console.log('order', order);
      return order;
    }
  };

  return (
    <Box className="leaderboard">
      <div className="lb-header">Leaderboard</div>
      <Stack spacing={2} sx={{ padding: "6px" }}>
        {leaderBoard ? (
          leaderBoard.map((lb, i) => (
            <div key={i} className="tb-row">
              <Box className="tb-cell">
                <div className="squares">{i + 1}.</div>
              </Box>
              <Box className="tb-cell">
                <div>
                  <img src={lb.dp} alt="display" width={30} />
                </div>
              </Box>
              <Box sx={{ color: "#f0bf00" }} className="tb-cell">
                {lb.name}
              </Box>
              <Box
                sx={{
                  color: "#f0bf00",
                }}
                className="tb-cell"
              >
                {gameLevelScore}
              </Box>
              <Box className="tb-cell">
                <StarRate sx={{ color: "#f0bf00" }} />
              </Box>
              <Box className="tb-cell">
                <StarRate sx={{ color: "#f0bf00" }} />
              </Box>
            </div>
          ))
        ) : (
          <div>There is no data to show</div>
        )}
      </Stack>
    </Box>
  );
}

export default Leaderboard;
