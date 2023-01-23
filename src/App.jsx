// import logo from './gelato.png';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Sol from './components/Sol';
import Spl from './components/Spl';
import Research from './components/Research';
import About from './components/About';

// import {Routes, Route, Link} from 'react-router-dom';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import React from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


function App() {

  return (
    <>
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />

    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sol" element={<Sol />} />
          <Route path="/spl" element={<Spl />} />
          <Route path="/research" element={<Research />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </Router>
    </div>
    </ThemeProvider>
    </>
  );
}

export default App;
