import Header from "./components/Header";
import Footer from "./components/Footer";
import Wallet from './components/Wallet';
import Home from "./pages/Home";
import Sol from "./pages/Sol";
import Stake from "./pages/Stake";
import Spl from "./pages/Spl";
import Chainsplain from "./pages/Chainsplain";
import Wallets from "./pages/Wallets";
import Research from "./pages/Research";
import About from "./pages/About";
import { Container } from "@mui/material";
import Whalescale from "./pages/content/Whalescale";
import Chainsplainoor from "./pages/content/Chainsplainoor";
// import Rugs from "./pages/content/Rugs";
import TokenFingerprinting from "./pages/content/TokenFingerprinting";

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
              <Wallet>
                <Header />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/sol" element={<Sol />} />
                  <Route path="/stake" element={<Stake />} />
                  <Route path="/chainsplain-me" element={<Chainsplain />} />
                  {/* <Route path="/spl" element={<Spl />} /> */}
                  <Route path="/wallets" element={<Wallets />} />
                  <Route path="/research" element={<Research />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/whalescale" element={<Whalescale />} /> 
                  <Route path="/chainsplainoor" element={<Chainsplainoor />} /> 
                  <Route path="/fingerprinting" element={<TokenFingerprinting />} /> 
                  {/* <Route path="/rugs" element={<Rugs />} />  */}
                </Routes>
                <Footer />
              </Wallet>
            </Router>
          </Container>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
