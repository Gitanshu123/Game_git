// import { useFrame } from "@react-three/fiber";
// import { RigidBody } from "@react-three/rapier"
// import { useRef, useState } from "react";



// export default function RandomObject() {

//     let [display, setDisplay] = useState(0)
//     let [x, setX] = useState(0)
//     let [z, setZ] = useState(0)
//     const lastUpdateRef = useRef(0);

//     function coords(state) {
       
//         setX(Math.random() * 5 +state.customObject?.z);
//         setZ(Math.random() * 4 - 20 + state.customObject?.z);

//         setDisplay(prevDisplay => prevDisplay === 0 ? 1 : 0);
//     }
//     useFrame((state) => {

//         const now = performance.now();
//         const timeElapsed = now - lastUpdateRef.current;

//         if (timeElapsed > 4000) {
//             coords(state);
//             lastUpdateRef.current = now;
//         }

//     })

//     return (

//         <>
//             {display == 1 ? <Circle z={z} x={x} /> : <Square z={z} x={x} />}
//         </>

//     )


// }

// function Circle({ z, x }) {
//     return (
//         <RigidBody
//             type="dynamic"
//             position={[x || 0,  9+Math.random()*5, z || 0]}
        
//             colliders="ball"
//             restitution={0.6}
//         >
//             <mesh>
//                 <cylinderGeometry args={[2, 2, 1, 32]} />
//                 <meshBasicMaterial color="blue" />
//             </mesh>
//         </RigidBody>
//     );
// }

// // Square component
// function Square({ z, x }) {
//     return (
//         <RigidBody
//             type="dynamic"
//             position={[x || 0, 9+Math.random()*5, z || 0]}
            
//         >
//             <mesh>
//                 <boxGeometry args={[1, 1, 10]} />
//                 <meshBasicMaterial color="green" />
//             </mesh>
//         </RigidBody>
//     );
// }

import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";

export default function RandomObject() {
    const [objects, setObjects] = useState([]); // Store multiple falling objects
    const lastUpdateRef = useRef(0);

    function createRandomObject() {
        // Limit the total number of objects (all shapes) to less than 6
        if (objects.length < 6) {
            const shapeType = Math.floor(Math.random() * 3); // Randomly select shape: 0 (cube), 1 (sphere), 2 (pyramid)
            const x = Math.random() * 20 - 10; // Random x between -10 and 10
            const z = Math.random() * 20 - 10; // Random z between -10 and 10
            const y = 15 + Math.random() * 5; // Random y-height between 15 and 20 (fall from the sky)
            const id = Date.now(); // Unique ID for each object

            // Add new random object to the list
            setObjects((prev) => [...prev, { id, shapeType, x, y, z }]);

            // Remove object after 5 seconds
            setTimeout(() => {
                setObjects((prev) => prev.filter((obj) => obj.id !== id));
            }, 5000); // Disappear after 5 seconds (5000 ms)
        }
    }

    useFrame(() => {
        const now = performance.now();
        const timeElapsed = now - lastUpdateRef.current;

        // Only add a new object if 5 seconds have passed and there are fewer than 6 objects
        if (timeElapsed > 5000) { 
            createRandomObject();
            lastUpdateRef.current = now;
        }
    });

    return (
        <>
            {objects.map(({ id, shapeType, x, y, z }) => (
                shapeType === 0 ? (
                    <Cube key={id} x={x} y={y} z={z} />
                ) : shapeType === 1 ? (
                    <Sphere key={id} x={x} y={y} z={z} />
                ) : (
                    <Pyramid key={id} x={x} y={y} z={z} />
                )
            ))}
        </>
    );
}

// Cube component
function Cube({ x, y, z }) {
    return (
        <RigidBody
            type="dynamic"
            position={[x || 0, y, z || 0]} // Randomized positions for x, y, z
        >
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial color="green" />
            </mesh>
        </RigidBody>
    );
}

// Sphere component
function Sphere({ x, y, z }) {
    return (
        <RigidBody
            type="dynamic"
            position={[x || 0, y, z || 0]} // Randomized positions for x, y, z
            colliders="ball"
            restitution={0.6}
        >
            <mesh>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color="blue" />
            </mesh>
        </RigidBody>
    );
}

// Pyramid component
function Pyramid({ x, y, z }) {
    return (
        <RigidBody
            type="dynamic"
            position={[x || 0, y, z || 0]} // Randomized positions for x, y, z
        >
            <mesh>
                <coneGeometry args={[1, 2, 4]} />
                <meshBasicMaterial color="red" />
            </mesh>
        </RigidBody>
    );
}

