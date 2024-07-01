// src/App.js
import React from 'react';
import CodeEditor from './components/CodeEditor';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Code Editor - Tealfeed</h1>
      <p>Default use for writing JSX. Change code for other languages.</p>
      <CodeEditor />
    </div>
  );
}

export default App;