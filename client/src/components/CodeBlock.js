import React, { useState, useEffect }from 'react';

export default function CodeBlock ({ socket, codeBlockName, isMentor, initialCode }) {

    const [currCode, setCurrCode] = useState(initialCode);

    const handleInputChange = event => {
      setCurrCode(event.target.value);
      socket.emit("student_code", currCode);
    };

    useEffect(() => {
        socket.on('student_code', newCode => {
            setCurrCode(newCode);
        });
    });

    return (
    <div>
      <h2>Code Block: {codeBlockName}</h2>
      <p>{isMentor ? 'Mentor' : 'Student'}</p>
      <textarea rows={20} cols={100} value={currCode} onChange={handleInputChange} readOnly={isMentor} />
    </div>
  );
};