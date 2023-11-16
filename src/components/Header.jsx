import { Link } from "react-router-dom";
import {
  Typography,
  Stack,
} from "@mui/material";
import logo from "../assets/gelato-logo.png";

function Header() {
  
  return (
    <Stack
      direction="row"
      alignItems={"center"}
      justifyContent={"space-between"}
      sx={{ width: "100%", marginY: 2 }}
    >
      <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={2}>
        <img src={logo} width={60} height={60} alt="gelato.sh" />
        <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '42px' }}>Gelato</Typography>
      </Stack>
      <Stack direction={"row"} alignItems={"center"} spacing={1}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>HOME</Link>
        <Link to="/sol" style={{ color: 'white', textDecoration: 'none' }}>SOL</Link>
        <Link to="/stake" style={{ color: 'white', textDecoration: 'none' }}>STAKE</Link>
        <Link to="/wallets" style={{ color: 'white', textDecoration: 'none' }}>Wallets</Link>
        <Link to="/research" style={{ color: 'white', textDecoration: 'none' }}>Research</Link>
        <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>ABOUT</Link>
      </Stack>
    </Stack>
  );
}

export default Header;
