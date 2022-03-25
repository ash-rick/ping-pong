
import React, {useState} from 'react'
import Singleplayer from '../Gameplay/Playscreen/singleplayer/Singleplayer';
import Multiplayer from "../Gameplay/Playscreen/multiplayer/Multiplayer";
import Startscreen from '../Gameplay/Startscreen/Startscreen'
import WinningScreen from '../Gameplay/WinningScreen/WinningScreen';
import LoosingScreen from '../Gameplay/LoosingScreen/LoosingScreen';

function Playground() {
    const [toHere, setToHere] = useState('');

    const switchMode = (param) => {
        switch (param) {
          case "singleplayer":
            return <Singleplayer parentCallback={handleCallback} />;
          case "multiplayer":
            return <Multiplayer parentCallback={handleCallback} />;
          case "winning":
            return <WinningScreen />;
          case "loosing":
            return <LoosingScreen />;
          default:
            return <Startscreen parentCallback={handleCallback} />;
        }
    }

    const handleCallback = (childData) => {
        console.log(childData);
        setToHere(childData);
    };

    return (
        <>
          {switchMode(toHere)}
        </>
    );
}

export default Playground