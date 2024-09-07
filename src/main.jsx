// import React, { useEffect } from 'react';
// import ReactDOM from 'react-dom/client';
// import { Canvas } from '@react-three/fiber';
// import { Loader, KeyboardControls, Environment, OrbitControls } from "@react-three/drei";
// import { Physics } from '@react-three/rapier';
// import { Provider, useSelector } from 'react-redux';
// import { store } from './store/store.js';
// import App from './App.jsx';
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <>
//     <Provider store={store}>
      
//       <ScoreCard />
//       <Loader />
//       <KeyboardControls map={[
//         { name: 'forward', keys: ['ArrowUp', 'w'] },
//         { name: 'backward', keys: ['ArrowDown', 's'] }
//       ]}>

// <Canvas style={{ position: "absolute" }} camera={{ position: [0, 7, 21] }} >
//         <OrbitControls/>
//         <Environment preset="night" />
//           <Physics  >
//             <App />
//           </Physics>
//         </Canvas>

//       </KeyboardControls>
//     </Provider>
//   </>
// );

// function ScoreCard() {
//   let scores = useSelector((state) => state.position.score)
//   useEffect(()=>{
//     alert("CLick to play\n For vehicle to move forward press W and mouse should be inside the grid  \n to move backward press S \n for changing direction point the cursor  ")
//   },[])
//   return (
//     <>
//     <h1 style={{ position: "relative", left: "0", top: "10px",zIndex:1 }}>{scores}:Score</h1>
//     <h2> {scores>0?"Game Over!":""} </h2>
//     <button onClick={()=>window.location.reload()}>Restart</button>
//     </>
//   )
// }

import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { Loader, KeyboardControls, Environment, OrbitControls } from "@react-three/drei";
import { Physics } from '@react-three/rapier';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store/store.js';
import { resetGame } from './features/positionSlice'; // Import the resetGame action
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <ScoreCard />
      <Loader />
      <KeyboardControls map={[
        { name: 'forward', keys: ['ArrowUp', 'w'] },
        { name: 'backward', keys: ['ArrowDown', 's'] }
      ]}>
        <Canvas style={{ position: "absolute" }} camera={{ position: [0, 7, 21] }}>
          <OrbitControls />
          <Environment preset="night" />
          <Physics>
            <App />
          </Physics>
        </Canvas>
      </KeyboardControls>
    </Provider>
  </>
);

function ScoreCard() {
  const dispatch = useDispatch();
  const scores = useSelector((state) => state.position.score);

  useEffect(() => {
    alert("Click to play\nTo move forward, press W\nTo move backward press S\nfor changing direction point the cursor  ");
  }, []);

  const handleRestart = () => {
    dispatch(resetGame()); // Dispatch action to reset game state
  };

  return (
    <div className="absolute top-0 left-0 p-4 z-10">
      <h1 className="text-3xl">{scores}: Score</h1>
      <h2 className="text-xl mt-2">{scores > 0 ? "Game Over!" : ""}</h2>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleRestart}>Restart</button>
    </div>
  );
}
