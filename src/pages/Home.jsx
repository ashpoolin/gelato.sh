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
      <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '62px', textAlign:'center' }}>
      <span style={{opacity: '0.6'}}>Real-time</span> tracking <span style={{opacity: '0.6'}}>&amp; </span>analysis
       <br /> <span style={{opacity: '0.6'}}>for the on-chain native.</span> 
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
