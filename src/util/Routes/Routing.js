import Playground from 'Pages/Playground/Playground';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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