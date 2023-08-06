import React, { useState, useEffect } from "react";
import CodeBlock from "./CodeBlock";
import io from 'socket.io-client';


const socket = io('http://localhost:3001');

export default function Lobby(){
    const [showCode, setShowCode] = useState(false);
    const [codeBlockName, setCodeBlockName] = useState("");
    const [initialCode, setInitialCode] = useState("");
    const [isMantor, setIsMentor] = useState(true);

    const handleCodeBlock = (codeBlockName) => {

        setCodeBlockName(codeBlockName);
        setShowCode(true);
        socket.emit("code_block_name", codeBlockName);

        switch (codeBlockName){

            case "Async Func":
                setInitialCode("Async Func");
                console.log("async func");
                break;
            default:
                setInitialCode("default");
                console.log("default");
                break;
        }
    }

    useEffect(()=>{
        socket.on("is_mentor", (val) => {
            setIsMentor(val);
        })
    });
    
    return (
        <div>
            {showCode ? (
                <CodeBlock socket={socket} codeBlockName={codeBlockName} initialCode={initialCode} isMentor={isMantor}/>
            ) : (
            <div>
                <h1>Choose Code Block</h1>
                <button onClick={() => handleCodeBlock('Async Func')}>Code Block 1</button>
                <button onClick={() => handleCodeBlock('Block2')}>Code Block 2</button>
                <button onClick={() => handleCodeBlock('Block3')}>Code Block 3</button>
                <button onClick={() => handleCodeBlock('Block4')}>Code Block 4</button>
            </div>
            )}
        </div>
    );
}