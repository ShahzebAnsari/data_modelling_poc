import React, {useEffect, useRef, useState} from "react";
import {Position} from "../common/types";

export const useDraggable = (pos: Position | null) => {
    const [position, setPosition] = useState<Position>(pos ? pos : {
        x: 0,
        y: 0
    })

    const dragging = useRef(false)
    const offset = useRef<Position>({
        x:0,
        y:0
    })

    useEffect(() => {
        document.addEventListener("mouseup", () => {
            dragging.current = false;
        })
        document.addEventListener("mousemove", (event: MouseEvent) => {
            if(dragging.current){
                setPosition({
                    x: event.clientX - offset.current.x,
                    y: event.clientY - offset.current.y
                })
            }
        })
    }, []);

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        dragging.current = true
        offset.current = {
            x: event.clientX - position.x,
            y: event.clientY - position.y
        }
    }


    return {position, handleMouseDown}
}

