import { Card, CardContent, CardMedia, Typography, Link, Paper, Stack } from "@mui/material"; 
import chainsplainImage from '../../assets/chainsplain_example.png';
function Chainsplainoor() { 
 return ( 
 <Paper 
 sx={{ 
 padding: 3, 
 margin: 3, 
 width: "100%", 
 minHeight: "70vh", 
 }} 
 > 
 <Stack spacing={3}> 
 <Typography variant="h4">Chainsplain.me</Typography> 
 <Typography variant="h5">AI-augmented queries on Solana blockchain data.</Typography> 
 <Typography variant="h5">DEVNET Alpha Release</Typography> 
 <Typography>The Devnet alpha release of the Chainsplain.me AI tool occurred on November 20th, 2023. The site is available to demo and use, free-of-charge, for a limited period of time: <Link href="https://www.gelato.sh/chainsplain-me">https://www.gelato.sh/chainsplain-me</Link></Typography> 
 <Typography variant="h5">Abstract</Typography> 
 <Typography>We introduce an AI-augmented data service called "chainsplain.me" that provides specific details and high-level insights on the state of Solana's validators, stake accounts, whale and exchange wallets. The system uses retrieval-augmented generation (RAG) to bolt on peripheral "knowledge" to a large-language model (LLM), which uses a SQL database to answer user queries about the Solana blockchain. Users connect their wallet, provide a query, and pay a small fee for the system to execute the prompt. The system is designed to bridge the knowledge gap between those who can decipher and interpret the chain and the everyday user, providing insights to every Solana user at an accessible cost.</Typography> 
 <Typography variant="h5">Motivation</Typography> 
 <Typography>There is an enormous amount of data generated by the high-throughput blockchain, Solana, which is complex to decipher. There is a significant knowledge gap between those who can read and interpret the chain and the everyday user. The document discusses the development of an AI data retrieval system, "chainsplain.me", to bridge this gap by providing self-service tools that offer insights to every Solana user at an accessible cost.</Typography> 
 <Typography variant="h5">Introduction</Typography> 
 <Typography>Chainsplain.me is an innovative AI-augmented data service that offers both specific details and high-level insights on the state of Solana's validators, stake accounts, whale and exchange wallets. This service is designed to empower users to self-service, answering their pressing questions about addresses and entities on the Solana blockchain. This is achieved without the need for users to possess any specific ability to write SQL queries or have any particular skill in parsing and analyzing on-chain data.</Typography> 
 <Typography variant="h5">How it Works</Typography> 
 <Typography>The system, known as "chainsplain.me", utilizes retrieval-augmented generation (RAG) to append peripheral "knowledge" to a large-language model (LLM). In this context, the knowledge is in the form of a SQL database. The LLM uses this database to answer queries from the user, or "prompts." <br/><br/>

The process begins when the user connects their Solana wallet, with the DEVNET RPC cluster selected. The user then enters a query they would like to ask the blockchain. The data set is fairly narrow, focusing primarily on stake accounts, validators, and whale or exchange wallet balances and transfers. Currently, the system is limited to the SOL token, not the long tail of SPL tokens, due to the vastness of Solana data, however, we fully expect to increase the scope of data supported by the system over time. Example prompts might include "give me the top 5 Solana stakers by total balance" or "what are the details, data center, and active stake for Coinbase Cloud?" The system gives the user the ability to ask questions about the Solana blockchain in plain English. <br/><br/>

Upon clicking the "QUERY" button, a wallet transaction is initiated that will deduct a small amount of SOL (less than $0.10) to pay for the query. Once the transaction is signed by the user and confirmed, the query is forwarded to a relay that brokers the exchange of information with the LLM and database.</Typography> 
<Card>
  <CardMedia
    component="img"
    // height="140"
    image={chainsplainImage}
    alt="Chainsplain Example"
  />
</Card>
 <Typography variant="h5">Tech Stack</Typography> 
 <Typography>The system comprises several key components. The first is the UI/frontend for receiving and displaying query input/output, and a wallet adapter for receiving payment for each query. The second component is the relay, which validates the payment and confirms that the query sent to the server is the one that is paid for. The relay is crucial for preventing denial-of-service and grief attacks against the chainsplain LLM server. The pay-per-use model creates an economic cost to attack the system, prevents cost overruns, while avoiding the need to hold and protect user balances. If all checks pass at the relay, the validated query is forwarded to the chainsplain query engine server. Query transaction signatures are stored (to prevent double-spends), but only the hash of the query--not the query itself--is retained by the system. <br/><br/>

The third component is the query engine server, a Python web app that brokers queries to an LLM. The current model uses connectors provided by Llama Index to interact with the ChatGPT-4 model, which can be replaced if a better model becomes available. The LLM is responsible for converting plain-text queries to SQL queries ("text2sql"), to then fetch from the gelato.sh database tables. The server provides a structured response to the user as a JSON object. <br/><br/></Typography> 
 <Typography variant="h5">The Blockchain Interpretation Layer</Typography> 
 <Typography>Solana, as a high-throughput blockchain, generates enormous amounts of data. Compared to EVM-based transactions, Solana transactions are much more data-rich and complex to decipher. Gelato.sh has identified a significant knowledge gap between those with the capability to decipher and interpret the chain, and the everyday user. While block explorers serve as the eyes to the blockchain, gelato.sh aims to be the interpretation layer--closer to the brain. The goal for building this AI data retrieval system is straightforward: create self-service tools for providing insights to every Solana user, with 24/7 availability, at an accessible cost. The aim is to create an army of self-reliant "chainsplainoors."</Typography> 
 <Typography variant="h5">Future Work</Typography>
 <Typography>With most of the basic operational aspects handled (the front-end, wallet interactions), the focus will now shift to further refinement. The data set is a key area of focus. Data quality, freshness, and breadth are crucial to a useful system. While Gelato has arguably the most complete set of address labels on Solana, these labels need to be verified and refreshed to ensure the integrity of insights produced by the system. <br/><br/>

In terms of retrieval techniques, the system currently works for lower-complexity queries against the database. It is not capable of switching modes (e.g., does this need to call the database, or can it be answered another way), and it cannot do large compound queries well (e.g., SQL joins, windowing, advanced analysis). More time will be dedicated to improving these dimensions of the system. <br/><br/>

Performance is another area of focus. The system works reasonably well, returning prompt results for straightforward queries in under 30 seconds (inclusive of transaction signing + confirmation). However, there are plans to explore ways to bring query times down, either through alternate LLMs and hardware, or more careful dispatch of user prompts. There is a lot to be done here, and it is the expected focus for subsequent versions of the system. <br/><br/></Typography> 
 <Typography variant="h5">Summary</Typography>
 <Typography>We introduced the development of an AI-augmented data service, called "chainsplain.me", which provides insights on the state of Solana's validators, stake accounts, and wallets. This system allows users to ask questions about the Solana blockchain without needing to write SQL queries or have specific skills in parsing and analyzing on-chain data. We discussed the system's operational aspects and key components, which include a user interface for receiving and displaying query input/output, a relay system for validating payments and queries, and a query engine server that brokers queries to a large-language model (LLM) and converts plain-text queries to SQL queries. We propose future refinements to the system, with a focus on improving the data set's quality, freshness, and breadth, enhancing retrieval techniques for more complex queries, and exploring ways to reduce query times for better performance.</Typography> 

<Card variant="outlined"> 
 <CardContent> 
 <Typography variant="h5" component="div"> 
 More Info
 </Typography> 
 <Typography variant="body2">
    The Chainsplain.me AI tool is published open source, under an MIT license. All public resources are shown below:
 </Typography>
 <Typography variant="body2">
 Link: <Link href="https://www.gelato.sh/chainsplain-me">https://www.gelato.sh/chainsplain-me</Link><br/> 
 {/* Redirect: <Link href="https://www.chainsplain.me">https://www.chainsplain.me</Link>  */}
 </Typography>
 <Typography variant="body2">
 Github Repo (gelato.sh): <Link href="https://github.com/ashpoolin/gelato.sh">https://github.com/ashpoolin/gelato.sh</Link> 
 </Typography>
 <Typography variant="body2"> 
 Github Repo (gelato.relay) <Link href="https://github.com/ashpoolin/gelato.relay">https://github.com/ashpoolin/gelato.relay</Link> 
 </Typography>
 <Typography variant="body2"> 
 Github Repo (chainsplain.me query engine) <Link href="https://github.com/ashpoolin/chainsplain.me">https://github.com/ashpoolin/chainsplain.me</Link> 
 </Typography>
 <Typography variant="body2">
 Email: <Link href="mailto:ashpoolin@protonmail.com">ashpoolin@protonmail.com</Link> 
 </Typography> 
 <Typography variant="body2">
 Twitter: <Link href="https://twitter.com/4shpool">@4shpool</Link>
 </Typography> 
 </CardContent> 
 </Card> 
 </Stack> 
 </Paper> 
 ); 
} 
 
export default Chainsplainoor;