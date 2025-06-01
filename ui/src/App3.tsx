import './App.css';
import React from "react";
import LogicalEntity from "./components/entity/LogicalEntity";
import MovableObject from "./components/movable-objects/MovableObject";
import Relationship from "./components/relationship/Relationship2";


function App() {

    return (
        <div className="App">
            {/*<div style={{height:"5vh", backgroundColor:"blue"}}/>*/}
            <div
                style={{
                  width: "100vw",
                  height: "100vh",
                  overflow: "scroll",
                  position: "relative",
                  borderStyle: "solid"
                }}>

                <Relationship/>
                <div style={{position:"absolute", top:200, left:200, width:100, height:100, backgroundColor:"red"}}></div>
                <MovableObject>
                     <LogicalEntity/>
                </MovableObject>
                <MovableObject>
                    <LogicalEntity/>
                </MovableObject>
            </div>
        </div>
    )
}

export default App