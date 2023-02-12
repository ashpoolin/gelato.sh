// import { FormControl, InputLabel, NativeSelect } from '@mui/material'
// import { Select, MenuItem, FormHelperText, FormControl, InputLabel } from '@material-ui/core';
import {
  FormHelperText,
  FormControl,
  InputLabel,
  NativeSelect,
  Paper,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import React, { useState, useEffect, useRef } from "react";
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
import { Scatter } from "react-chartjs-2";

// add filtering to tables
// import { DataGrid, GridToolbar, GridColDef, renderActionsCell } from '@mui/x-data-grid';

import { mintMap } from "../data/mints.js";
import { exchangeToAddressMap } from "../data/exchanges.js";
import SplChart from "../components/SplChart.jsx"
// import { exchangeSplData } from './data/exchange_spl_data.js'

const URL = process.env.REACT_APP_API_URL;
// const URL = "http://localhost:3001"

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

function Spl() {
  const [selectedCoin, setSelectedCoin] = useState("BONK");

  const selectionChangeHandler = async (event) => {
    // setLockedAndLoaded(false)
    setSelectedCoin(event.target.value);
    // await getExchangeSplData();
    SplChart.render();
  };

  return (
    <Stack spacing={3}>
      <Paper
        sx={{
          padding: 3,
          margin: 3,
          textAlign: "center",
          width: "100%",
          minHeight: "100%",
          // minHeight: "70vh",
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h5">
            {selectedCoin} On-Exchange Balances
          </Typography>
          {/* {lockedAndLoaded ? renderScatter() : <p> loading </p> } */}
          <SplChart />
          {/* {renderScatter()} */}
          {/* <Scatter options={selectedOptions} data={selectedChartData} /> */}
          {/* <p>{JSON.stringify(data)}</p> */}

          {/* <Scatter options={options} data={selectedChartData.data} /> */}
          <Typography>
            y-scale = 1 / 10^{mintMap.get(selectedCoin).scale_factor}
          </Typography>

          <FormControl style={{ width: "100%" }}>
            {/* <FormControl style={{ marginTop: 100, marginLeft: 100 }}> */}
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              SPL Token
            </InputLabel>
            <NativeSelect
              // defaultValue={"BONK"}
              // inputProps={{
              // name: 'Coin',
              // id: 'uncontrolled-native',
              // }}
              value={selectedCoin}
              onChange={selectionChangeHandler}
            >
              <option value={"BONK"}>BONK</option>
              <option value={"USDT"}>USDT</option>
              <option value={"USDC"}>USDC</option>
              <option value={"RAY"}>RAY</option>
              <option value={"SRM"}>SRM</option>
              <option value={"GMT"}>GMT</option>
            </NativeSelect>
            <FormHelperText>Select an SPL token</FormHelperText>
          </FormControl>
          <Typography>
            {/* <p>{`${lockedAndLoaded}`}</p> */}
            {/* <p>{selectedCoin}</p> */}
            {/* {lockedAndLoaded ? JSON.stringify(selectedChartData) : "loading" } */}
            {/* <p>{JSON.stringify(selectedChartData)}</p> */}

          </Typography>
          <Accordion
            elevation={2}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>SPL On-Exchange Balances</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                  As SPL tokens are only marginally represented on most CEXes, this
                data may be of limited use to you. A much greater volume of SPL
                tokens are traded on-chain, versus larger tokens like SOL, ETH, and
                BTC. However, CEXes are often used to obscure the actions of whales,
                particularly with low market cap coins. This chart will be most
                useful when a new token is released, and it's likely to be sent onto
                an exchange to "provide liquidity." This first major spot inflows
                can be indicative of distribution, and often mark a top, as we saw
                with coins like GMT on FTX, where both Alameda and Wintermute sent
                everything around the same time.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default Spl;
