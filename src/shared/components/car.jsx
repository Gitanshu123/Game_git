import React, { useRef, useState } from 'react';
import { RigidBody, useRevoluteJoint } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from "three"
import { giveOut, score } from '../../features/positionSlice';
import { useDispatch } from 'react-redux';

const Vehicle = () => {
  const bodyRef = useRef(null);
  const frontWheelRef = useRef(null);
  const backLeftWheelRef = useRef(null);
  const backRightWheelRef = useRef(null);
  const action = useDispatch()
  const [subscribeKeys, getKeys] = useKeyboardControls();
  let [forwardDir, setMoveForward] = useState(false)
  useFrame((state, delta) => {
    const { x, y } = state.mouse;


    let velocity = { x: 0, y: 0, z: 0 };
    let torque = { x: 0, y: 0, z: 0 };

    const velocityStrength = 900 * delta;
    const torqueStrength = 2;
   
    function changeDirection() {

      if (x > 0 && y > 0) {
        velocity.x = velocityStrength;
        torque.y = -torqueStrength;
      } else if (x > 0 && y < 0) {
        velocity.x = velocityStrength;
        torque.y = -torqueStrength;
      } else if (x < 0 && y < 0) {
        velocity.x = -velocityStrength;
        torque.y = torqueStrength;
      } else if (x < 0 && y > 0) {
        velocity.x = -velocityStrength;
        torque.y = torqueStrength;
      }
     
    }

    const { forward, backward } = getKeys();

    if (forward) {
      velocity.z = -velocityStrength;
      forwardDir ? changeDirection() : ""

    } else if (backward) {
      velocity.z = velocityStrength;
      forwardDir ? changeDirection() : ""
    }

    bodyRef.current?.setLinvel(velocity);
    forwardDir?bodyRef.current?.applyTorqueImpulse(torque) : ""
    frontWheelRef.current?.setLinvel(velocity);
    forwardDir?frontWheelRef.current?.applyTorqueImpulse(torque) : ""
    backLeftWheelRef.current?.setLinvel(velocity);
    forwardDir?backLeftWheelRef.current?.applyTorqueImpulse(torque) : ""
    backRightWheelRef.current?.setLinvel(velocity);
    forwardDir?backRightWheelRef.current?.applyTorqueImpulse(torque) : ""


    const bodyPosition = bodyRef.current.translation()

    const cameraposition = new THREE.Vector3()
    cameraposition.copy(bodyPosition)
    cameraposition.z += 12.25
    cameraposition.y += 9.65

    action(giveOut({ x: cameraposition.x, y: cameraposition.y, z: cameraposition.z }))



    state.customObject = { x: cameraposition.x, y: cameraposition.y, z: cameraposition.z }



  });

  useRevoluteJoint(bodyRef, frontWheelRef, [
    [0, -1, 4],
    [0, 0, 0],
    [0, 0, 1],
  ]);

  useRevoluteJoint(bodyRef, backLeftWheelRef, [
    [-2, -1, -3],
    [0, 0, 0],
    [0, 0, 1],
  ]);

  useRevoluteJoint(bodyRef, backRightWheelRef, [
    [2, -1, -3],
    [0, 0, 0],
    [0, 0, 1],
  ]);

  return (
    <>

      <RigidBody
        ref={bodyRef}
        type="kinematicVelocity"
        position={[0, 2, 0]}
        mass={10}
        onCollisionEnter={() => action(score(1))}

      >
        <mesh>
          <gridHelper position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]} args={[50, 50, 0xff0000, 'teal']}
            onPointerOver={() => { setMoveForward(false) }} onPointerLeave={() => setMoveForward(true)} />
          <boxGeometry args={[4, 2, 8]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </RigidBody>


      <RigidBody
        ref={frontWheelRef}
        type="kinematicVelocity"
        position={[0, 1, -3]}
        colliders="trimesh"
        onCollisionEnter={() => action(score(1))}
        friction={0}
        mass={5}
      >
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </RigidBody>


      <RigidBody
        ref={backLeftWheelRef}
        type="kinematicVelocity"
        position={[-2, 1, 4]}
        mass={5}
        onCollisionEnter={() => action(score(1))}
        colliders="trimesh"
      >
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1, 1, 0.5, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </RigidBody>


      <RigidBody ref={backRightWheelRef} type="kinematicVelocity" position={[2, 1, 4]} mass={5} colliders="trimesh" onCollisionEnter={() => action(score(1))}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1, 1, 0.5, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Vehicle;


// import React, { useRef, useState } from 'react';
// import { RigidBody, useRevoluteJoint } from '@react-three/rapier';
// import { useKeyboardControls } from '@react-three/drei';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';
// import { giveOut, score } from '../../features/positionSlice';
// import { useDispatch } from 'react-redux';

// const Vehicle = () => {
//   const bodyRef = useRef(null);
//   const frontWheelRef = useRef(null);
//   const backLeftWheelRef = useRef(null);
//   const backRightWheelRef = useRef(null);
//   const dispatch = useDispatch();

//   // State for controlling forward direction and game over state
//   const [forwardDir, setMoveForward] = useState(false);
//   const [gameOver, setGameOver] = useState(false);  // Add game over state

//   const [subscribeKeys, getKeys] = useKeyboardControls();

//   // Handle game over logic when collision occurs
//   const handleCollision = () => {
//     setGameOver(true);  // Set game over to true when collision happens
//     dispatch(score(1));  // Dispatch the score increment action
//   };

//   // Frame update for physics and movement
//   useFrame((state, delta) => {
//     // If game is over, do not process further movements
//     if (gameOver) {
//       return;
//     }

//     const { x, y } = state.mouse;
//     const { forward, backward } = getKeys();

//     const velocityStrength = 900 * delta;
//     const torqueStrength = 2;

//     let velocity = { x: 0, y: 0, z: 0 };
//     let torque = { x: 0, y: 0, z: 0 };

//     const changeDirection = () => {
//       if (x > 0 && y > 0) {
//         velocity.x = velocityStrength;
//         torque.y = -torqueStrength;
//       } else if (x > 0 && y < 0) {
//         velocity.x = velocityStrength;
//         torque.y = -torqueStrength;
//       } else if (x < 0 && y < 0) {
//         velocity.x = -velocityStrength;
//         torque.y = torqueStrength;
//       } else if (x < 0 && y > 0) {
//         velocity.x = -velocityStrength;
//         torque.y = torqueStrength;
//       }
//     };

//     if (forward) {
//       velocity.z = -velocityStrength;
//       if (forwardDir) changeDirection();
//     } else if (backward) {
//       velocity.z = velocityStrength;
//       if (forwardDir) changeDirection();
//     }

//     bodyRef.current?.setLinvel(velocity);
//     if (forwardDir) bodyRef.current?.applyTorqueImpulse(torque);

//     frontWheelRef.current?.setLinvel(velocity);
//     if (forwardDir) frontWheelRef.current?.applyTorqueImpulse(torque);

//     backLeftWheelRef.current?.setLinvel(velocity);
//     if (forwardDir) backLeftWheelRef.current?.applyTorqueImpulse(torque);

//     backRightWheelRef.current?.setLinvel(velocity);
//     if (forwardDir) backRightWheelRef.current?.applyTorqueImpulse(torque);

//     // Camera follows vehicle
//     const bodyPosition = bodyRef.current.translation();
//     const cameraPosition = new THREE.Vector3();
//     cameraPosition.copy(bodyPosition);
//     cameraPosition.z += 12.25;
//     cameraPosition.y += 9.65;

//     dispatch(giveOut({ x: cameraPosition.x, y: cameraPosition.y, z: cameraPosition.z }));

//     state.customObject = { x: cameraPosition.x, y: cameraPosition.z, z: cameraPosition.z };
//   });

//   // Joint configuration for wheels
//   useRevoluteJoint(bodyRef, frontWheelRef, [
//     [0, -1, 4],
//     [0, 0, 0],
//     [0, 0, 1],
//   ]);

//   useRevoluteJoint(bodyRef, backLeftWheelRef, [
//     [-2, -1, -3],
//     [0, 0, 0],
//     [0, 0, 1],
//   ]);

//   useRevoluteJoint(bodyRef, backRightWheelRef, [
//     [2, -1, -3],
//     [0, 0, 0],
//     [0, 0, 1],
//   ]);

//   return (
//     <>
//       {/* Vehicle body */}
//       <RigidBody
//         ref={bodyRef}
//         type="kinematicVelocity"
//         position={[0, 2, 0]}
//         mass={10}
//         onCollisionEnter={handleCollision}  // Trigger game over on collision
//       >
//         <mesh>
//           <boxGeometry args={[4, 2, 8]} />
//           <meshStandardMaterial color="orange" />
//         </mesh>
//       </RigidBody>

//       {/* Front wheel */}
//       <RigidBody
//         ref={frontWheelRef}
//         type="kinematicVelocity"
//         position={[0, 1, -3]}
//         colliders="trimesh"
//         onCollisionEnter={handleCollision}  // Game over on wheel collision
//         friction={0}
//         mass={5}
//       >
//         <mesh>
//           <sphereGeometry args={[1, 32, 32]} />
//           <meshStandardMaterial color="black" />
//         </mesh>
//       </RigidBody>

//       {/* Back left wheel */}
//       <RigidBody
//         ref={backLeftWheelRef}
//         type="kinematicVelocity"
//         position={[-2, 1, 4]}
//         mass={5}
//         onCollisionEnter={handleCollision}  // Game over on wheel collision
//         colliders="trimesh"
//       >
//         <mesh rotation={[0, 0, Math.PI / 2]}>
//           <cylinderGeometry args={[1, 1, 0.5, 32]} />
//           <meshStandardMaterial color="black" />
//         </mesh>
//       </RigidBody>

//       {/* Back right wheel */}
//       <RigidBody
//         ref={backRightWheelRef}
//         type="kinematicVelocity"
//         position={[2, 1, 4]}
//         mass={5}
//         colliders="trimesh"
//         onCollisionEnter={handleCollision}  // Game over on wheel collision
//       >
//         <mesh rotation={[0, 0, Math.PI / 2]}>
//           <cylinderGeometry args={[1, 1, 0.5, 32]} />
//           <meshStandardMaterial color="black" />
//         </mesh>
//       </RigidBody>
//     </>
//   );
// };

// export default Vehicle;
