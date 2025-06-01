import React, {useState, useRef, useEffect} from 'react';
import './App.css';

interface EntityDisplay {
    xPosition: number,
    yPosition: number,
    color: string,
}

interface EntityMetaData {
    name: string
}

interface EntityDetail {
    entityDisplay: EntityDisplay,
    entityMetadata: EntityMetaData
}



function App() {
  const [isHold,  setIsHold] = useState(false)
  const [componentId, setComponentId] = useState(0)

  const [entities, setEntities] = useState<EntityDetail[]>([])
  const [isEditable, setEditable] = useState(false);
  const pref = useRef<HTMLParagraphElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if(isHold){
      const entitiesCopy = [...entities];
      entitiesCopy[componentId].entityDisplay = {...entitiesCopy[componentId].entityDisplay, xPosition: event.clientX, yPosition: event.clientY}
      setEntities(entitiesCopy)
    }
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>, id: number) => {
    setComponentId(id)
    setIsHold(true)
  }

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsHold(false)
  }

  const addEntity = () => {
    const entity: EntityDetail = {
        entityDisplay: {
            xPosition: 25,
            yPosition: 25,
            color: "#000000"
        },
        entityMetadata: {
            name: "New Entity"
        }
    }
    setEntities([...entities, entity])
  }

  useEffect(() => {
      if(pref.current) {
          pref.current.focus();
      }
  }, [isEditable])

  return (
    <div className="App">
      <div
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        // onClick={() => {setEditable(false)}}
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
          {
              entities.map((entity, i) =>
                  <div
                      onMouseDown={(e) => handleMouseDown(e, i)}
                      style={{
                        borderStyle: "solid",
                        position: "absolute",
                        top: `${entity.entityDisplay.yPosition - 25}px`,
                        left: `${entity.entityDisplay.xPosition - 25}px`,
                        userSelect: "none"
                      }}
                  >
                      New Entity
                  </div>
              )
          }
          {/*<div*/}
          {/*    contentEditable={isEditable}*/}
          {/*    onDoubleClick={() => setEditable(!isEditable)}*/}
          {/*      style={{*/}
          {/*          borderStyle: "solid",*/}
          {/*          position: "absolute",*/}
          {/*          userSelect: "none"*/}
          {/*      }}>*/}
          {/*    Delta New*/}
          {/*</div>*/}
          <div
            style={{ borderStyle: "solid", minWidth:"10%", maxWidth:"20%", minHeight: "5%", textAlign:"center"}}
            onDoubleClick={() => setEditable(true)}
            onClick={() => setEditable(false)}
          >
            <p ref={pref} contentEditable={isEditable} style={{ borderStyle: "solid", border: 'none', outline: 'none' }}/>
          </div>
      </div>
        <button onClick={() => addEntity()}>Add Entity</button>
    </div>
  );
}

export default App;
