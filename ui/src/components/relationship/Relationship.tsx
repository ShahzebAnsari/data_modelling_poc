import React, {useEffect, useRef, useState} from "react";
import {CheckPoint} from "./types";
import {Position} from "../../common/types";
import {arePositionsInRange, getMidPosition, getOrientation} from "../../common/utils";

const Relationship = () => {
    const [endpoints, setEndpoints] = useState<Position[]>([{x: 60, y: 30}, {x: 60, y: 185}, {x: 362, y: 185}, {x: 362, y: 408}, {x: 200, y: 408}]);

    // to use endpoints in document.addEventListener
    const endpointsRef = useRef<Position[]>(endpoints)

    // this will be used later to transform mouse coordinate into SVG coordinate
    const svgRef = useRef<SVGSVGElement>(null);

    const xCoordinateMoveEndpoints = useRef<number[]>([]);
    const yCoordinateMoveEndpoints = useRef<number[]>([]);

    const getPoints = () => {
        return endpoints.map(endpoint => endpoint.x.toString() + "," + endpoint.y.toString()).join(" ")
    }

    const getGetCheckpoints = () => {
        const circleCoordinates: CheckPoint[] = []
        circleCoordinates.push(
            {
                position: {...endpoints[0]},
                movability: "all"
            }
        )
        for(let i=0;i<endpoints.length-1;i++){
            circleCoordinates.push(
                {
                    position: getMidPosition(endpoints[i], endpoints[i+1]),
                    movability: getOrientation(endpoints[i], endpoints[i+1])
                }
            )
        }
        circleCoordinates.push(
            {
                position: {...endpoints[endpoints.length - 1]},
                movability: "all"
            }
        )
        return circleCoordinates
    }

    const handleOnCheckpointDown = (event: React.MouseEvent<HTMLOrSVGElement>, index: number) => {
        if(index === 0 || index === endpoints.length){
            const firstIndex = index === 0 ? index : index - 1
            const secondIndex = index === 0 ? index + 1 : index - 2
            if(getOrientation(endpoints[firstIndex], endpoints[secondIndex]) === "vertical"){
                xCoordinateMoveEndpoints.current = [firstIndex, secondIndex]
                yCoordinateMoveEndpoints.current = [firstIndex]
            } else {
                xCoordinateMoveEndpoints.current = [firstIndex]
                yCoordinateMoveEndpoints.current = [firstIndex, secondIndex]
            }
        } else {
            let endPointsCopy = [...endpoints]
            let currentIndex = index
            if(index === 1 || index === endpoints.length-1) {
                if(index === 1){
                    endPointsCopy = [{...endPointsCopy[0]}, ...endPointsCopy]
                    currentIndex = 2
                } else {
                    endPointsCopy = [...endPointsCopy, {...endPointsCopy[endPointsCopy.length-1]}]
                    currentIndex = endPointsCopy.length - 2
                }
            }

            if(getOrientation(endPointsCopy[currentIndex], endPointsCopy[currentIndex-1]) === "vertical"){
                xCoordinateMoveEndpoints.current = [currentIndex-1, currentIndex]
            } else {
                yCoordinateMoveEndpoints.current = [currentIndex-1, currentIndex]
            }
            setEndpoints(endPointsCopy)
        }
    }


    useEffect(() => {
        // Keep ref in sync with state
        endpointsRef.current = [...endpoints]
    }, [endpoints]);

    useEffect(() => {
        document.addEventListener("mouseup", () => {
            xCoordinateMoveEndpoints.current = []
            yCoordinateMoveEndpoints.current = []
            let endpointsCopy = [...endpointsRef.current]
            let newEndpointCopy = []
            const range = 10
            for(let i=0;i<endpointsCopy.length-1;i++){
                if(arePositionsInRange(endpointsCopy[i], endpointsCopy[i+1], range)){
                    i++;
                } else {
                    newEndpointCopy.push(endpointsCopy[i]);
                }
            }
            if(newEndpointCopy.length === 0 || !arePositionsInRange(newEndpointCopy[0], endpointsCopy[0], range)){
                newEndpointCopy = [endpointsCopy[0], ...newEndpointCopy]
            } else {
                newEndpointCopy[0] = endpointsCopy[0]
            }
            if(newEndpointCopy.length === 1 || !arePositionsInRange(newEndpointCopy[newEndpointCopy.length-1], endpointsCopy[endpointsCopy.length-1], range)){
                newEndpointCopy = [...newEndpointCopy, endpointsCopy[endpointsCopy.length-1]]
            }

            if(endpointsCopy.length !== newEndpointCopy.length){
                for(let i=0; i<newEndpointCopy.length-1; i++){
                    if(getOrientation(newEndpointCopy[i], newEndpointCopy[i+1])){
                        if(Math.abs(newEndpointCopy[i].x - newEndpointCopy[i+1].x) < Math.abs(newEndpointCopy[i].y - newEndpointCopy[i+1].y)){
                            if(i===0){
                                newEndpointCopy[i+1].x = newEndpointCopy[i].x
                            } else {
                                newEndpointCopy[i].x = newEndpointCopy[i+1].x
                            }
                        } else {
                            if(i===0){
                                newEndpointCopy[i+1].y = newEndpointCopy[i].y
                            } else {
                                newEndpointCopy[i].y = newEndpointCopy[i+1].y
                            }
                        }
                    }
                }
                setEndpoints(newEndpointCopy)
            }
        })


        document.addEventListener("mousemove", (event: MouseEvent) => {
            const endpointsCopy = [...endpointsRef.current]
            const svg = svgRef.current
            if(svg){
                const pt = svg.createSVGPoint()
                pt.x = event.clientX;
                pt.y = event.clientY;

                const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse())

                xCoordinateMoveEndpoints.current.forEach(index => {
                    endpointsCopy[index].x = svgP.x
                })

                yCoordinateMoveEndpoints.current.forEach(index => {
                    endpointsCopy[index].y = svgP.y
                })

                setEndpoints(endpointsCopy)
            }

        })
    }, []);

    return (
        <div style={{position:"absolute", borderStyle:"solid", borderColor:"red", width:"100%", height:"100%"}}>
            <svg ref={svgRef} style={{borderStyle:"solid", width: "100%", height:"100%"}}>
            <polyline
                onClick={() => {}}
                points={getPoints()}
                fill={"none"}
                stroke={"black"}
                strokeWidth={"2px"}
            />
                {getGetCheckpoints().map(((checkPoint, index) => (
                    <circle
                        onMouseDown={event => handleOnCheckpointDown(event, index)}
                        r={3}
                        cx={checkPoint.position.x}
                        cy={checkPoint.position.y}
                        fill={"black"}
                        stroke="black"
                        strokeWidth="3px"
                        cursor={checkPoint.movability === "all" ? "move" : checkPoint.movability === "vertical" ? "ew-resize" : "ns-resize"}
                    />
                )))}
            </svg>
            {/*<circle/>*/}

        </div>
    )
}

export default Relationship;