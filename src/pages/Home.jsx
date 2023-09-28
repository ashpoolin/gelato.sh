import { Stack, Typography } from "@mui/material";
import logo from "../assets/gelato-logo.png";

function Home() {
  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      spacing={5}
      sx={{ minHeight: "85vh" }}
    >
      <Typography variant="h1" textAlign={"center"}>
        gelato.sh
      </Typography>
      <img
        src={logo}
        className="gelato.sh"
        alt="logo"
        width={250}
        height={250}
      />
      <Typography variant="h4" textAlign={"center"}>
        Situational Awareness for the Solana Ecosystem
      </Typography>
      <ul>
        <li>Real-Time Exchange Wallet Tracker (SOL token)</li>
        <li>Event Log for significant exchange inflows/outflows and whale transfers</li>
        <li>Solana Stake Program Event Log</li>
        <li>Charts for locked and non-circulating SOL</li>
        <li>DeFi Wallet Profiler</li>
        <li>Research articles</li>
        <li>Live SOL token unlock schedule</li>
      </ul>
    </Stack>
  );
}

export default Home;
