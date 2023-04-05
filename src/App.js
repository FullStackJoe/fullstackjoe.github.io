import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Pokedex from "./pages/Pokedex";
import { Route, Routes } from "react-router-dom";
import About from "./pages/About";

function App() {
  return (
    <>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Pokedex />} />

          <Route path="/About" element={<About />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
