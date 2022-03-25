import Multiplayer from 'Gameplay/Playscreen/multiplayer/Multiplayer';
import Startscreen from 'Gameplay/Startscreen/Startscreen';
import WinningScreen from 'Gameplay/WinningScreen/WinningScreen';
import Singleplayer from "Gameplay/Playscreen/singleplayer/Singleplayer";
import LoosingScreen from 'Gameplay/LoosingScreen/LoosingScreen'
import DashBoard from 'Pages/DashBoard/DashBoard';
import Login from 'Pages/Login/Login'
import Error404 from 'Pages/ErrorPage/Error404';
import React from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Playground from 'Playground/Playground';

function Routing() {
    return (
      <>
        <Router>
          <Routes>
            <Route path="/" element={<Playground />} />

            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route path="/dashboard" element={<DashBoard />} /> */}
            {/* <Route path="/">
              <Route path=":gameid" element={<Startscreen />} />
              <Route path="" element={<Startscreen />} />
            </Route> */}
            {/* <Route path="/:id?" element={<Startscreen />} /> why not working*/}
            {/* <Route path="/playsolo" element={<Singleplayer />} />
            <Route path="/multiplayer/:id" element={<Multiplayer />} />
            <Route path="/win" element={<WinningScreen />} />
            <Route path="/youlose" element={<LoosingScreen />} />
            <Route path="*" element={<Error404 />} /> */}
          </Routes>
        </Router>
      </>
    );
}

export default Routing