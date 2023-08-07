import React, { useState, useEffect } from 'react';
import Highlight from 'react-highlight';
import 'highlight.js/styles/github.css';
import '../css/CodeBlock.css';
import SmileyFace from './SmilyFace';


export default function CodeBlock ({ socket, codeBlockName, isMentor, initialCode, solution }) {

    const [code, setcode] = useState(initialCode);
    const [mentorCode, setMentorCode] = useState(initialCode);
    const [title] = useState(codeBlockName);
    const [solved, setSolved] = useState(false);

    // student socket
    const handleInputChange = (event) => {
        const newCode = event.target.value;
        setcode(newCode);
        socket.emit("student_code", newCode);
        if (newCode === solution){
            setSolved(true);
            socket.emit("solved", true);
        }
    };

    // mentor socket
    useEffect(() => {
        socket.on("mentor_code", (newCode) => {
            setMentorCode(newCode);
        });
        socket.on("solved", (val) => {
            setSolved(val);
        });
    }, [socket]);


    return (
        <div className="code-container">
            <div className="title">
                <h2>Code Block: {title}</h2>
            </div>
            <div className="p-element">
                <p>{isMentor ? 'Mentor' : 'Student'}</p>
            </div>
            {!solved ? (
                <div className="code-grid">
                    {!isMentor && (
                    <div className='student-code'>
                        <textarea
                            rows={20}
                            cols={90}
                            value={code}
                            onChange={handleInputChange}
                            className="code-textarea"
                        />
                    </div>
                    )}
                    {!solved ? (
                    <div className="highlighted-code">
                        <Highlight className="javascript">
                            {isMentor ? mentorCode : code}
                        </Highlight>
                    </div>
                    ) : (
                        <SmileyFace />
                     )}
                </div>
            ) : (
                <SmileyFace />
            )}
        </div>
    );
};