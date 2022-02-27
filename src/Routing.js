import Multiplayer from 'Playground/Playscreen/Multiplayer';
import Startscreen from 'Playground/Startscreen/Startscreen';
import WinningScreen from 'Playground/WinningScreen/WinningScreen';
import Singleplayer from "Playground/Playscreen/Signleplayer";
import Error404 from 'Error404';
import React from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function Routing() {
    return (
      <>
        <Router>
          <Routes>
            <Route path="/">
              <Route path=":gameid" element={<Startscreen />} />
              <Route path="" element={<Startscreen />} />
            </Route>
            {/* <Route path="/:id?" element={<Startscreen />} /> */}
            <Route path="/playsolo" element={<Singleplayer />} />
            <Route path="/multiplayer/:id" element={<Multiplayer />} />
            <Route path="/win" element={<WinningScreen />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Router>
      </>
    );
}

export default Routing