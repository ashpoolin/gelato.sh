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
import { LinkOff } from '@material-ui/icons';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { FC } from 'react';
function Header() {
  const { wallet } = useWallet();

  return (
    <Stack
      direction="row"
      alignItems={"center"}
      justifyContent={"space-between"}
      sx={{ width: "100%", marginY: 2 }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={2}>
        <img src={logo} width={60} height={60} alt="gelato.sh" />
        <Typography variant="h6">gelato.sh</Typography>
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
        <Button href="/chainsplain-me" color="secondary">
          AI
        </Button>
        <Button href="/wallets" color="secondary">
          WALLETS
        </Button>
        <Button href="/research" color="secondary">
          Research
        </Button>
        <Button href="/about" color="secondary">
          ABOUT
        </Button>
        <WalletMultiButton style={{backgroundColor: '#15171b', color: '#3DDC97',  border: '0px solid #2e3472', fontWeight: 'normal', fontSize: 'smaller', textTransform: 'uppercase'}}/>
        {wallet && <WalletDisconnectButton startIcon={<LinkOff />} style={{ marginLeft: 8, backgroundColor: '#15171b', color: '#3DDC97',  border: '0px solid #2e3472', fontWeight: 'normal', textTransform: 'uppercase', fontSize: 'smaller'}} />}
      </Stack>
    </Stack>
  );
}

export default Header;
