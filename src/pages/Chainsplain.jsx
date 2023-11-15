import React, { useState, useCallback } from "react";

// add filtering to tables
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
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
  Button
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from "@mui/system";

import DOMPurify from 'dompurify';
import debounce from "lodash.debounce";
import axios from 'axios';

const URL = process.env.REACT_APP_CHAINSPLAIN_URL;
console.log(`URL = ${URL}`);
function Chainsplain() {
  const [tab, setTab] = useState(0);
  // const [walletBalanceGrid, setWalletBalanceGrid] = useState([]);
  // const [walletLabel, setWalletLabel] = useState('');
  // const [displayAddress, setDisplayAddress] = useState('');
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

  // const chainsplainIt = async (query) => {
  // const chainsplainIt = async () => {
  //   const data = { message: searchQuery };
  //   console.log(data);
  //   axios.post(URL, data, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     }
  //   })
  //   .then(response => {
  //     console.log(response.data);
  //     setSearchResult(response.data)
  //   })
  //   .catch(error => {
  //     console.log(error.response.data);
  //     setSearchResult(error.response.data)
  //   });
  // };

  const chainsplainIt = async () => {
    const data = { message: searchQuery };
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
                Solana Plaintext Data Query 
          </Typography><br />
          <TextField id="standard-basic" style={{width: '800px'}} label="ask the AI a question..." variant="standard" onChange={(e) => debouncedGetAndSet( DOMPurify.sanitize(e.target.value.trim()) )} /><br />
          <Button color="secondary" onClick={() => timeAsyncFunction(chainsplainIt).then(time => setElapsedTime(`Elapsed time: ${time} sec`))}>QUERY</Button>
          <Typography>{searchQuery}</Typography>
          <br /><br />
          {/* <Divider sx={{ marginY: 2 }} /> */}

            <>
            {/* <TextField 
              style={{ height: '600px', width: '800px' }}
              label="Prompt Result:"
              multiline
              value={JSON.stringify(searchResult, null, 2)}

              InputProps={{ disableUnderline: true }}
              inputProps={{ style: { fontSize: 14, padding: 8 } }}
            /> */}
              <Card variant="outlined"> 
                <CardContent>
                  <Button color="secondary" onClick={handleSaveToFile}>Save to file</Button>
                  <Button color="secondary" onClick={handleCopyToClipboard}>Copy to clipboard</Button>
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
              <Box>


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
                  <li>write pseudoSQP</li>
                  <li>Output is structured as a JSON object for the user to easily copy paste into another file, and convert to csv.</li>
                  <li>You can download the output using the buttons at right. </li>
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
