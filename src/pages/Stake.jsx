import React, { useState, useEffect } from "react";
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
import { Bar } from "react-chartjs-2";

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
  AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from "@mui/system";

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

export const inflowChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Combined Solana Stake Flows by Date",
    },
  },
};

function Stake() {
  const [tab, setTab] = useState(0);
  const [webhookGrid, setWebhookGrid] = useState([]);

  // calls to collect data from the postgres API (gelato.express)
  useEffect(() => {
    getWebhookEvents();
  }, []);
  function getWebhookEvents() {
    fetch(`${URL}/stakeevents`)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        const dataObj = JSON.parse(data);
        // t1.program, t1.type, to_timestamp(t1.blocktime) as dt, t1.signature, t1.authority2, t1.source, t1.destination, t1.uiamount 
        const program = [];
        const type = [];
        const dt = [];
        const signature = [];
        const authority2 = [];
        const source = [];
        const destination = [];
        const uiamount = [];
        dataObj.map((line) => program.push(line.program));
        dataObj.map((line) => type.push(line.type));
        dataObj.map((line) => dt.push(line.dt));
        dataObj.map((line) => signature.push(line.signature));
        dataObj.map((line) => authority2.push(line.authority2));
        dataObj.map((line) => source.push(line.source));
        dataObj.map((line) => destination.push(line.destination));
        dataObj.map((line) => uiamount.push(line.uiamount));

        const grid = dt.map((time, index) => {
          let myObject = {};
          myObject.id = index;
          myObject.program = program[index];
          myObject.type = type[index];
          myObject.dt = time;
          myObject.signature = signature[index];
          myObject.authority2 = authority2[index]  || "-";
          myObject.source = source[index] || "-";
          myObject.destination = destination[index] || "-";
          myObject.uiamount = uiamount[index];
          return myObject;
        });
        setWebhookGrid(grid);
      });
  }

  const formatNumber = (number) => {
    return parseFloat((new Number(number)).toFixed(2)).toLocaleString()
  };
  
  const webhookGridColumns = [
    { field: "program", headerName: "Program", GridColDef: "flex", flex: 1 },
    { field: "type", headerName: "Instruction", GridColDef: "flex", flex: 1 },
    { field: "dt", headerName: "Timestamp", GridColDef: "flex", flex: 1 },
    {
      field: "signature",
      headerName: "Signature",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) => (
        <Link
          color="secondary"
          href={
            "https://solana.fm/tx/" +
            params.row.signature +
            "?cluster=mainnet-qn1"
          }
        >
          {params.row.signature.slice(0, 4)}...
          {params.row.signature.slice(params.row.signature.length - 4)}
        </Link>
      ),
    },
    {
      field: "authority2",
      headerName: "Authority",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) => (
        <Link
          color="secondary"
          href={
            "https://solana.fm/address/" +
            params.row.authority2 +
            "?cluster=mainnet-qn1"
          }
        >
          {params.row.authority2.slice(0, 4)}...
          {params.row.authority2.slice(params.row.authority2.length - 4)}
        </Link>
      ),
    },
    {
      field: "source",
      headerName: "Source",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) => (
        <Link
          color="secondary"
          href={
            "https://solana.fm/address/" +
            params.row.source +
            "?cluster=mainnet-qn1"
          }
        >
          {params.row.source.slice(0, 4)}...
          {params.row.source.slice(params.row.source.length - 4)}
        </Link>
      ),
    },
    {
      field: "destination",
      headerName: "Destination",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) => (
        <Link
          color="secondary"
          href={
            "https://solana.fm/address/" +
            params.row.destination +
            "?cluster=mainnet-qn1"
          }
        >
          {params.row.destination.slice(0, 4)}...
          {params.row.destination.slice(params.row.destination.length - 4)}
        </Link>
      ),
    },
    {
      field: "uiamount",
      headerName: "Amount (SOL)",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) =>
        Math.abs(params.row.uiamount) > 100000
          ? formatNumber(params.row.uiamount) +
            " " +
            String.fromCodePoint("0x1F6A9")
          : formatNumber(params.row.uiamount),
    },
  ];


  // NET INFLOW CHART DATA PULL AND CONFIG
  const [inflowData, setInflowData] = useState([]);

  useEffect(() => {
    getNetInflows();
  }, []);
  function getNetInflows() {
    // exchangeLookup.map(async exchange => {
    fetch(`${URL}/stakechartdata`)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        // transposing the column-based data to x,y (point) form for the 2D scatter plot
        const dataObj = JSON.parse(data);
        const x_data = [];
        const y_data = [];
        const y2_data = [];
        const y3_data = [];
        dataObj.map((line) =>
          x_data.push(new Date(line.date))
          // x_data.push(new Date(line.dt).toISOString().split("T")[0])
        );
        dataObj.map((line) => y_data.push(line.deposit));
        dataObj.map((line) => y2_data.push(line.withdraw));
        dataObj.map((line) => y3_data.push(line.net));

        setInflowData([x_data, y_data, y2_data, y3_data]);
      });
  }

  const labels = inflowData[0];
  const inData = inflowData[1];
  const outData = inflowData[2];
  const netInflowData = inflowData[3];

  const inflowChartData = {
    labels,
    datasets: [
      {
        label: "Deposits",
        data: inData,
        backgroundColor: "#3DDC97",
        stack: "stack1",
      },
      {
        label: "Withdrawals",
        data: outData,
        backgroundColor: "#FF7F50",
        stack: "stack1",
      },
      {
        label: "Net (Deposits - Withdrawals)",
        data: netInflowData,
        backgroundColor: "#FCFCFC",
        stack: "stack0",
      },
    ],
  };

  return (
    <Stack alignItems={"center"}>
      <Tabs value={tab} onChange={(_, val) => setTab(val)}>
        <Tab label="Stake Deposits/Withdrawals" />
        <Tab label="Stake Transfer Log" />
      </Tabs>

      {tab === 0 && (
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
          <Typography variant="h5">Stake Deposits/Withdrawals</Typography>
          <Divider sx={{ marginY: 2 }} />
          <Bar options={inflowChartOptions} data={inflowChartData} />
          <Divider sx={{ marginY: 2 }} />
          <Box sx={{ paddingY: 3 }}>
          <Accordion
            elevation={2}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
            <Typography>About this tool</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                The stake deposits and withdrawals chart shows the sum, by day, of stake and system program instruction called when interacting with stake program (Stake11111111111111111111111111111111111111).
                Currently, the only instructions that are monitored are stake 'withdraw', and system program 'createAccount' and 'createAccountWithSeed', since these are the instructions that change the balances of stake accounts (to my knowledge).
                deposits are the sum of the system instructions explained above, withdrawals are limited to the stake withdraw function. <br />

                This tool is useful as it is more representative of the actual change in total stake for Solana, whereas monitoring activating (stake delegate function) or deactivating (stake deactivate function) stake does not imply that stake is being added or removed. 
              </Typography>
            </AccordionDetails>
          </Accordion>
          </Box>
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
            Stake Transfer Event Log (&gt;10k SOL)
         </Typography>
          <Divider sx={{ marginY: 2 }} />
          <DataGrid
            sx={{ minHeight: '600px' }}
            rows={webhookGrid}
            columns={webhookGridColumns}
            components={{ Toolbar: GridToolbar }}
          />
          <Divider sx={{ marginY: 2 }} />
          </div>
        </Paper>
      )}
    </Stack>
  );
}

export default Stake;
