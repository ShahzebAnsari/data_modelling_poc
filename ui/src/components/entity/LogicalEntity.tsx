import React, {useEffect, useRef, useState} from "react";

const LogicalEntity = () => {
    const [content, setContent] = useState("New Entity");
    const [isEditable, setEditable] = useState(false);
    const spanRef = useRef<HTMLSpanElement>(null);

    const handleOnInput = (event: any) => {
        setContent(event.target.innerText)
        console.log(content)
    }

    const handleDoubleClick = (event:React.FormEvent<HTMLDivElement>) => {
        setEditable(true);
        const span = spanRef.current;
        if(span) {
            // focus and select all text
            span.focus()
            const range = document.createRange()
            range.selectNodeContents(span)
            const selection = window.getSelection()
            selection?.removeAllRanges()
            selection?.addRange(range)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", (event : MouseEvent) => {
            if(spanRef.current && !spanRef.current.contains(event.target as Node)){
                 setEditable(false)
            }
        })
    }, []);

    useEffect(() => {
        const span = spanRef.current;
        if(span){
            // focus and move cursor to last
            span.focus()
            const range = document.createRange()
            range.selectNodeContents(span)
            range.collapse(false)

            const selection = window.getSelection()
            selection?.removeAllRanges()
            selection?.addRange(range)
        }
    }, [content]);

    return (
        <div onDoubleClick={handleDoubleClick} style={{padding:"10px", borderStyle:"solid"}}>
            <span
                ref={spanRef}
                onInput={handleOnInput}
                contentEditable={isEditable}
                tabIndex={0}
                style={{
                    outline:"none",
                    border: "solid",
                    borderColor: "transparent",
                    whiteSpace: 'nowrap',
                    wordWrap: 'break-word',
                    userSelect: "none"
                }}
            >
                {content}
            </span>
        </div>
    )
}

export default LogicalEntity;