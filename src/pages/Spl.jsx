import React, { useState, useEffect } from "react";




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

import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;
// const URL = "http://localhost:3001" 
// const API_KEY = process.env.REACT_APP_API_KEY;

const formatNumber = (number) => {
  return parseFloat((new Number(number)).toFixed(2)).toLocaleString()
};

function Spl() {
  const [tab, setTab] = useState(0);
  const [poolRatioGrid, setPoolRatioGrid] = useState([]);

  useEffect(() => {
    getPoolRatios();
  }, []);
  async function getPoolRatios() {
  // const getPoolRatios = async () => {

    const { data } = await axios.get(`${URL}/poolratios`);
    const grid = data.map((record, id) => {
      let recordObject = {};
      recordObject.id = id;
      recordObject.address = record.address;
      recordObject.pair = record.pair;
      recordObject.basevalue = record.basevalue;
      recordObject.quotevalue = record.quotevalue;
      recordObject.basebalance = record.basebalance;
      recordObject.quotebalance = record.quotebalance;
      recordObject.ratio2 = record.ratio2;
      recordObject.tvl = record.tvl;
      return recordObject
    });
    setPoolRatioGrid(grid);
  }

  // date,venue,address,pair,base,quote,baseBalance,quoteBalance,basePrice,quotePrice,baseValue,quoteValue,ratio,ratio2,TVL
  const poolRatioGridColumns = [
    {
      field: "pair",
      headerName: "Pair (Base/Quote)",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) => (
          <Link
          color="secondary"
          href={
            "https://solscan.io/account/" +
            params.row.address
          }
          >
          {params.row.pair}
          </Link>
      ),
    },
    {
      field: "basebalance",
      headerName: "Base Balance",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) =>
        formatNumber(params.row.basebalance)
    },
    {
      field: "quotebalance",
      headerName: "Quote Balance",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) =>
        formatNumber(params.row.quotebalance)
    },
    {
      field: "basevalue",
      headerName: "Base Value",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) =>
        "$" + formatNumber(params.row.basevalue)
    },
    {
      field: "quotevalue",
      headerName: "Quote Value",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) =>
        "$" + formatNumber(params.row.quotevalue)
    },
    { 
      field: "ratio2", 
      headerName: "Balance Ratio", 
      GridColDef: "flex", 
      flex: 1,
      renderCell: (params) =>
          formatNumber(params.row.ratio2 * 100) + "%"
    },
    { 
      field: "tvl", 
      headerName: "TVL (USD)", 
      GridColDef: "flex", 
      flex: 1,
      renderCell: (params) =>
        "$" + formatNumber(params.row.tvl),
    },
  ];

  return (
    <Stack alignItems={"center"}>
      <Tabs value={tab} onChange={(_, val) => setTab(val)}>
        <Tab label="AMM Balance Ratios" />
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
                Orca AMM Pool Balance Ratios
          </Typography><br />
          <Divider sx={{ marginY: 2 }} />

            <>
              <DataGrid
                sx={{ minHeight: '600px' }}
                rows={poolRatioGrid}
                columns={poolRatioGridColumns}
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
            <Typography>Pool Balance Ratio Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                The AMM pool balance ratio measures the USD values of the base and quote tokens in an AMM pair, then
                calculates the ratio of the base token to the total (TVL), as follows: <br /><br />

                xxx value = token quantity x price<br />
                TVL = base value + quote value <br />
                balance ratio = base value / TVL <br/><br />

                The balance ratio metric is useful proxy for determining market sentiment of a coin, as well as help identify opportunities, or even risks, associated with the token or AMM pair.
                The base token is typically the more speculative asset, while the quote token is usually in terms of things like USDC, SOL, and ETH.  
                Higher balance ratio indicates a desire in the market to get the harder asset. Lower balance ratio shows that the market may have a lot of confidence in the coin. 
                If there's very low quote balance in the pool, it is likely that the coin is highly disfavored.
                There can be a number of reasons that a pool is out of balance, and for this reason it is most useful to track changes in it over time. For this purpose, charts will be coming soon.  
                <br />
                While we are currently only supporting a few of the major current Orca pools, we will add others like Raydium soon.

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

export default Spl;
