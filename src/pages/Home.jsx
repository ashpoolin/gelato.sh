import { Stack, Typography } from "@mui/material";
import { motion } from 'framer-motion';

function Home() {
  return (
    <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
      >
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      spacing={5}
      sx={{ minHeight: "85vh" }}
    >
      {/* <Typography variant="h1" textAlign={"center"}>
        gelato.sh
      </Typography>
      <img
        src={logo}
        className="gelato.sh"
        alt="logo"
        width={250}
        height={250}
      /> */}
      <Typography variant="h2" textAlign={"center"}>
       Real-time tracking and analysis
       <br /> for the on-chain native. 
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
    </motion.div>
  );
}

export default Home;
