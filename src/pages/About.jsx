import { Stack, Typography } from "@mui/material";
import logo from "../assets/gelato-logo.png";
import Footer from "../components/Footer";

function About() {
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
        Serving up insights for the Solana Ecosystem
      </Typography>
      <Typography>
        While there are several premier on-chain intelligence platforms out
        there (Nansen, Arkham), these tools emphasize Ethereum/EVM-based chains,
        and give just a nod to the Solana ecosystem. Solana is a leading chain,
        and it deserves tools that do more than these other platforms currently
        offer. Gelato is unique as it takes a Solana-centric (solanic?) approach
        to handling and presenting data.
      </Typography>
      <Typography>
        While Ethereum's dark forest is mostly well-lit now, Solana users still
        don't enjoy great visibility. Our work tracking down exchange wallets
        and whales on-chain has prepared us to create this product. While other
        tools may try to be everything to everyone, Gelato is more boutique,
        leading you through hand-curated data to inform your path through
        Solana's neon forest.
      </Typography>
      <Footer />
    </Stack>
  );
}

export default About;
