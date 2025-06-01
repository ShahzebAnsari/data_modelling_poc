import React, {use, useRef, useState} from "react";

const Relationship = () => {
    const [isSelected, setSelected] = useState(false);

    const [points, setPoints] = useState([[60, 30], [60, 185], [362, 185], [362, 408], [200, 408]]);

    const [xSyncPointIndices, setXSyncPointIndices] = useState([]);
    const [ySyncPointIndices, setYSyncPointIndices] = useState([]);

    const [num, setNum] = useState(0);
    const [num2, setNum2] = useState(0);

    const ref = useRef(null);
    console.log(points)

    const getPoints = () => {
        return points.map(point => point[0].toString() + "," + point[1].toString()).join(" ")
    }

    const getGetCheckpoints = () => {
        const cicleCoordinates = []
        cicleCoordinates.push(
            {
                x: points[0][0],
                y: points[0][1],
                movability: "all"
            }
        )
        for(let i=0;i<points.length-1;i++){
            cicleCoordinates.push(
                {
                    x:(points[i][0] + points[i+1][0])/2,
                    y:(points[i][1] + points[i+1][1])/2,
                    movability: points[i][0] === points[i+1][0] ? "vertical": "horizontal"
                }
            )
        }
        cicleCoordinates.push(
            {
                x: points[points.length - 1][0],
                y: points[points.length - 1][1],
                movability: "all"
            }
        )
        return cicleCoordinates
    }


    const handleOnMouseDown = (event) => {
        setSelected(true)
    }

    const handleOnPointDown2 = (event, index) => {
        setSelected(true)
        if(index === 0 || index === points.length){
            const firstIndex = index === 0 ? index : index - 1
            const secondIndex = index === 0 ? index + 1 : index - 2
            if(points[firstIndex][0] === points[secondIndex][0]){
                setXSyncPointIndices([firstIndex, secondIndex])
                setYSyncPointIndices([firstIndex])
            } else {
                setXSyncPointIndices([firstIndex])
                setYSyncPointIndices([firstIndex, secondIndex])
            }
        } else {
            let pointsCopy = [...points]
            let currentIndex = index
            if(index === 1 || index === points.length-1) {
                if(index === 1){
                    pointsCopy = [[...pointsCopy[0]], [...pointsCopy[0]], ...pointsCopy.slice(1, pointsCopy.length)]
                    currentIndex = 2
                } else {
                    pointsCopy = [...pointsCopy.slice(0, pointsCopy.length-1), [...pointsCopy[pointsCopy.length-1]], [...pointsCopy[pointsCopy.length-1]]]
                    currentIndex = pointsCopy.length - 2
                }
            }

            if(pointsCopy[currentIndex][0] === pointsCopy[currentIndex-1][0]){
                setXSyncPointIndices([currentIndex-1, currentIndex])
            } else {
                setYSyncPointIndices([currentIndex-1, currentIndex])
            }
            setPoints(pointsCopy)
        }
    }



    const handleOnMouseMove2 = (event) => {
        const pointsCopy = [...points]
        xSyncPointIndices.forEach(index => {
            pointsCopy[index][0] = event.clientX
        })

        ySyncPointIndices.forEach(index => {
            pointsCopy[index][1] = event.clientY
        })
        setPoints(points)
        setNum(event.clientX)
        setNum2(event.clientY)
    }


    const arePointsNear = (point1, point2, threshold = 0) => {
        return Math.abs(point1[0] - point2[0]) < threshold && Math.abs(point1[1] - point2[1]) < threshold;

    }

    const handleMouseUp = (event) => {

        setXSyncPointIndices([])
        setYSyncPointIndices([])
        let pointsCopy = [...points]
        let newPointCopy = []
        const threshold = 10
        for(let i=0;i<pointsCopy.length-1;i++){
            if(arePointsNear(pointsCopy[i], pointsCopy[i+1], threshold)){
                i++;
            } else {
                newPointCopy.push(pointsCopy[i]);
            }
        }
        if(newPointCopy.length === 0 || !arePointsNear(newPointCopy[0], pointsCopy[0], threshold)){
            console.log(newPointCopy[0] + " " + pointsCopy[0] + " Not near")
            newPointCopy = [pointsCopy[0], ...newPointCopy]
        } else {
            newPointCopy[0] = pointsCopy[0]
        }
        if(newPointCopy.length === 1 || !arePointsNear(newPointCopy[newPointCopy.length-1], pointsCopy[pointsCopy.length-1])){
            newPointCopy = [...newPointCopy, pointsCopy[pointsCopy.length-1]]
        }

        if(pointsCopy.length !== newPointCopy.length){
            for(let i=0; i<newPointCopy.length-1; i++){
                if(newPointCopy[i][0] !== newPointCopy[i+1][0] && newPointCopy[i][1] !== newPointCopy[i+1][1]){
                    if(Math.abs(newPointCopy[i][0] - newPointCopy[i+1][0]) < Math.abs(newPointCopy[i][1] - newPointCopy[i+1][1])){
                        if(i===0){
                            newPointCopy[i+1][0] = newPointCopy[i][0]
                        } else {
                            newPointCopy[i][0] = newPointCopy[i+1][0]
                        }
                    } else {
                        if(i===0){
                            newPointCopy[i+1][1] = newPointCopy[i][1]
                        } else {
                            newPointCopy[i][1] = newPointCopy[i+1][1]
                        }
                    }
                }
            }
            setPoints(newPointCopy)
        }
    }

    const clickAnywhereElse = (event) => {
        if(ref.current && ref.current.children){
            let isClickedOnLine = false
            console.log(ref.current.children)
            for(let i=0;i<ref.current.children.length;i++){
                if(ref.current.children[i].contains(event.target)){
                    isClickedOnLine = true
                    break
                }
            }

            if(!isClickedOnLine){
                setSelected(false)
            }

        }
    }



    return (
        <div style={{position:"absolute"}} onMouseDown={clickAnywhereElse} onMouseMove={handleOnMouseMove2} onMouseUp={handleMouseUp}>
        <svg ref={ref} style={{position:"absolute", borderStyle:"solid"}} width={500} height={500}>
            <polyline
                onClick={() => {}}
                onMouseDown={handleOnMouseDown}
                points={getPoints()}
                fill={"none"}
                stroke={isSelected ? "#3399ff" : "black"}
                strokeWidth={isSelected ? "3px": "2px"}
            />
            {isSelected && getGetCheckpoints().map(((coordinate, index) => (
                <circle
                    onMouseDown={event => handleOnPointDown2(event, index)}
                    r={5}
                    cx={coordinate.x}
                    cy={coordinate.y}
                    fill={"#3399ff"}
                    stroke="#3399ff"
                    strokeWidth="3px"
                    cursor={coordinate.movability === "all" ? "move" : coordinate.movability === "vertical" ? "ew-resize" : "ns-resize"}
                />
            )))}
        </svg>
        </div>
    )
}

export default Relationship;