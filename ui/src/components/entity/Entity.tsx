import React from "react";
import {EntityProps} from "./types";
import {ENTITY_SELECTED_OUTLINE_COLOR, ENTITY_TEXT_ELEMENT_ID} from "./constants";

const Entity = (props: EntityProps) => {
    const divStyle: React.CSSProperties = {
        display: "inline-block",
        borderStyle: "solid",
        padding: "10px",
        position: "absolute",
        borderWidth: props.entityDetail.entityState.isSelected ? "3px" : "2px",
        borderColor: props.entityDetail.entityState.isSelected ? ENTITY_SELECTED_OUTLINE_COLOR : props.entityDetail.entityDisplay.borderColor,
        backgroundColor: props.entityDetail.entityDisplay.backgroundColor,
        top: `${props.entityDetail.entityDisplay.yPosition}px`,
        left: `${props.entityDetail.entityDisplay.xPosition}px`
    }

    const spanStyle: React.CSSProperties = {
        borderStyle: "solid",
        outline: "none",
        userSelect: "none",
        borderColor: props.entityDetail.entityDisplay.backgroundColor,
        color: props.entityDetail.entityDisplay.textColor,
    }
    
    return (
        <div id={`entity_${props.id}`} onMouseDown={props.onMouseDown} onDoubleClick={props.onDoubleClick} style={divStyle}>
            <span id={`${ENTITY_TEXT_ELEMENT_ID}_${props.id}`} onInput={props.handleEditName} contentEditable={props.entityDetail.entityState.isEditable} style={spanStyle}>
                {props.entityDetail.entityMetadata.name}
            </span>
        </div>
    )
}

export default Entity