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
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { Box } from "@mui/system";

import DOMPurify from 'dompurify';
import { Connection, LAMPORTS_PER_SOL, StakeProgram } from '@solana/web3.js'
import axios from 'axios';
import { TldParser } from "@onsol/tldparser";
import { getNameOwner, getDomainKey } from "@bonfida/spl-name-service";
import debounce from "lodash.debounce";

const URL = process.env.REACT_APP_API_URL;
// const URL = "http://localhost:3001" 
const HELIUS_RPC_URL = process.env.REACT_APP_HELIUS_RPC_URL;
const CONNECTION = new Connection(HELIUS_RPC_URL, "confirmed");
const STAKE_PROGRAM_ID = StakeProgram.programId;

const formatNumber = (number) => {
  return parseFloat(Number(number).toFixed(2)).toLocaleString()
};

const hasDomainSyntax = (value) => {
  return value.length > 4;
};

function Wallets() {

  // VARIOUS STATES VARIABLES
  const [tab, setTab] = useState(0);
  const [walletBalanceGrid, setWalletBalanceGrid] = useState([]);
  const [totalWalletValue, setTotalWalletValue] = useState(0);
  const [walletLabel, setWalletLabel] = useState('');
  const [stakeWalletLabel, setStakeWalletLabel] = useState('');
  const [displayAddress, setDisplayAddress] = useState('');
  const [stakeDisplayAddress, setStakeDisplayAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [stakeGrid, setStakeGrid] = useState([]);
  const [selectedStakeType, setSelectedStakeType] = useState('all');
  const [selectedStakeKeyType, setSelectedStakeKeyType] = useState('staker');
  const [selectedStakeKeyOffset, setSelectedStakeKeyOffset] = useState(12);
  const [totalStakeBalance, setTotalStakeBalance] = useState(0);
  const [totalStakeActive, setTotalStakeActive] = useState(0);
  const [totalLockedStakeBalance, setTotalLockedStakeBalance] = useState(0);
  const [totalUnlockedStakeBalance, setTotalUnlockedStakeBalance] = useState(0); 

  // stakeAccountOffsetMap.get(programAddress)
  const stakeAccountOffsetMap = new Map([
    ["staker", 12],
    ["withdrawer", 44],
    ["custodian", 92],
    ["voter", 124]
  ]);

  // NAME SERVICE LOOKUP AND INPUT CLEANING... SNS AND ANS DON'T WORK RIGHT YET
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

  // FUNCTIONS AND GRID FOR THE WALLET PROFILER
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

        const payload = {
          jsonrpc: '2.0',
          id: 'helius-test',
          method: 'searchAssets',
          params: {
            ownerAddress: `${address}`,
            tokenType: 'fungible',
            displayOptions: {
              showNativeBalance: true,
            }
          }
        };
        
        let idCounter = 1;
        let walletValue = 0;
        axios.post(HELIUS_RPC_URL, payload)
        .then(response => {
          // GET SOL INFO
          const ownerBalance = response.data.result.nativeBalance.lamports / LAMPORTS_PER_SOL;
          const pricePerSol = response.data.result.nativeBalance.price_per_sol;
          const totalPrice = response.data.result.nativeBalance.total_price;
          const solanaObject = {}
          solanaObject.id = idCounter;
          solanaObject.symbol = "SOL";
          solanaObject.mint = "-";
          solanaObject.address = address;
          solanaObject.balance = ownerBalance;
          solanaObject.price = pricePerSol;
          solanaObject.total = totalPrice;
          setWalletBalanceGrid(prevGrid => [...prevGrid, solanaObject]);
          idCounter++;
          walletValue += totalPrice;
          
          // GET SPL INFO
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
              walletValue += tokenData.total;
            }
          })
          setTotalWalletValue(walletValue);
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

  // Functions for the Stake Account Inspector
  const stakeTypes = ['active', 'all'];
  const handleStakeTypeChange = async(event, newType) => {
    if (newType !== null) {
      setSelectedStakeType(newType);
    }
  };

  const stakeKeyTypes = ['staker', 'withdrawer', 'custodian', 'voter'];
  const handleStakeKeyTypeChange = async(event, newType) => {
    if (newType !== null) {
      setSelectedStakeKeyType(newType);
      setSelectedStakeKeyOffset(stakeAccountOffsetMap.get(newType));
    }
  };

  const getStakeAccountInfo = async () => {
    const timeout = 10000;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout)
    );

    // Create a promise for the getStakeAccountInfo operation
    // const getStakeAccountInfoPromise = new Promise(async (resolve, reject) => {
    //   try {
        setStakeWalletLabel("");
        setStakeGrid([]);
        setStakeDisplayAddress("");
        setTotalStakeBalance(null);
        setTotalStakeActive(null);
        setTotalLockedStakeBalance(null);
        setTotalUnlockedStakeBalance(null);

        // load owner address
        const address = searchQuery;

        // get address label from Gelato express server
        const labelUrl = `${URL}/labels/${address}`;
        // const { labelData } = await axios.get(labelUrl);
        await fetch(labelUrl)
          .then((response) => {
            return response.text();
          })
          .then((labelData) => {
            try {
              const label = JSON.parse(labelData)[0].label;
              setStakeWalletLabel(label);
            } catch {
              setStakeWalletLabel(address);
            }
          });

        const epochInfo = await CONNECTION.getEpochInfo("confirmed");
        const currentEpoch = epochInfo?.epoch;

        let accounts = [];
        const getParsedProgramAccountsPromise = new Promise(async (resolve, reject) => {
          try {
            accounts = await CONNECTION.getParsedProgramAccounts(
              STAKE_PROGRAM_ID,
              {
                filters: [
                  {
                    memcmp: {
                      offset: selectedStakeKeyOffset, // number of bytes
                      bytes: address, // base58 encoded string
                    },
                  },
                ],
              }
            );
            resolve(accounts);
          } catch (error) {
            reject(error);
          }
        });

        try {
          // Race the getParsedProgramAccountsPromise against the timeoutPromise
          const result = await Promise.race([getParsedProgramAccountsPromise, timeoutPromise]);
          // Handle the result
        } catch (error) {
          if (error.message === "Request timed out") {
            // Handle timeout error
            console.log("we timed out");
          } else {
            // Handle other errors
            console.log("general shit the bed error");
          }
        }

        let idCounter = 1;
        let totalBalance = 0;
        let totalStake = 0;
        let totalLockedBalance = 0;
        let totalUnlockedBalance = 0;
        accounts.forEach((account, i) => {
          let stakeAccount = {};
          stakeAccount.id = idCounter;
          stakeAccount.stakePubkey = account.pubkey?.toString();
          stakeAccount.balance = account.account?.lamports / LAMPORTS_PER_SOL;
          stakeAccount.staker =
            account.account.data.parsed.info.meta.authorized?.staker;
          stakeAccount.withdrawer =
            account.account.data.parsed.info.meta.authorized?.withdrawer;
          stakeAccount.custodian =
            account.account.data.parsed.info.meta.lockup?.custodian;
          stakeAccount.unlockEpoch =
            account.account.data.parsed.info.meta.lockup?.epoch;
          const unlockUnixTimestamp =
            account.account.data.parsed.info.meta.lockup?.unixTimestamp;
          stakeAccount.unlockUnixTimestamp = unlockUnixTimestamp;
          stakeAccount.unlockDate = (unlockUnixTimestamp > Math.floor(Date.now() / 1000))
            ? new Date(unlockUnixTimestamp * 1000).toISOString().split("T")[0]
            : null;
          stakeAccount.type = account.account.data.parsed?.type;
          try {
            if (stakeAccount.type === "delegated") {
              let deactivationEpoch =
                account.account.data.parsed.info.stake.delegation
                  ?.deactivationEpoch || null;
              if (currentEpoch <= deactivationEpoch) {
                stakeAccount.stake =
                  account.account.data.parsed.info.stake.delegation?.stake /
                    LAMPORTS_PER_SOL || null;
                stakeAccount.activationEpoch =
                  account.account.data.parsed.info.stake.delegation
                    ?.activationEpoch || null;
                stakeAccount.active = true;
                stakeAccount.deactivationEpoch = null;
                stakeAccount.voter =
                  account.account.data.parsed.info.stake.delegation?.voter ||
                  null;
              } else {
                stakeAccount.stake = null;
                stakeAccount.activationEpoch = null;
                stakeAccount.active = false;
                stakeAccount.deactivationEpoch = deactivationEpoch;
                stakeAccount.voter = null;
              }
            } else {
              stakeAccount.active = false;
            }
          } catch (error) {
            // console.error(error);
          }
          if (selectedStakeType === "active") {
            if (stakeAccount.active) {
              setStakeGrid((prevGrid) => [...prevGrid, stakeAccount]);
              idCounter++;
            }
          } else {
            setStakeGrid((prevGrid) => [...prevGrid, stakeAccount]);
            idCounter++;
          }
          totalBalance += stakeAccount.balance;
          totalStake += stakeAccount.stake;
          if (stakeAccount.unlockDate) {
            totalLockedBalance += stakeAccount.balance;
          } else {
            totalUnlockedBalance += stakeAccount.balance;
          }
        });
        // console.log(JSON.stringify(stakeGrid));
        // setDisplayAddress(address);
        setStakeDisplayAddress(address);
        setTotalStakeBalance(totalBalance);
        setTotalStakeActive(totalStake);
        setTotalLockedStakeBalance(totalLockedBalance);
        setTotalUnlockedStakeBalance(totalUnlockedBalance);
      // } catch (error) {
      //   // Call reject() if the operation fails
      //   reject(error);
      // }
    // });
    // Use Promise.race() to race the timeoutPromise against the getStakeAccountInfoPromise
    // return Promise.race([getStakeAccountInfoPromise, timeoutPromise]);
  };

  const stakeGridColumns = [
    {
      field: "stakePubkey",
      headerName: "Account",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) => (
          params.row.stakePubkey === "-" ? "N/A" :
          <Link
          color="secondary"
          href={
            "https://solana.fm/address/" +
            params.row.stakePubkey +
            "?cluster=mainnet-qn1"
          }
          >
          {params.row.stakePubkey.slice(0, 4)}...
          {params.row.stakePubkey.slice(params.row.stakePubkey.length - 4)}
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
    { field: "type", headerName: "Type", GridColDef: "flex", flex: 1 },
    { field: "active", headerName: "Active", GridColDef: "flex", flex: 1 },
    { 
      field: "stake", 
      headerName: "Stake", 
      GridColDef: "flex", 
      flex: 1,
      renderCell: (params) =>
        Math.abs(params.row.stake) > 1000000
          ? formatNumber(params.row.stake) +
            " " +
            String.fromCodePoint("0x1F6A9")
          : formatNumber(params.row.stake),
    },
    {
      field: "staker",
      headerName: "Staker",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) => (
        <Link
          color="secondary"
          href={
            "https://solana.fm/address/" +
            params.row.staker +
            "?cluster=mainnet-qn1"
          }
        >
          {params.row.staker.slice(0, 4)}...
          {params.row.staker.slice(params.row.staker.length - 4)}
        </Link>
      ),
    },
    {
      field: "withdrawer",
      headerName: "Withdrawer",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) => (
        <Link
          color="secondary"
          href={
            "https://solana.fm/address/" +
            params.row.withdrawer +
            "?cluster=mainnet-qn1"
          }
        >
          {params.row.withdrawer.slice(0, 4)}...
          {params.row.withdrawer.slice(params.row.withdrawer.length - 4)}
        </Link>
      ),
    },
    {
      field: "vote",
      headerName: "Validator",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) => (
        params.row.voter ? (
          <Link
            color="secondary"
            href={
              "https://solana.fm/address/" +
              params.row.voter +
              "?cluster=mainnet-qn1"
            }
          >
            {params.row.voter.slice(0, 4)}...{params.row.voter.slice(params.row.voter.length - 4)}
          </Link>
        ) : (
          <span>Not Delegated</span>
        )
      ),
    },
    // { field: "activationEpoch", headerName: "Activated", GridColDef: "flex", flex: 1 },
    // { field: "deactivationEpoch", headerName: "Deactivated", GridColDef: "flex", flex: 1 },
    { 
      field: "deactivationEpoch", 
      headerName: "Deactivated", 
      GridColDef: "flex", 
      flex: 1,
      renderCell: (params) => {
        <span>{params.row.activationEpoch} / {params.row.deactivationEpoch}</span>
      }
    },
    { field: "unlockDate", headerName: "Unlock Date", GridColDef: "flex", flex: 1 },
  ];

  return (
    <Stack alignItems={"center"}>
      <Tabs value={tab} onChange={(_, val) => setTab(val)}>
        <Tab label="Wallet Profiler" />
        <Tab label="Stake Accounts" />
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
                Fungible Token Balances
          </Typography><br />
          <TextField id="standard-basic" label="Search an address" variant="standard" onChange={(e) => debouncedGetAndSet( DOMPurify.sanitize(e.target.value.trim()) )} />
          <Button color="secondary" onClick={getBalancesFromHelius} sx={{ marginLeft: '20px' }}>SEARCH</Button>
          <br /><br />
          <Divider sx={{ marginY: 2 }} />

            <>
              <Typography variant="h5">
              {walletLabel ? <Link color="secondary" href={"https://solana.fm/address/" + displayAddress + "?cluster=mainnet-qn1"}>{walletLabel}</Link> : <Link color="secondary" href={"https://solana.fm/address/" + displayAddress + "?cluster=mainnet-qn1"}>{displayAddress}</Link>}
              </Typography>
              <Typography>
                    {(totalWalletValue > 0) ? `Total Fungible Token Value (USD): $${formatNumber(totalWalletValue)}` : null}
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
                Beware that this a DeFi balance tracker that only shows 'fungible' tokens, and filters out unidentified mint IDs, compressed and other non-fungible assets (NFTs). We'll add a selector for these in the future. <br />
                Note that the search only accepts wallet owners (not associated token addresses), .sol (Solana Name Service; SNS), and .abc (Alternative Name Service; ANS) <br />
                (!) CAUTION w/ PRICES: IF THE TOKEN PRICE LOOKS WRONG, IT PROBABLY IS. Check a chart for more current info.
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

{tab === 1 && (
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
                Stake Account Inspector
          </Typography><br />
          <TextField
            id="standard-basic"
            label="Search by Staker, Withdrawer, Voter, Custodian"
            variant="standard"
            onChange={(e) => debouncedGetAndSet(DOMPurify.sanitize(e.target.value.trim()))}
          />
          <Button
            color="secondary"
            onClick={async () => {
              try {
                await getStakeAccountInfo();
                // Continue processing if successful...
              } catch (error) {
                if (error.message === 'Request timed out') {
                  // Display timeout message to the UI
                } else {
                  // Handle other errors
                  console.log('An error occurred:', error);
                }
              }
            }}
            sx={{ marginLeft: '20px', marginRight: '20px' }}
          >
            SEARCH
          </Button>
          <ToggleButtonGroup
            color="secondary"
            value={selectedStakeType}
            exclusive
            onChange={handleStakeTypeChange}
            sx={{
              marginRight: '20px',
            }}
          >
            {stakeTypes.map((type) => (
              <ToggleButton key={type} value={type}>
                {type}
              </ToggleButton> 
            ))}
          </ToggleButtonGroup>
          <ToggleButtonGroup
            color="secondary"
            value={selectedStakeKeyType}
            exclusive
            onChange={handleStakeKeyTypeChange}
            sx={{ marginRight: '20px' }}
          >
            {stakeKeyTypes.map((type) => (
              <ToggleButton key={type} value={type}>
                {type}
              </ToggleButton> 
            ))}
          </ToggleButtonGroup>
          <Divider sx={{ marginY: 2 }} />

            <>
                  <Typography variant="h5">
                    {stakeWalletLabel ? <Link color="secondary" href={"https://solana.fm/address/" + stakeDisplayAddress + "?cluster=mainnet-qn1"}>{stakeWalletLabel}</Link> : <Link color="secondary" href={"https://solana.fm/address/" + stakeDisplayAddress + "?cluster=mainnet-qn1"}>{stakeDisplayAddress}</Link>}
                  </Typography>
                  <Typography>
                    {(totalStakeBalance > 0) ? `Stake Account(s) Total Balance: ${formatNumber(totalStakeBalance)}` : null}
                  </Typography>
                  <Typography>
                    {(totalStakeActive > 0) ? `Stake Account(s) Total Active Stake: ${formatNumber(totalStakeActive)}` : null}
                  </Typography>
                  <Typography>
                    {(totalLockedStakeBalance > 0) ? `Stake Account(s) Total Locked Balance: ${formatNumber(totalLockedStakeBalance)}` : null}
                  </Typography>
                  <Typography>
                    {(totalUnlockedStakeBalance > 0) ? `Stake Account(s) Total Unlocked Balance: ${formatNumber(totalUnlockedStakeBalance)}` : null}
                  </Typography>
              <br />
              <DataGrid
                sx={{ minHeight: '600px' }}
                rows={stakeGrid}
                columns={stakeGridColumns}
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
            <Typography>Stake Account Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                1. The tool can search for all stake accounts for a number of parameters. <br />
                2. Choose the rocker button between "active" for only active stake accounts or "all" for all stake accounts <br />
                3. Choose the rocker button between "staker" (Wallet or Stake Authority), "withdrawer" (Withdraw Authority), "custodian" (if there's a lockup), or "voter" (validator delegated vote pubkey) to search for stake accounts by the respective key <br />
                4. Balance and active stake values are is SOL, not Lamports <br />
                5. Type field shows the reported state of the account, typically "delegated" or "initialized" <br />
                6. The "Deactivated" column shows the deactivation epoch for inactive stake accounts. Otherwise it is null<br />
                7. The "Unlock Date" column shows the unlock date for stake accounts with a lockup period. If there is no lockup, it is null<br /> 
              </Typography>
              <br/>
              <Typography>
                For more detail, click on an address link to view the account on a dedicated block explorer: &nbsp;
                <Link
                color="secondary"
                href={
                  "https://solana.fm/address/" +
                  stakeDisplayAddress +
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
