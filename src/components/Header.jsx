import { Link } from "react-router-dom";
import {
  Button,
  AppBar,
  Container,
  Toolbar,
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
        <Button href="/" color="secondary">
          HOME
        </Button>
        <Button href="/sol" color="secondary">
          SOL
        </Button>        
        <Button href="/stake" color="secondary">
          STAKE
        </Button>
        {/* <Button href="/spl" color="secondary">
          SPL
        </Button> */}
        <Button href="/wallets" color="secondary">
          Wallets
        </Button>
        <Button href="/research" color="secondary">
          Research
        </Button>
        <Button href="/about" color="secondary">
          ABOUT
        </Button>
      </Stack>
    </Stack>
  );
}

export default Header;
