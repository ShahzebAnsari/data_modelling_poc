import {Position} from "./types";

export const getMidPosition = (startingPosition: Position, endPosition: Position) : Position => {
    return {
        x: (startingPosition.x + endPosition.x) / 2,
        y: (startingPosition.y + endPosition.y) / 2
    }
}

export const getOrientation = (startingPosition: Position, endPosition: Position) => {
    if(startingPosition.x === endPosition.x){
        return "vertical"
    } else if(startingPosition.y === endPosition.y){
        return "horizontal"
    }
    return "angled"
}

export const getSquareDistanceBetweenPositions = (startingPosition: Position, endPosition: Position)=> {
    return (endPosition.x - startingPosition.x)*(endPosition.x - startingPosition.x) + (endPosition.y - startingPosition.y)*(endPosition.y - startingPosition.y)
}

export const arePositionsInRange = (startingPosition: Position, endPosition: Position, range: number) => {
    return getSquareDistanceBetweenPositions(startingPosition, endPosition) <= range*range
}