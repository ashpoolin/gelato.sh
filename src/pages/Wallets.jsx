import React, { useState, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// import chart devices
import { Scatter, Bar, Doughnut } from "react-chartjs-2";

// add filtering to tables
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { 
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
import { TokenList } from '../data/solana_tokenlist_short.js';
import { Connection } from '@solana/web3.js'
import axios from 'axios';
import { TldParser } from "@onsol/tldparser";
import { getNameOwner, getDomainKey } from "@bonfida/spl-name-service";
import debounce from "lodash.debounce";

const URL = process.env.REACT_APP_API_URL;
// const URL = "http://localhost:3001" 
const API_KEY = process.env.REACT_APP_API_KEY;

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const formatNumber = (number) => {
  return parseFloat((new Number(number)).toFixed(2)).toLocaleString()
};


const hasDomainSyntax = (value) => {
  return value.length > 4;
};

function Wallets() {
  const [tab, setTab] = useState(0);
  const [walletBalanceGrid, setWalletBalanceGrid] = useState([]);
  const [walletLabel, setWalletLabel] = useState('');
  const [displayAddress, setDisplayAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedGetAndSet = useCallback(
    debounce(async (query) => await getAndSetAddress(query), 750),
    [],
);
  const getAndSetAddress = async (query) => {
    if (query.length < 4) return;
    if (hasDomainSyntax(query) && query.split('.').length >= 2 ){
      const connection = new Connection(`https://rpc.helius.xyz/?api-key=${API_KEY}`);
      if (!query.endsWith(".sol")) {
        // parses ans domains
        const parser = new TldParser(connection)
        try {
          const owner = await parser.getOwnerFromDomainTld(query);
          if (owner) setSearchQuery(owner.toString());
        } catch {}
        return;
      } else {
        // parses spl domain
        try {
          const { pubkey: domainKey } = await getDomainKey(
            query,
            false,
          );
          const {registry} = await getNameOwner(connection, domainKey);
          if (registry && registry.owner) {
            setSearchQuery(registry.owner.toString())
          }
          return;
        } catch {}
      }
    }
    setSearchQuery(query)
  };
  const getBalancesFromHelius = async () => {
    setWalletLabel("");
    const address = searchQuery;
    // const address = "GJRs4FwHtemZ5ZE9x3FNvJ8TMwitKTh21yxdRPqn7npE" 
    const HELIUS_URL = `https://api.helius.xyz/v0/addresses/${address}/balances?api-key=${API_KEY}`
    const LAMPORTS_PER_SOL = 1_000_000_000;

    const { data } = await axios.get(HELIUS_URL);
    // FETCH JUST DOESN'T WORK. ACCESSING ELEMENTS IN OBJECT INCORRECTLY
    // let data = {};
    // fetch(HELIUS_URL)
    // .then((response) => {
    //   return response.text();
    // })
    // .then((apiData) => {
    //   data = JSON.parse(apiData) // probably here... 
    // });

    const labelUrl = `${URL}/labels/${address}`
    // const { labelData } = await axios.get(labelUrl);
      fetch(labelUrl)
      .then((response) => {
        return response.text();
      })
      .then((labelData) => {
        const label = (JSON.parse(labelData))[0].label || address
        setWalletLabel(label);
      });

        const solanaObject = {}
        // Add the SOL native balance first
        solanaObject.id = 9999999;
        solanaObject.symbol = "SOL"
        solanaObject.mint = "-"
        solanaObject.address = address
        solanaObject.balance = data.nativeBalance / LAMPORTS_PER_SOL
        const grid = [];
        grid.push(solanaObject);

        data.tokens.map((token, id) => {
          //Parse the account data
          const tokenAddress = token.tokenAccount;
          const tokenMintAddress = token.mint;
          const tokenBalance = token.amount / (10 ** token.decimals) ; // converted immediately to uiBalance format
          // filter out non-zero and NFT balances (qty = 1)
          if (tokenBalance > 0 || tokenBalance !== 1) {
            let searchField = "address";
            let searchVal = tokenMintAddress;
            for (let i=0 ; i < TokenList.length ; i++)
            {
                if (TokenList[i][searchField] === searchVal) {
                  let myObject = {};
                  myObject.id = id;
                  myObject.symbol = TokenList[i].symbol || "-";
                  myObject.mint = tokenMintAddress;
                  myObject.address = tokenAddress;
                  myObject.balance = tokenBalance;
                  grid.push(myObject)
                } 
            }
          }
        });
        setWalletBalanceGrid(grid);
        setDisplayAddress(address);
  }

  const walletBalanceGridColumns = [
    { field: "symbol", headerName: "Symbol", GridColDef: "flex", flex: 1 },
    {
      field: "mint",
      headerName: "Mint",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) => (
          params.row.mint === "-" ? "N/A" :
          <Link
          color="secondary"
          href={
            "https://solana.fm/address/" +
            params.row.mint +
            "?cluster=mainnet-qn1"
          }
          >
          {params.row.mint.slice(0, 4)}...
          {params.row.mint.slice(params.row.mint.length - 4)}
          </Link>
      ),
    },
    {
      field: "address",
      headerName: "Address",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) => (
        <Link
          color="secondary"
          href={
            "https://solana.fm/address/" +
            params.row.address +
            "?cluster=mainnet-qn1"
          }
        >
          {params.row.address.slice(0, 4)}...
          {params.row.address.slice(params.row.address.length - 4)}
        </Link>
      ),
    },
    {
      field: "balance",
      headerName: "Balance",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) =>
        Math.abs(params.row.balance) > 1000000
          ? formatNumber(params.row.balance) +
            " " +
            String.fromCodePoint("0x1F6A9")
          : formatNumber(params.row.balance),
    },
  ];

  return (
    <Stack alignItems={"center"}>
      <Tabs value={tab} onChange={(_, val) => setTab(val)}>
        <Tab label="Wallet Profiler" />
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
                Balances
          </Typography><br />
          <TextField id="standard-basic" label="Search an address" variant="standard" onChange={(e) => debouncedGetAndSet( DOMPurify.sanitize(e.target.value.trim()) )} />
          <Button color="secondary" onClick={getBalancesFromHelius}>SEARCH</Button>
          <br /><br />
          <Divider sx={{ marginY: 2 }} />

            <>
               <Typography variant="h5">
                {/* {walletLabel} */}
                {walletLabel ? walletLabel : displayAddress}
              </Typography>
              <br />
              <DataGrid
                sx={{ minHeight: '600px' }}
                rows={walletBalanceGrid}
                columns={walletBalanceGridColumns}
                components={{ Toolbar: GridToolbar }}
              />
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
            <Typography>Wallet Balance Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Beware that this a DeFi balance tracker that filters out zero balances, NFTs and anything with balance exactly equal to 1.
                Empty SPL token accounts can be informative, as the account may hold substantial history. However, empty accounts and 
                plausible NFT accounts (balance = 1) are both omitted here to prevent clutter. 
              </Typography>
              <br/>
              <Typography>
                For more detail, view the address on a dedicated block explorer: &nbsp;
                <Link
                color="secondary"
                href={
                  "https://solana.fm/address/" +
                  displayAddress +
                  "?cluster=mainnet-qn1"
                }>solana.fm</Link>
              </Typography>
            </AccordionDetails>
          </Accordion>
          </div>
        </Paper>
      )}

    </Stack>
  );
}

export default Wallets;
