import { Fab, Stack } from "@mui/material";
import GameList from "components/GameList/GameList";
import Header from "components/Header/Header";
import LeaderBoard from "components/leaderboard/LeaderBoard";
import MailIcon from "@mui/icons-material/Mail";
import React from "react";
import "./DashBoard.scss";
import UserList from "components/UserList/UserList";
import GameSlider from "components/gameSlider/GameSlider";

function DashBoard() {
  const fabStyle = {
    position: "fixed",
    bottom: 16,
    right: 16,
    backgroundColor: "#B9EFA4",
  };
  return (
    <Stack spacing={1} className="dashboard">
      <Header />
      <div direction="row" spacing={1} className="center-body">
        <GameSlider />
        <LeaderBoard />
      </div>
      <div direction="row" spacing={1} className="center-body">
        <UserList />
        <GameList />
      </div>
      <Fab aria-label="mail" sx={fabStyle}>
        <MailIcon />
      </Fab>
    </Stack>
  );
}

export default DashBoard;
