import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './container/Home/Home';
import Grades from './container/Grades/Grades';
import Timer from './container/Timer/Timer';
import Assignments from './container/Assignments/Assignments';
import Classes from './container/Classes/Classes';
import './App.css';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/classes" element={<Classes />} />
      </Routes>
    </Router>
  );
}

export default App;