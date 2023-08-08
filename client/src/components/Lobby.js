import React, { useState, useEffect } from "react";
import CodeBlock from "./CodeBlock";
import io from 'socket.io-client';
import '../css/Lobby.css';


const socket = io(`wss://online-coding-web-app.up.railway.app`);

export default function Lobby(){
    const [showCode, setShowCode] = useState(false);
    const [codeBlockName, setCodeBlockName] = useState("");
    const [initialCode, setInitialCode] = useState("");
    const [isMantor, setIsMentor] = useState(true);
    const [solution, setSolution] = useState("");

    const handleCodeBlock = (codeBlockName) => {

        setCodeBlockName(codeBlockName);
        setShowCode(true);
        socket.emit("code_block_name", codeBlockName);

        switch (codeBlockName){

            case "String Reversal":
                setInitialCode("/*\n   Write a function that takes a string as input and returns the reverse\n   of the string.\n*/\n\nfunction reverseString(str) {\n  // Your code here\n}");
                setSolution("/*\n   Write a function that takes a string as input and returns the reverse\n   of the string.\n*/\n\nfunction reverseString(str) {\n  return str.split('').reverse().join('');\n}");
                console.log("String Reversal");
                break;
            case "Fibonacci Sequence":
                setInitialCode("/*\n   Implement a function that generates the first n numbers of the Fibonacci\n   sequence.\n*/\n\nfunction fibonacci(n) {\n  // Your code here\n}");
                setSolution("/*\n   Implement a function that generates the first n numbers of the Fibonacci\n   sequence.\n*/\n\nfunction fibonacci(n) {\n  const sequence = [0, 1];\n  for (let i = 2; i < n; i++) {\n    const nextNumber = sequence[i - 1] + sequence[i - 2];\n    sequence.push(nextNumber);\n  }\n  return sequence;\n}");
                console.log("Fibonacci Sequence");
                break;
            case "Array Sum":
                setInitialCode("/*\n   Write a function that takes an array of numbers as input and returns\n   the sum of all the numbers.\n*/\n\nfunction arraySum(arr) {\n  // Your code here\n}");
                setSolution("/*\n   Write a function that takes an array of numbers as input and returns\n   the sum of all the numbers.\n*/\n\nfunction arraySum(arr) {\n  return arr.reduce((sum, num) => sum + num, 0);\n}");
                console.log("Array Sum");
                break;
            case "Palindrome Check":
                setInitialCode("/*\n   Create a function that checks if a given string is a palindrome\n   (reads the same forwards and backwards).\n*/\n\nfunction isPalindrome(str) {\n  // Your code here\n}");
                setSolution("/*\n   Create a function that checks if a given string is a palindrome\n   (reads the same forwards and backwards).\n*/\n\nfunction isPalindrome(str) {\n  const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');\n  const reversedStr = cleanStr.split('').reverse().join('');\n  return cleanStr === reversedStr;\n}");
                console.log("Palindrome Check");
                break;
            default:
                setInitialCode("default");
                console.log("default");
                break;
        }
    }

    const handleBack = () => {
        if (isMantor){
            socket.emit("mentor_leave", socket.id, codeBlockName);
        }
        else{
            /* try to pass codeBlockName and socket.id */
            // socket.emit("student_leave", socket.id);
        }
        setShowCode(false);
        setCodeBlockName("");
        setSolution("");

    };

    useEffect(()=>{
        socket.on("is_mentor", (val) => {
            setIsMentor(val);
        })
    });

    return (
        <div className="Lobby">
            {showCode ? (
                <CodeBlock socket={socket} codeBlockName={codeBlockName} initialCode={initialCode} isMentor={isMantor} solution={solution} />
            ) : (
                <div>
                    <h1 className="title">Choose Code Block</h1>
                    <div className="button-container">
                        <button className="button" onClick={() => handleCodeBlock('String Reversal')}>String Reversal</button>
                        <button className="button" onClick={() => handleCodeBlock('Fibonacci Sequence')}>Fibonacci Sequence</button>
                        <button className="button" onClick={() => handleCodeBlock('Array Sum')}>Array Sum</button>
                        <button className="button" onClick={() => handleCodeBlock('Palindrome Check')}>Palindrome Check</button>
                    </div>
                </div>
            )}
            <div className="back-button">
                <button onClick={handleBack}>Back</button>
            </div>
        </div>
    );
};