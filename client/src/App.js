import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import "./App.css";
import Main from "./pages/Main";
import Registration from "./pages/Registration";
import Header from './components/Header/Header';
import ImageUpload from "./pages/ImageUpload"

function App() {
  return (
//     <Routes>
//   <Route path="teams/:teamId" element={<Team />} />
//   <Route path="teams/new" element={<NewTeam />} />
// </Routes>
<div className="App">
  
   <Router>
   <Routes>

        <Route path="/registration" element={<Registration />} />
       <Route path="/" element={<Main />} />
       <Route path="/upload" element={<ImageUpload /> } />
     </Routes> 
     </Router>
     </div>

  );
}

export default App;
