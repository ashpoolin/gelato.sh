import React, { useState, useCallback } from "react";

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
import { CoingeckoTokenList } from '../data/coingecko_sol_tickers_clean.js';
import { Connection, PublicKey } from '@solana/web3.js'
import axios from 'axios';
import { TldParser } from "@onsol/tldparser";
import { getNameOwner, getDomainKey } from "@bonfida/spl-name-service";
import debounce from "lodash.debounce";

const URL = process.env.REACT_APP_API_URL;
// const URL = "http://localhost:3001" 
const HELIUS_RPC_URL = process.env.REACT_APP_HELIUS_RPC_URL;
const CONNECTION = new Connection(HELIUS_RPC_URL, "confirmed");

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
      // const connection = new Connection(`${HELIUS_RPC_URL}`);
      if (!query.endsWith(".sol")) {
        // parses ans domains
        const parser = new TldParser(CONNECTION)
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
          const {registry} = await getNameOwner(CONNECTION, domainKey);
          if (registry && registry.owner) {
            setSearchQuery(registry.owner.toString())
          }
          return;
        } catch {}
      }
    }
    setSearchQuery(query)
  };

  const getBalance = async (address) => {
    const LAMPORTS_PER_SOL = 1_000_000_000;
    const lamports = await CONNECTION.getBalance(new PublicKey(address));
    return lamports / LAMPORTS_PER_SOL;
  }

  const getBalancesFromHelius = async () => {

    setWalletLabel("");
    setWalletBalanceGrid([]);

    // load owner address
    const address = searchQuery;


    // get address label from Gelato express server
    const labelUrl = `${URL}/labels/${address}`
    // const { labelData } = await axios.get(labelUrl);
      await fetch(labelUrl)
      .then((response) => {
        return response.text();
      })
      .then((labelData) => {
        try {
          const label = (JSON.parse(labelData))[0].label
          setWalletLabel(label);
        } catch {
          setWalletLabel(address);
        }
      });

      // get token balances from Helius
        const solanaObject = {}

        // Add the SOL native balance first
        const ownerBalance = await getBalance(address);
        solanaObject.id = 1;
        solanaObject.symbol = "SOL"
        solanaObject.mint = "-"
        solanaObject.address = address
        solanaObject.balance = ownerBalance
        solanaObject.price = "-"
        solanaObject.total = "-"
        setWalletBalanceGrid(prevGrid => [...prevGrid, solanaObject]);

        const payload = {
          jsonrpc: '2.0',
          id: 'helius-test',
          method: 'searchAssets',
          params: {
            ownerAddress: `${address}`,
            tokenType: 'fungible'
          }
        };
        

        let idCounter = 2;
        axios.post(HELIUS_RPC_URL, payload)
        .then(response => {
          response.data.result.items.forEach(asset => {
            
            // don't show me garbage
            if (asset.token_info.symbol !== undefined) {
              const tokenData = {};
              tokenData.id = idCounter; //
              tokenData.symbol = asset.token_info?.symbol;
              tokenData.mint = asset.id
              tokenData.address = asset.token_info?.associated_token_address;
              const balance = asset.token_info?.balance;
              const decimals = asset.token_info?.decimals;
              tokenData.balance = balance ? balance / (10 ** decimals) : undefined;
              tokenData.price = asset.token_info?.price_info?.price_per_token;
              tokenData.total = asset.token_info?.price_info?.total_price;
              setWalletBalanceGrid(prevGrid => [...prevGrid, tokenData]);
              idCounter++;
              // console.log(
                // `${tokenData.id},${tokenData.symbol},${tokenData.mint},${tokenData.address},${tokenData.balance},${tokenData.price},${tokenData.total}`
              // );
            }
          })
        })
        .catch(error => {
          console.error(error);
        });
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
    { 
      field: "price", 
      headerName: "Price (USD)", 
      GridColDef: "flex", 
      flex: 1,
      renderCell: (params) =>
          "$" + formatNumber(params.row.price)
    },
    { 
      field: "total", 
      headerName: "Total (USD)", 
      GridColDef: "flex", 
      flex: 1,
      renderCell: (params) =>
        Math.abs(params.row.total) > 1000000
          ? "$" + formatNumber(params.row.total) +
            " " +
            String.fromCodePoint("0x1F6A9")
          : "$" + formatNumber(params.row.total),
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
                plausible NFT accounts (balance = 1) are both omitted here to prevent clutter. <br />
                Note that the search only accepts wallet owners (not associated token addresses), .sol (Solana Name Service; SNS), and .abc (Alternative Name Service; ANS) <br />
                (!) CAUTION w/ PRICES: IF THE TOKEN PRICE LOOKS WRONG, IT PROBABLY IS. The tracker tries to map token mint IDs to ticker symbol, then to known API handles on Coingecko. 
                The sheer volume of fake/spam tokens on Solana, as well as duplicated tickers, makes correctly reconciling price with the actual token difficult. USER BEWARE!   

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
