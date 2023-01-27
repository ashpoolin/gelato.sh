import './Header.css';
import { Link } from 'react-router-dom';
import {ThemeProvider, Button, createTheme} from '@mui/material';
import logo from './Gelato_Logo-04.png';
const { palette } = createTheme();
const createColor = (mainColor) => palette.augmentColor({ color: { main: mainColor } });
const theme = createTheme({
  palette: {
    teal: createColor('#077c86'),
    mint: createColor('#3DDC97'),
    coral: createColor('#ff7f50'),
    white: createColor('#FFF')
  },
});

function Header() {
  return (
    <ThemeProvider theme={theme}>

    <div className="Header">
      <ul class="list-inline">
        <li><img src={logo} className="HeaderLogo" alt="logo" /></li>
        <li><Button color='mint' variant="outlined" style={{borderRadius: 0}}><Link to="/">HOME</Link></Button></li>
        <li><Button color='mint' variant="outlined" style={{borderRadius: 0}}><Link to="/sol">SOL</Link></Button></li>
        <li><Button color='mint' variant="outlined" style={{borderRadius: 0}}><Link to="/spl">SPL</Link></Button></li>
        <li><Button color='mint' variant="outlined" style={{borderRadius: 0}}><Link to="/research">Research</Link></Button></li>
        <li><Button color='mint' variant="outlined" style={{borderRadius: 0}}><Link to="/about">ABOUT</Link></Button></li>
      </ul>
    </div>
    </ThemeProvider>
  );
}

export default Header;
