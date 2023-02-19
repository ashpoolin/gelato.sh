import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Sol from "./pages/Sol";
import Spl from "./pages/Spl";
import Wallets from "./pages/Wallets";
import Research from "./pages/Research";
import About from "./pages/About";
import { Container } from "@mui/material";

// import {Routes, Route, Link} from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import React from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff7f50",
    },
    secondary: {
      main: "#3DDC97",
    },
  },
  typography: {
    fontFamily: "IBM Plex Mono, sans-serif",
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <div className="App">
          <Container maxWidth="lg">
            <Router>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sol" element={<Sol />} />
                <Route path="/spl" element={<Spl />} />
                <Route path="/wallets" element={<Wallets />} />
                <Route path="/research" element={<Research />} />
                <Route path="/about" element={<About />} />
              </Routes>
              <Footer />
            </Router>
          </Container>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
