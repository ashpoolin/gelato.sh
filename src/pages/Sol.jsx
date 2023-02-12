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

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "right", // as const,
    },
    title: {
      display: true,
      text: "On-Exchange Balances (SOL)",
    },
  },
  elements: {
    line: {
      showLine: true,
      backgroundColor: "#FFFFFF",
    },
    point: {
      radius: 5,
    },
  },
  scales: {
    x: {
      ticks: {
        callback: function (value, index, values) {
          return new Date(value).toISOString().split("T")[0];
        },
      },
    },
    y: {
      type: "logarithmic",
      min: 10000,
      ticks: {
        autoSkip: true,
        min: 10000,
        callback: function (value, index, values) {
          if (
            value === 10000 ||
            value === 100000 ||
            value === 1000000 ||
            value === 10000000
          ) {
            return value;
          }
        },
      },
    },
  },
};

export const inflowChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Combined Exchange Flows by Date",
    },
  },
};

function Sol() {
  const [tab, setTab] = useState(0);
  const [exchangeData, setExchangeData] = useState([]);
  const [exchangeLookup, setExchangeLookup] = useState([
    ["Binance_hot", "5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9"],
    ["binance_cold", "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"],
    ["bybit", "AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2"],
    ["coinbase", "H8sMJSCQxfKiFTCfDR3DUMLPwcRbM61LGFJ8N4dK3WjS"],
    ["coinbase2", "2AQdpHJ2JpcEgPiATUXjQxA8QmafFegfQwSLWSprPicm"],
    ["crypto_com_1", "6FEVkH17P9y8Q9aCkDdPcMDjvj7SVxrTETaYEm8f51Jy"],
    ["crypto_com_2", "AobVSwdW9BbpMdJvTqeCN4hPAmh4rHm7vwLnQ5ATSyrS"],
    ["gate_io", "u6PJ8DtQuPFnfmwHbGFULQ4u4EgjDiyYKjVEsynXq2w"],
    ["OKX", "5VCwKtCXgCJ6kit5FybXjvriW3xELsFDhYrPSqtJNmcD"],
    ["huobi", "88xTWZMeKfiTgbfEmPLdsUCQcZinwUfk25EBQZ21XMAZ"],
    ["kraken", "FWznbcNXWQuHTawe9RxvQ2LdCENssh12dsznf4RiouN5"],
    ["mexc", "ASTyfSima4LLAdDgoFGkgqoKowG1LZFDr9fAQrg7iaJZ"],
  ]);
  const [balanceData, setBalanceData] = useState([]);
  const exchangeLabelMap = new Map();
  exchangeLabelMap.set(
    "5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9",
    "Binance_hot"
  );
  exchangeLabelMap.set(
    "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    "binance_cold"
  );
  exchangeLabelMap.set("AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2", "bybit");
  exchangeLabelMap.set(
    "H8sMJSCQxfKiFTCfDR3DUMLPwcRbM61LGFJ8N4dK3WjS",
    "coinbase"
  );
  exchangeLabelMap.set(
    "2AQdpHJ2JpcEgPiATUXjQxA8QmafFegfQwSLWSprPicm",
    "coinbase2"
  );
  exchangeLabelMap.set(
    "6FEVkH17P9y8Q9aCkDdPcMDjvj7SVxrTETaYEm8f51Jy",
    "crypto_com_1"
  );
  exchangeLabelMap.set(
    "AobVSwdW9BbpMdJvTqeCN4hPAmh4rHm7vwLnQ5ATSyrS",
    "crypto_com_2"
  );
  exchangeLabelMap.set(
    "u6PJ8DtQuPFnfmwHbGFULQ4u4EgjDiyYKjVEsynXq2w",
    "gate_io"
  );
  exchangeLabelMap.set("5VCwKtCXgCJ6kit5FybXjvriW3xELsFDhYrPSqtJNmcD", "OKX");
  exchangeLabelMap.set("88xTWZMeKfiTgbfEmPLdsUCQcZinwUfk25EBQZ21XMAZ", "huobi");
  exchangeLabelMap.set(
    "FWznbcNXWQuHTawe9RxvQ2LdCENssh12dsznf4RiouN5",
    "kraken"
  );
  exchangeLabelMap.set("ASTyfSima4LLAdDgoFGkgqoKowG1LZFDr9fAQrg7iaJZ", "mexc");

  const [dataGrid, setDataGrid] = useState([]);
  const [webhookGrid, setWebhookGrid] = useState([]);

  // calls to collect data from the postgres API (gelato.express)
  useEffect(() => {
    getExchangeData();
  }, []);
  function getExchangeData() {
    exchangeLookup.map(async (exchange) => {
      await fetch(`${URL}/${exchange[1]}`)
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          // transposing the column-based data to x,y (point) form for the 2D scatter plot
          const dataObj = JSON.parse(data);
          const x_data = [];
          const y_data = [];
          dataObj.map((line) => x_data.push(line.date_trunc));
          dataObj.map((line) => y_data.push(line.solbalance));

          const scatter = x_data.map((date, index) => {
            let myObject = {};
            myObject.x = new Date(date).valueOf();
            myObject.y = y_data[index];
            return myObject;
          });
          // filters out exchanges with empty data arrays
          if (Object.keys(scatter).length > 0) {
            setExchangeData((oldExchangeData) => [
              ...oldExchangeData,
              [exchange[0], scatter],
            ]);
          }
        });
    });
  }

  useEffect(() => {
    getWebhookEvents();
  }, []);
  function getWebhookEvents() {
    fetch(`${URL}/whevents`)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        const dataObj = JSON.parse(data);
        const dt = [];
        const signature = [];
        const from = [];
        const from_label = [];
        const to = [];
        const to_label = [];
        const amount = [];
        dataObj.map((line) => dt.push(line.dt));
        dataObj.map((line) => signature.push(line.signature));
        dataObj.map((line) => from.push(line.from));
        dataObj.map((line) => from_label.push(line.from_label));
        dataObj.map((line) => to.push(line.to));
        dataObj.map((line) => to_label.push(line.to_label));
        dataObj.map((line) => amount.push(line.amount));

        const grid = dt.map((time, index) => {
          let myObject = {};
          myObject.id = index;
          myObject.dt = time;
          myObject.signature = signature[index];
          myObject.from = from[index];
          myObject.from_label = from_label[index] || "-";
          myObject.to = to[index];
          myObject.to_label = to_label[index] || "-";
          myObject.amount = amount[index];
          return myObject;
        });
        setWebhookGrid(grid);
      });
  }

  useEffect(() => {
    getExchangeBalances();
  }, []);
  function getExchangeBalances() {
    fetch(`${URL}/balances`)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        const dataObj = JSON.parse(data);
        setBalanceData(dataObj);

        const label = [];
        const address = [];
        const balance = [];
        const pct_share = [];
        dataObj.map((line) => label.push(line.label));
        dataObj.map((line) => address.push(line.owner));
        dataObj.map((line) => balance.push(line.latest_balance));
        dataObj.map((line) => pct_share.push(line.pct_share));

        const grid = label.map((label_n, index) => {
          let myObject = {};
          myObject.id = index;
          myObject.label = label_n;
          myObject.address = address[index];
          myObject.balance = balance[index];
          myObject.pct_share = pct_share[index];
          return myObject;
        });
        setDataGrid(grid);
      });
  }

  const webhookGridColumns = [
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
    { field: "from_label", headerName: "From", GridColDef: "flex", flex: 1 },
    {
      field: "from",
      headerName: "From Address",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) => (
        <Link
          color="secondary"
          href={
            "https://solana.fm/address/" +
            params.row.from +
            "?cluster=mainnet-qn1"
          }
        >
          {params.row.from.slice(0, 4)}...
          {params.row.from.slice(params.row.from.length - 4)}
        </Link>
      ),
    },
    { field: "to_label", headerName: "To", GridColDef: "flex", flex: 1 },
    {
      field: "to",
      headerName: "To Address",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) => (
        <Link
          color="secondary"
          href={
            "https://solana.fm/address/" +
            params.row.to +
            "?cluster=mainnet-qn1"
          }
        >
          {params.row.to.slice(0, 4)}...
          {params.row.to.slice(params.row.to.length - 4)}
        </Link>
      ),
    },
    {
      field: "amount",
      headerName: "Amount (SOL)",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) =>
        Math.abs(params.row.amount) > 100000
          ? Math.floor(params.row.amount) +
            " " +
            String.fromCodePoint("0x1F6A9")
          : Math.floor(params.row.amount),
    },
  ];

  const balanceGridColumns = [
    { field: "label", headerName: "Exchange", GridColDef: "flex", flex: 1 },
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
    { field: "balance", headerName: "Balance", GridColDef: "flex", flex: 1 },
    {
      field: "pct_share",
      headerName: "% Share",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) => Math.round(params.row.pct_share * 100) / 100,
    },
  ];

  // NET INFLOW CHART DATA PULL AND CONFIG
  const [inflowData, setInflowData] = useState([]);

  useEffect(() => {
    getNetInflows();
  }, []);
  function getNetInflows() {
    // exchangeLookup.map(async exchange => {
    fetch(`${URL}/inflows`)
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
          x_data.push(new Date(line.dt).toISOString().split("T")[0])
        );
        dataObj.map((line) => y_data.push(line.net));
        dataObj.map((line) => y2_data.push(line.inflows));
        dataObj.map((line) => y3_data.push(line.outflows));

        setInflowData([x_data, y_data, y2_data, y3_data]);
      });
  }

  const labels = inflowData[0];
  const netInflowData = inflowData[1];
  const inData = inflowData[2];
  const outData = inflowData[3];

  const inflowChartData = {
    labels,
    datasets: [
      {
        label: "Inflows",
        data: inData,
        backgroundColor: "#FF7F50",
        stack: "stack1",
      },
      {
        label: "Outflows",
        data: outData,
        backgroundColor: "#3DDC97",
        stack: "stack1",
      },
      {
        label: "Net Inflow/Outflow",
        data: netInflowData,
        backgroundColor: "#FCFCFC",
        stack: "stack0",
      },
    ],
  };

  function getRandomColor(index) {
    const colorArray = [
      "#FF7F50",
      "#FCFCFC",
      "#3DDC97",
      "#46237A",
      "#256EFF",
      "#1446a0",
      "#99D17B",
      "#3C3C3B",
      "#B4436C",
      "#9D8DF1",
      "#5FAD56",
      "#4D9078",
      "#645DD7",
      "#B3FFFC",
    ];
    // const index = Math.floor(Math.random() * (colorArray.length - 0 + 1) + 0)
    return colorArray[index];
  }

  let colorIndex = 0;
  const data = {
    datasets: exchangeData.map((exchange) => {
      let color = getRandomColor(colorIndex);
      let myObject = {};
      myObject.label = exchange[0];
      myObject.data = exchange[1];
      myObject.borderColor = `${color}`;
      myObject.pointRadius = 1;
      myObject.pointHoverRadius = 5;
      myObject.fill = false;
      myObject.tension = 0;
      myObject.showLine = true;
      myObject.backgroundColor = `${color}`;
      colorIndex += 1;
      return myObject;
    }),
  };

  const pieData = {
    labels: balanceData.map((row) => row.label),
    datasets: [
      {
        label: "% Share",
        data: balanceData.map((row) => row.pct_share),
        backgroundColor: [
          "#3DDC97",
          "#FF7F50",
          "#FCFCFC",
          "#46237A",
          "#256EFF",
          "#1446a0",
          "#99D17B",
          "#3C3C3B",
          "#B4436C",
          "#9D8DF1",
          "#5FAD56",
          "#4D9078",
          "#4D9078",
          "#645DD7",
          "#B3FFFC",
        ],
        borderColor: ["#15171b"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      title: {
        display: true,
        text: "Exchange % Share (SOL)",
      },
    },
  };

  return (
    <Stack alignItems={"center"}>
      <Tabs value={tab} onChange={(_, val) => setTab(val)}>
        <Tab label="On-Exchange Balances" />
        <Tab label="Whale Transfers" />
        <Tab label="Total Inflows/Outflows" />
        <Tab label="On-Exchange Balance Summary" />
        <Tab label="Percent Share" />
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
          <Typography variant="h5">Solana On-Exchange Balances</Typography>
          <Divider sx={{ marginY: 2 }} />
          <Scatter options={options} data={data} />
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
            <Typography>Why watch exchange balances?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
              Tracking coin balances on exchanges can give a clue into what's
              happening with token distribution. There are various reasons that
              coins move to and from an exchange, and nothing is definite. But
              large inflows may foreshadow ensuing volatility and selling, while
              outflows could signify a buyer has been accumulating.
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
            Whale Transfer Event Log (&gt;10k SOL)
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

      {tab === 2 && (
        <Paper
          sx={{
            padding: 3,
            margin: 3,
            textAlign: "center",
            width: "100%",
            minHeight: "100%",
          }}
        >
          <Typography variant="h5">
            Total Exchange Inflows(+ve)/Outflows(-ve) by Date
          </Typography>
          <Divider sx={{ marginY: 2 }} />
          <Bar options={inflowChartOptions} data={inflowChartData} />
          <Divider sx={{ marginY: 2 }} />
        </Paper>
      )}

      {tab === 3 && (
        <Paper
          sx={{
            padding: 3,
            margin: 3,
            textAlign: "center",
            width: "100%",
            minHeight: "100%",
          }}
        >
          <Typography variant="h5">On-Exchange Balance Summary</Typography>
          <Divider sx={{ marginY: 2 }} />
          <DataGrid
            sx={{ minHeight: '600px' }}
            rows={dataGrid}
            columns={balanceGridColumns}
            components={{ Toolbar: GridToolbar }}
          />
          <Divider sx={{ marginY: 2 }} />
        </Paper>
      )}

      {tab === 4 && (
        <Paper
          sx={{
            padding: 3,
            margin: 3,
            textAlign: "center",
            width: "100%",
            minHeight: "100%",
          }}
        >
          <Typography variant="h5">Percent Share</Typography>
          <Divider sx={{ marginY: 2 }} />
          <Doughnut options={pieOptions} data={pieData} />
          <Divider sx={{ marginY: 2 }} />
        </Paper>
      )}
    </Stack>
  );
}

export default Sol;
