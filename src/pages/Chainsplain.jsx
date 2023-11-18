import React, { FC, useState, useCallback } from 'react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction} from '@solana/web3.js';
import { createHash } from '../components/crypto';
import { 
  Card,
  CardContent,
  Link, 
  Stack, 
  Tabs, 
  Tab, 
  Paper, 
  Typography, 
  Divider, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  styled
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from "@mui/system";

import DOMPurify from 'dompurify';
import debounce from "lodash.debounce";
import axios from 'axios';



const URL = process.env.REACT_APP_CHAINSPLAIN_URL;
const SOL_TROLL = process.env.REACT_APP_SOL_TROLL

function Chainsplain() {
  const [tab, setTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [elapsedTime, setElapsedTime] = useState("");

  const debouncedGetAndSet = useCallback(
    debounce(async (query) => await setSearchQuery(query), 750),
    [],
  );

  async function timeAsyncFunction(asyncFunction) {
    return new Promise(async (resolve) => {
      const startTime = performance.now();
      await asyncFunction();
      const endTime = performance.now();
      const elapsedTime = Math.floor((endTime - startTime) / 1000);
      resolve(elapsedTime);
    });
  }

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
  
    const gottaPayTheSOLTroll = useCallback(async (searchString) => {
        if (!publicKey) throw new WalletNotConnectedError();
        const toPublicKey = new PublicKey(SOL_TROLL)
        const lamports = 1000000;
        const hash = createHash('sha256').update(searchString).digest('base64');
        console.log(hash);
        let transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: toPublicKey,
                lamports,
            })
        );
        transaction.add(
          new TransactionInstruction({
            keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
            data: Buffer.from(hash, "utf-8"),
            programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
          })
        )
        
        const {
            context: { slot: minContextSlot },
            value: { blockhash, lastValidBlockHeight }
        } = await connection.getLatestBlockhashAndContext();
  
        const signature = await sendTransaction(transaction, connection, { minContextSlot });
  
        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
        return signature;

    }, [publicKey, sendTransaction, connection]);

  const chainsplainIt = async () => {
    const signature = await gottaPayTheSOLTroll(searchQuery);

    const data = {signature: signature, query: searchQuery };
    console.log(data);

    return axios.post(URL, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      console.log(response.data);
      setSearchResult(response.data)
    })
    .catch(error => {
      console.log(error.response.data);
      setSearchResult(error.response.data)
    });
  };

  const handleSaveToFile = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(searchResult, null, 2)], {type: 'text/plain'});
    element.href = window.URL.createObjectURL(file);
    element.download = "chainsplain.me-query-output.json";
    document.body.appendChild(element);
    element.click();
  }
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(searchResult, null, 2));
  }
  const handleClear = () => {
    setSearchQuery('');
    setSearchResult('');
    setElapsedTime('');

  };
  
  return (
    <Stack alignItems={"center"}>
      <Tabs value={tab} onChange={(_, val) => setTab(val)}>
        <Tab label="Chainsplain.me" />
      </Tabs>

      {tab === 0 && (
        <Paper
          sx={{
            padding: 3,
            margin: 3,
            textAlign: "center",
            width: "100%",
            minHeight: "100%",
          }}
        >
          <div style={{ height: '100%' }}>
          <Typography variant="h5">
                Chainsplain.me (DEVNET) 
          </Typography><br />
          <TextField id="standard-basic" style={{width: '800px'}} label="ask the AI a question..." variant="standard" onChange={(e) => debouncedGetAndSet( DOMPurify.sanitize(e.target.value.trim()) )} /><br />
          <Button color="secondary" onClick={() => timeAsyncFunction(chainsplainIt).then(time => setElapsedTime(`Elapsed time: ${time} sec`))}>QUERY</Button><br/>
          <Typography>{searchQuery}</Typography>
          <br /><br />
            <>
              <Card variant="outlined"> 
                <CardContent>
                  <Button color="secondary" onClick={handleSaveToFile}>Save to file</Button>
                  <Button color="secondary" onClick={handleCopyToClipboard}>Copy to clipboard</Button>
                  <Button color="secondary" onClick={handleClear}>Clear</Button>
                  <Typography>{elapsedTime ? elapsedTime : "0 ms"}</Typography> 
                  <Box 
                    component="div" 
                    // style={{ fontFamily: "Courier", whiteSpace: "pre-wrap" }}
                    style={{ fontFamily: "Courier", whiteSpace: "pre-wrap", textAlign: "left" }}
                  >
                    {JSON.stringify(searchResult, null, 2)}
                  </Box>

                </CardContent> 
              </Card> 
              <Box><br />
          <Typography><i>For a very limited time: requests available on DEVNET (free of charge). Cost per query is 0.001 SOL. Switch your wallet RPC cluster to Devnet, fund it with some SOL (`solana airdrop 1`), and make a plaintext query to the Gelato database. </i></Typography><br />
          <Typography><i><b>(!) DO NOT PAY FEES ON MAINNET-BETA RIGHT NOW. IT WILL TAKE YOUR FEE, BUT WILL NOT COMPLETE THE QUERY AS REQUESTED. ENSURE THE DEVNET CLUSTER IS SELECTED IN YOUR WALLET BEFORE PROCEEDING (!)</b></i></Typography><br />

              </Box>
            </>
          <Divider sx={{ marginY: 2 }} />
          <Accordion
            elevation={2}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
            <Typography>(!) WARNING - READ BEFORE USE</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                WARNING: THIS TOOL IS UNAUDITED, OPEN SOURCE CODE. WHILE THE AMOUNTS OF SOL HANDLED BY THE PROGRAM ARE VERY LOW, FOR YOUR OWN SAFETY: DO NOT CONNECT A WALLET WITH LARGE BALANCES, OR VALUABLE ASSETS TO THIS SITE. USE AN ALTERNATE, BURNER WALLET. USE AT YOUR OWN RISK. <br/><br/>

                <b>Here's the deal:</b>
                <ol>
                  <li>The code is EXPERIMENTAL: there will be bugs. You will have failed requests, cryptic errors--there's a lot of moving parts behind this system!</li>
                  <li>Data can be incorrect. Large-language models often hallucinate, and can present totally incorrect information with high confidence. Always check and confirm the results for what the AI is saying with a block explorer. GELATO.SH IS NOT RESPONSIBLE FOR ANY ACTIONS YOU MAKE AS A RESULT OF INFORMATION PROVIDED BY THE AI ("CHAINSPLAIN").</li>
                  <li>The system is SLOW. Between signing, tx confirmation, and the call to the LLM, queries regularly take 20-60 seconds, more complex and more data may take much longer.</li>
                  <li>Cost is 0.001 SOL per query (about $0.06). This is to compensate for the API and hosting costs required to provide the service. The fee and signing process is also a deterrent to anyone who would try to ring up costs, or DoS the platform.</li>
                  <li>Failed queries are baked into the price. I'd charge more if it was more reliable. NO REFUNDS.</li>
                  <li>You agree to not use this tool for illegal or nefarious purposes.</li>
                  <li>You agree that you are permitted to use this tool. Users from specially designated nations or organizations are not permitted to use the tool. This includes the countries Russia, Cuba, Iran, Democratic Republic of Congo, China, et al.</li>
                </ol>  
              </Typography>
              <br/>
            </AccordionDetails>
          </Accordion>

          <Accordion
            elevation={2}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
            <Typography>How to Use Chainsplain.me</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                This tool is designed to help you understand the data stored on the Solana blockchain. This is only a finite sliver of the data on the chain, primarily focused on SOL whale transfers, stake program history, validator and stake account data. <br/><br/>

                <b>Tips on how to use the tool:</b>
                <ol>
                <li>Queries will fail. Sometimes the AI does not produce coherent SQL queries, and will return empty-handed, probably with cryptic errors.</li>
                  <li>Talk to it like it's a computer. AIs are very literal. You must be specific about exactly what filters to apply, and what fields to include </li>
                  <li>Use the column names and table names for the tables (legend provided in the accordion below) to inquire. </li>
                  <li>write pseudoSQL based on the column names and value descriptions. </li>
                  <li>Output is structured as a JSON object for the user to easily download or copy-paste into another file.</li>
                  <li>You can download the output using the buttons at right. </li>
                </ol>  
              </Typography>
              <br/>
            </AccordionDetails>
          </Accordion>
          
          <Accordion
            elevation={2}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
            <Typography>Query Examples</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                In lieu of better documentation (coming soon) here are some example queries to help you get the idea:<br/><br/>
                <ol>
                <li>please give the count of each transaction type and the sum of the uiamount of each for the past 24 hours from stake_program_event_log</li>
                  <li>what is the name, identity, activestake, data_center_key, latitude, and longitude for Coinbase Cloud?</li>
                  <li>what is the name, identity, activestake, data_center_key, latitude, and longitude for the 5 largest validators ranked by activestake?</li>
                  <li>give the total uiamount for the top 5 destination addresses with type withdraw for the past 24 hours from stake_program_event_log.</li>
                  <li>Give me the address for all label like %Alameda%Staking% from sol_address_defs</li>
                  <li>Give me the top 5 days with the largest unlocks by total balance by date</li>
                </ol>  
              </Typography>
              <br/>
            </AccordionDetails>
          </Accordion>

          
          </div>
        </Paper>
      )}

    </Stack>
  );
}

export default Chainsplain;
