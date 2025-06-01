import React from "react";
import {useDraggable} from "../../hooks/useDraggable";

interface MovableObject3Props {
    children : React.ReactNode
}
const MovableObject = (props: MovableObject3Props) => {
    const {position, handleMouseDown} = useDraggable({
        x:20,
        y:20
    })
    return (
        <div
            onMouseDown={handleMouseDown}
            style={{
            position: "absolute",
            left:`${position.x}px`,
            top:`${position.y}px`
        }}>
            {props.children}
        </div>
    )
}

export default MovableObject;