import { Box, Stack } from "@mui/material";
import { ref, onValue } from "firebase/database";
import { db } from "Firebase/firebaseconfig.js";
import { StarRate } from "@material-ui/icons";
import "./Leaderboard.scss";
import React, { useEffect, useState } from "react";

function Leaderboard() {
  const [leaderBoard, setLeaderBoard] = useState([]);

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
      Object.keys(obj).forEach((key) => {
        let gameIs;
        Object.values([(key, obj[key]["gameID"])]).map(u => Object.values(u).map(o => o.map(k => gameIs = (k.game))));
        if(gameIs === 'ping-pong')
          res.push([key, obj[key]["totalScore"]]);
      });
      res.sort(function (a, b) {
        return b[1] - a[1];
      });
      console.log(res);
      res.forEach((key) => {
        order.push(obj[key[0]]);
      });
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
                {lb.totalScore}
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
