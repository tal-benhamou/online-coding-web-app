import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Lobby from './components/Lobby';
import CodeBlock from './components/CodeBlock';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route 
            path="/CodeBlock/:codeBlockName"
            render={(props) => (
              <CodeBlock
              />
            )}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
