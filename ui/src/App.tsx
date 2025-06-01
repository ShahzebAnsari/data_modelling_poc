import React, {useState, useRef, useEffect} from 'react';
import './App.css';
import {EntityDetail, EntityDisplay, EntityMetaData} from "./components/entity/types";
import Entity from "./components/entity/Entity";
import entity from "./components/entity/Entity";
import {ENTITY_TEXT_ELEMENT_ID} from "./components/entity/constants";
import Relationship from "./components/Relationship";

function App() {
  const [entities, setEntities] = useState<EntityDetail[]>([])
  const [selectedEntityId, setSelectedEntityId] = useState<number|null>(null)
  const [isHold,  setIsHold] = useState(false)
  const [xRel, setXRel] = useState(0);
  const [yRel, setYRel] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>, clickedEntity: EntityDetail) => {
    const entitiesCopy = [...entities]

    // mark old selected entity unselected and uneditable
    const selectedEntityIndex = entitiesCopy.findIndex((entity => entity.entityMetadata.id === selectedEntityId));
    if(selectedEntityId !== null){
        if(clickedEntity.entityMetadata.id !== selectedEntityId){
            entitiesCopy[selectedEntityIndex].entityState.isSelected = false
        }
        entitiesCopy[selectedEntityIndex].entityState.isEditable = false
    }

    // move new selected entity to the top
    const newSelectedEntityIndex = entitiesCopy.findIndex(entity => entity.entityMetadata.id == clickedEntity.entityMetadata.id )
    const [newSelectedEntity] = entitiesCopy.splice(newSelectedEntityIndex, 1)
    newSelectedEntity.entityState.isSelected = true
    entitiesCopy.push(newSelectedEntity)
    setEntities(entitiesCopy)
    setSelectedEntityId(clickedEntity.entityMetadata.id)

    setXRel(event.clientX - clickedEntity.entityDisplay.xPosition);
    setYRel(event.clientY - clickedEntity.entityDisplay.yPosition);

    setIsHold(true)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if(isHold){
      const entitiesCopy = [...entities];
      const selectedEntityIndex = entitiesCopy.findIndex(entity => entity.entityMetadata.id === selectedEntityId)
      entitiesCopy[selectedEntityIndex].entityDisplay.xPosition = event.clientX - xRel
      entitiesCopy[selectedEntityIndex].entityDisplay.yPosition = event.clientY - yRel
      setEntities(entitiesCopy)
    }
  }

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsHold(false)
  }

  const onMouseDownAnywhere = (event: React.MouseEvent<HTMLDivElement>) => {
      if(parentRef.current && parentRef.current.children.length > 0){
          let clickedEntityCount = 0
          for(let i=0;i<parentRef.current.children.length;i++){
              if(parentRef.current.children[i].contains(event.target as Node)){
                  clickedEntityCount ++;
              }
          }

          if(clickedEntityCount === 0 && selectedEntityId !== null){
              const entitiesCopy = [...entities];
              const selectedEntityIndex = entitiesCopy.findIndex(entity => entity.entityMetadata.id === selectedEntityId)
              entitiesCopy[selectedEntityIndex].entityState.isSelected = false
              entitiesCopy[selectedEntityIndex].entityState.isEditable = false
              setEntities(entitiesCopy)
              setSelectedEntityId(null);
          }
      }
  }



  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>, doubleClickedEntity: EntityDetail) => {
    const entitiesCopy = [...entities]
    const doubleClickedEntityIndex = entitiesCopy.findIndex(entity => entity.entityMetadata.id === doubleClickedEntity.entityMetadata.id)
    entitiesCopy[doubleClickedEntityIndex].entityState.isEditable = true
    setEntities(entitiesCopy)
  }



  const addEntity = () => {
    const entityId = entities.length
    const newEntityDetail: EntityDetail = {
        entityDisplay: {
            xPosition: 0,
            yPosition: 0,
            borderColor: "#000000",
            backgroundColor: "#ffffff",
            textColor: "#000000"
        },
        entityMetadata: {
            id: entityId,
            name: "New Entity"
        },
        entityState: {
            isSelected: true,
            isEditable: false,
        }
    }
    setEntities([...entities, newEntityDetail])
    setSelectedEntityId(entityId)
  }

  useEffect(() => {
    const editableEntityIndex = entities.findIndex(entity => entity.entityState.isEditable)
    if(editableEntityIndex !== -1 && parentRef.current && parentRef.current.children.length > 0){
      const editableSpanElement = parentRef.current.querySelector(`#${ENTITY_TEXT_ELEMENT_ID}_${editableEntityIndex}`)
      if(document.activeElement !== editableSpanElement){
          (editableSpanElement as any).focus()
          const range = document.createRange()
          range.selectNodeContents(editableSpanElement as Node)

          const selection = window.getSelection()
          selection?.removeAllRanges()
          selection?.addRange(range)

      }  else {
           (editableSpanElement as any).focus()
          const range = document.createRange()
          range.selectNodeContents(editableSpanElement as Node)
          range.collapse(false)

          const selection = window.getSelection()
          selection?.removeAllRanges()
          selection?.addRange(range)
      }
    }
  },
  [entities])


  const handleEditName = (event: any, editedEntity: EntityDetail)=> {
    const entitiesCopy = [...entities]
    const editedEntityIndex = entitiesCopy.findIndex(entity => entity.entityMetadata.id === editedEntity.entityMetadata.id)
    entitiesCopy[editedEntityIndex].entityMetadata.name = event.target.innerText
    setEntities(entitiesCopy)
  }



  return (
    <div className="App"
      onMouseDown={onMouseDownAnywhere}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        ref={parentRef}
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "repeating-linear-gradient(0deg, #eee, #eee 49px, #ccc 50px), repeating-linear-gradient(90deg, #eee, #eee 49px, #ccc 50px)",
          backgroundSize: "50px 50px",
          cursor: "grab",
          position: "relative"
        }}
      >
          <Relationship/>
          {
              entities.map((entityDetail, idx) =>
                  <Entity id={idx} onMouseDown={(event) => handleMouseDown(event, entityDetail)} onDoubleClick={(event) => handleDoubleClick(event, entityDetail)} handleEditName={(event) => handleEditName(event, entityDetail)} entityDetail={entityDetail} />
              )
          }
      </div>
        <button onClick={() => addEntity()}>Add Entity</button>
    </div>
  );
}

export default App;
