import { motion } from 'framer-motion';

function Home() {
  return (
    <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        className="container flex flex-col"
      >
      <h1 className="text-white font-bold text-[62px] text-center h-screen">
        <span className="opacity-60">Real-time</span> tracking <span className="opacity-60">&amp;</span> analysis
        <br />  <span className="opacity-60">for the Solana blockchain.</span> 
      </h1>
      <ul className="list-disc space-y-2">
        <li>Real-Time Exchange Wallet Tracker (SOL token)</li>
        <li>Event Log for significant exchange inflows/outflows and whale transfers</li>
        <li>Solana Stake Program Event Log</li>
        <li>Charts for locked and non-circulating SOL</li>
        <li>DeFi Wallet Profiler</li>
        <li>Research articles</li>
        <li>Live SOL token unlock schedule</li>
      </ul>
    </motion.div>
  );
}

export default Home;