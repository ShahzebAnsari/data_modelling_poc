import React from "react";

export interface EntityDisplay {
    xPosition: number,
    yPosition: number,
    borderColor: string,
    backgroundColor: string,
    textColor: string
}

export interface EntityMetaData {
    id: number
    name: string
}

export interface EntityState {
    isSelected: boolean,
    isEditable: boolean,
}

export interface EntityDetail {
    entityDisplay: EntityDisplay,
    entityMetadata: EntityMetaData
    entityState: EntityState
}

export interface EntityProps {
    id: number
    entityDetail: EntityDetail
    onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
    onDoubleClick: (event: React.MouseEvent<HTMLDivElement>) => void
    handleEditName: (event: React.FormEvent<HTMLSpanElement>) => void
}