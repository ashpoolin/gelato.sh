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
  TimeScale
} from "chart.js";

// import chart devices
import { Scatter, Bar } from "react-chartjs-2";
import 'chartjs-adapter-date-fns'; // Import the date-fns adapter for Chart.js

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
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { Box } from "@mui/system";

// required for pagination
import { 
  Box, 
  // Typography, 
  Select, 
  MenuItem, 
  Pagination 
} from "@mui/material";

function CustomFooter() {
  return null; // This removes the default footer
}

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
  ArcElement,
  TimeScale
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "right", // as const,
    },
    title: {
      display: true,
      text: "Solana Active Stake (SOL)",
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
      type: 'time',
      time: {
        unit: 'day',
        displayFormats: {
          millisecond: 'yyyy-mm-dd hh:mm:ss.SSS',
          second: 'yyyy-MM-dd hh:mm:ss', // cAse SenSitIVe
          minute: 'yyyy-mm-dd hh:mm',
          hour: 'yyyy-mm-dd hh:00',
          day: 'yyyy-mm-dd',
          week: 'yyyy-mm-dd',
          month: 'yyyy-mm',
          quarter: 'yyyy-QQ',
          year: 'yyyy'
        },
        tooltipFormat: 'yyyy-MM-dd hh:mm:ss' // cAse SenSitIVe
      },
      ticks: {
        callback: function(value, index, values) {
          return new Date(value).toISOString().split("T")[0];
        }
      }
    },
    y: {
      type: "linear",
      // min: 10000000,
      // ticks: {
      //   autoSkip: true,
      //   min: 100000000,
      //   // callback: function (value, index, values) {
      //   //   if (
      //   //     value === 10000 ||
      //   //     value === 100000 ||
      //   //     value === 1000000 ||
      //   //     value === 10000000
      //   //   ) {
      //   //     return value;
      //   //   }
      //   // },
      // },
    },
    y2: {
      type: "linear",
      position: "right",
    },
    y3: {
      type: "linear",
      position: "right",
    }
  },
};

export const supplyOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "right", // as const,
    },
    title: {
      display: true,
      text: "Solana Supply Data (SOL)",
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
      type: 'time',
      time: {
        unit: 'day',
        displayFormats: {
          millisecond: 'yyyy-mm-dd hh:mm:ss.SSS',
          second: 'yyyy-MM-dd hh:mm:ss', // cAse SenSitIVe
          minute: 'yyyy-mm-dd hh:mm',
          hour: 'yyyy-mm-dd hh:00',
          day: 'yyyy-mm-dd',
          week: 'yyyy-mm-dd',
          month: 'yyyy-mm',
          quarter: 'yyyy-QQ',
          year: 'yyyy'
        },
        tooltipFormat: 'yyyy-MM-dd hh:mm:ss' // cAse SenSitIVe
      },
      ticks: {
        callback: function(value, index, values) {
          return new Date(value).toISOString().split("T")[0];
        }
      }
    },
    y: {
      type: "linear",
    },
    y2: {
      type: "linear",
      position: "right",
    },
    y3: {
      type: "linear",
      position: "right",
    }
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
      text: "Combined Solana Stake Flows by Date",
    },
  },
};

export const unlockChartOptions = {
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
  scales: {
    y: {
      type: "linear",
      // min: 390000000,
      // max: 550000000,
    },
    y2: {
      type: "linear",
      position: "right",
    },
  },
};





const formatNumber = (number) => {
  return parseFloat((new Number(number)).toFixed(2)).toLocaleString()
};

function Stake() {
  const [tab, setTab] = useState(0);

  // pagination for stake events
  const [webhookGrid, setWebhookGrid] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // old stuff
  const [ruggerGrid, setRuggerGrid] = useState([]);
  // const [supplyData, setSupplyData] = useState([]);
  const [stakeScatter, setStakeScatter] = useState([]);
  const [supplyScatter, setSupplyScatter] = useState([]);
  const [supplySnapshot, setSupplySnapshot] = useState([]);

  const stakeAxes = ['Total', 'Locked', 'Unlocked'];
  const supplyAxes = ['Total', 'Uncirculating', 'Circulating'];
  const formatNumber = (number) => {
    return parseFloat((new Number(number)).toFixed(2)).toLocaleString()
  };
  function getRandomColor(index) {
    const colorArray = [
      "#FCFCFC",
      "#FF7F50",
      "#3DDC97",
      // "#46237A",
      // "#256EFF",
      // "#1446a0",
      // "#99D17B",
      // "#3C3C3B",
      // "#B4436C",
      // "#9D8DF1",
      // "#5FAD56",
      // "#4D9078",
      // "#645DD7",
      // "#B3FFFC",
    ];
    // const index = Math.floor(Math.random() * (colorArray.length - 0 + 1) + 0)
    return colorArray[index];
  }
  useEffect(() => {
    getStakeData();
  }, []);
  async function getStakeData() {
    // exchangeLookup.map(async (exchange) => {
      await fetch(`${URL}/supply`)
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          // transposing the column-based data to x,y (point) form for the 2D scatter plot
          const dataObj = JSON.parse(data);
          // console.log(JSON.stringify(dataObj));

          const x_data = [];
          const y_data = [];
          const y2_data = [];
          const y3_data = [];
          const y4_data = [];

          // Get the latest (last) item from the object to display in the "Fact Facts" table
          const snapshot = dataObj[ Object.keys(dataObj).pop() ];
          // const snapshot = dataObj[ Object.keys(dataObj).sort().pop() ];
          setSupplySnapshot(snapshot)

          dataObj.map((line) => x_data.push(line.dt));
          dataObj.map((line) => y_data.push(line.active_total));
          dataObj.map((line) => y2_data.push(line.active_locked));
          dataObj.map((line) => y3_data.push(line.active_unlocked));
          const combined_ydata = [y_data, y2_data, y3_data];

          stakeAxes.map((feature, feature_index) => {
            const scatter = x_data.map((date, index) => {
              let myObject = {};
              myObject.x = new Date(date).valueOf();
              myObject.y = combined_ydata[feature_index][index];
              return myObject;
            });
            // console.log(JSON.stringify(scatter));
            // filters out exchanges with empty data arrays
            if (Object.keys(scatter).length > 0) {
              setStakeScatter((oldStakeData) => [
                ...oldStakeData,
                // ['total', scatter],
                [feature, scatter],
              ]);
            }
          });
        // });
    });
  }

  const axesIDs = ['y', 'y2', 'y3']
  let colorIndex = 0;
  const data = {
    datasets: stakeScatter.map((feature) => {
      let color = getRandomColor(colorIndex);
      let myObject = {};
      myObject.label = feature[0];
      myObject.data = feature[1];
      myObject.borderColor = `${color}`;
      myObject.pointRadius = 1;
      myObject.yAxisID = axesIDs[colorIndex];
      // myObject.yAxisID = ((colorIndex == 1) ? 'y2' : 'y');
      myObject.pointHoverRadius = 5;
      myObject.fill = false;
      myObject.tension = 0;
      myObject.showLine = true;
      myObject.backgroundColor = `${color}`;
      colorIndex += 1;
      return myObject;
    }),
  };

  useEffect(() => {
    getSupplyData();
  }, []);
  async function getSupplyData() {
    // exchangeLookup.map(async (exchange) => {
      await fetch(`${URL}/supply`)
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          // transposing the column-based data to x,y (point) form for the 2D scatter plot
          const dataObj = JSON.parse(data);
          // console.log(JSON.stringify(dataObj));

          const x_data = [];
          const y_data = [];
          const y2_data = [];
          const y3_data = [];
          const y4_data = [];
          dataObj.map((line) => x_data.push(line.dt));
          dataObj.map((line) => y_data.push(line.total_supply));
          dataObj.map((line) => y2_data.push(line.noncirculating_supply));
          dataObj.map((line) => y3_data.push(line.circulating_supply));
          // dataObj.map((line) => y4_data.push(line.inflation));
          const combined_ydata = [y_data, y2_data, y3_data];

          supplyAxes.map((feature, feature_index) => {
            const scatter = x_data.map((date, index) => {
              let myObject = {};
              myObject.x = new Date(date).valueOf();
              myObject.y = combined_ydata[feature_index][index];
              return myObject;
            });
            // console.log(JSON.stringify(scatter));
            // filters out exchanges with empty data arrays
            if (Object.keys(scatter).length > 0) {
              setSupplyScatter((oldSupplyData) => [
                ...oldSupplyData,
                // ['total', scatter],
                [feature, scatter],
              ]);
            }
          });
        // });
    });
  }
  colorIndex = 0;
  const supplyData = {
    datasets: supplyScatter.map((feature) => {
      let color = getRandomColor(colorIndex);
      let myObject = {};
      myObject.label = feature[0];
      myObject.data = feature[1];
      myObject.borderColor = `${color}`;
      myObject.pointRadius = 1;
      // myObject.yAxisID = ((colorIndex == 1) ? 'y2' : 'y');
      myObject.yAxisID = axesIDs[colorIndex];
      myObject.pointHoverRadius = 5;
      myObject.fill = false;
      myObject.tension = 0;
      myObject.showLine = true;
      myObject.backgroundColor = `${color}`;
      colorIndex += 1;
      return myObject;
    }),
  };

  // pagination for stake events
  useEffect(() => {
    getWebhookEvents(currentPage, pageSize);
  }, [currentPage, pageSize]);

  function getWebhookEvents(page, limit) {
    fetch(`${URL}/stakeevents?page=${page}&limit=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        const grid = data.data.map((line, index) => ({
          id: (page - 1) * limit + index + 1,
          program: line.program,
          type: line.type,
          dt: line.dt,
          signature: line.signature,
          authority2: line.authority2 || "-",
          source: line.source || "-",
          destination: line.destination || "-",
          uiamount: line.uiamount
        }));
        setWebhookGrid(grid);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error('Error fetching stake events:', error));
  }

  // useEffect(() => {
  //   getWebhookEvents();
  // }, []);
  // function getWebhookEvents() {
  //   fetch(`${URL}/stakeevents`)
  //     .then((response) => {
  //       return response.text();
  //     })
  //     .then((data) => {
  //       const dataObj = JSON.parse(data);
  //       // t1.program, t1.type, to_timestamp(t1.blocktime) as dt, t1.signature, t1.authority2, t1.source, t1.destination, t1.uiamount 
  //       const program = [];
  //       const type = [];
  //       const dt = [];
  //       const signature = [];
  //       const authority2 = [];
  //       const source = [];
  //       const destination = [];
  //       const uiamount = [];
  //       dataObj.map((line) => program.push(line.program));
  //       dataObj.map((line) => type.push(line.type));
  //       dataObj.map((line) => dt.push(line.dt));
  //       dataObj.map((line) => signature.push(line.signature));
  //       dataObj.map((line) => authority2.push(line.authority2));
  //       dataObj.map((line) => source.push(line.source));
  //       dataObj.map((line) => destination.push(line.destination));
  //       dataObj.map((line) => uiamount.push(line.uiamount));

  //       const grid = dt.map((time, index) => {
  //         let myObject = {};
  //         myObject.id = index;
  //         myObject.program = program[index];
  //         myObject.type = type[index];
  //         myObject.dt = time;
  //         myObject.signature = signature[index];
  //         myObject.authority2 = authority2[index]  || "-";
  //         myObject.source = source[index] || "-";
  //         myObject.destination = destination[index] || "-";
  //         myObject.uiamount = uiamount[index];
  //         return myObject;
  //       });
  //       setWebhookGrid(grid);
  //     });
  // }
  
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
            "https://solscan.io/tx/" +
            params.row.signature
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
            "https://solscan.io/account/" +
            params.row.authority2 +
            "#transfers"
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
            "https://solscan.io/account/" +
            params.row.source +
            "#transfers"
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
            "https://solscan.io/account/" +
            params.row.destination +
            "#transfers"
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

  useEffect(() => {
    getStakeRuggers();
  }, []);
  function getStakeRuggers() {
    fetch(`${URL}/ruggers`)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        const dataObj = JSON.parse(data);
        // t1.program, t1.type, to_timestamp(t1.blocktime) as dt, t1.signature, t1.authority2, t1.source, t1.destination, t1.uiamount 
        const identitypubkey = [];
        const voteaccountpubkey = [];
        const commission = [];
        const lastvote = [];
        const delinquent = [];
        const skiprate = [];
        const activestake_validator = [];
        const activestake_sf = [];
        const sf_pct = [];
        dataObj.map((line) => identitypubkey.push(line.identitypubkey));
        dataObj.map((line) => voteaccountpubkey.push(line.voteaccountpubkey));
        dataObj.map((line) => commission.push(line.commission));
        dataObj.map((line) => lastvote.push(line.lastvote));
        dataObj.map((line) => delinquent.push(line.delinquent));
        dataObj.map((line) => skiprate.push(line.skiprate));
        dataObj.map((line) => activestake_validator.push(line.activestake_validator));
        dataObj.map((line) => activestake_sf.push(line.activestake_sf));
        dataObj.map((line) => sf_pct.push(line.sf_pct));

        const grid = identitypubkey.map((identity, index) => {
          let myObject = {};
          myObject.id = index;
          myObject.identitypubkey = identitypubkey[index];
          myObject.voteaccountpubkey = voteaccountpubkey[index];
          myObject.commission = commission[index];
          myObject.lastvote = lastvote[index];
          myObject.delinquent = delinquent[index];
          myObject.skiprate = skiprate[index];
          myObject.activestake_validator = activestake_validator[index];
          myObject.activestake_sf = activestake_sf[index];
          myObject.sf_pct = sf_pct[index];
          return myObject;
        });
        setRuggerGrid(grid);
      });
  }

  const ruggerGridColumns = [
    {
      field: "identitypubkey",
      headerName: "Identity",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) => (
        <Link
          color="secondary"
          href={
            "https://www.validators.app/validators/" + 
            params.row.identitypubkey +
            "??locale=en&network=mainnet"
          }
        >
          {params.row.identitypubkey.slice(0, 4)}...
          {params.row.identitypubkey.slice(params.row.identitypubkey.length - 4)}
        </Link>
      ),
    },
    {
      field: "voteaccountpubkey",
      headerName: "Vote Account",
      GridColDef: "flex",
      flex: 1,
      renderCell: (params) => (
        <Link
          color="secondary"
          href={
            "https://www.validators.app/validators/" +
            params.row.voteaccountpubkey +
            "?locale=en&network=mainnet"
          }
        >
          {params.row.voteaccountpubkey.slice(0, 4)}...
          {params.row.voteaccountpubkey.slice(params.row.voteaccountpubkey.length - 4)}
        </Link>
      ),
    },
    { field: "commission", headerName: "Commission %", GridColDef: "flex", flex: 1 },
    { field: "lastvote", headerName: "Last Vote Slot", GridColDef: "flex", flex: 1 },
    { field: "delinquent", headerName: "Delinquent", GridColDef: "flex", flex: 1 },
    { field: "skiprate", headerName: "Skip Rate", GridColDef: "flex", flex: 1 },
    { field: "activestake_validator", headerName: "Validator Stake", GridColDef: "flex", flex: 1 },
    { field: "activestake_sf", headerName: "SF Stake", GridColDef: "flex", flex: 1 },
    { field: "sf_pct", headerName: "SF % Share", GridColDef: "flex", flex: 1 },
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
          // x_data.push(new Date(line.date))
          x_data.push(new Date(line.date).toISOString().split("T")[0])
        );
        dataObj.map((line) => y_data.push(line.deposit));
        dataObj.map((line) => y2_data.push(line.withdraw));
        dataObj.map((line) => y3_data.push(line.net));

        setInflowData([x_data, y_data, y2_data, y3_data]);
      });
  }

  let labels = inflowData[0];
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

// NET INFLOW CHART DATA PULL AND CONFIG
const [unlockData, setUnlockData] = useState([]);
const [unlockObject, setUnlockObject] = useState([]);



useEffect(() => {
  getUnlocks();
}, []);
function getUnlocks() {
  // exchangeLookup.map(async exchange => {
  fetch(`${URL}/unlocks`)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      // transposing the column-based data to x,y (point) form for the 2D scatter plot
      const dataObj = JSON.parse(data);
      setUnlockObject(dataObj)
      const x_data = [];
      const y_data = [];
      const y2_data = [];
      dataObj.map((line) =>
        // x_data.push(new Date(line.date))
        x_data.push(new Date(line.date_of_unlock).toISOString().split("T")[0])
      );
      // dataObj.map((line) => y_data.push(line.delegated));
      // dataObj.map((line) => y2_data.push(line.delegated_cumulative));
      dataObj.map((line) => y_data.push((+line.balance ?? 0))); // + removes quotes, ?? 0 sets null values to 0 
      dataObj.map((line) => y2_data.push((+line.balance_cumulative ?? 0)));
      setUnlockData([x_data, y_data, y2_data]);
    });
}

labels = unlockData[0];
const dailyUnlocks = unlockData[1];
const cumulativeUnlocks = unlockData[2];

const unlockChartData = {
  labels,
  datasets: [
    {
      label: "Daily",
      data: dailyUnlocks,
      backgroundColor: "#3DDC97",
      stack: "stack0",
      yAxisID: "y"
    },
    {
      label: "Cumulative",
      data: cumulativeUnlocks,
      backgroundColor: "#FF7F50",
      stack: "stack1",
      yAxisID: "y2"
    },
  ],
};



const [unlocksGrid, setUnlocksGrid] = useState([]);


useEffect(() => {
  getLargestUnlocks();
}, []);
function getLargestUnlocks() {
  fetch(`${URL}/largestunlocks`)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      const dataObj = JSON.parse(data);
      // t1.program, t1.type, to_timestamp(t1.blocktime) as dt, t1.signature, t1.authority2, t1.source, t1.destination, t1.uiamount 
      const date = [];
      const amount = [];
      const stakepubkey = [];
      const staker = [];
      const withdrawer = [];
      const custodian = [];
      dataObj.map((line) => date.push(line.date));
      dataObj.map((line) => amount.push(line.amount));
      dataObj.map((line) => stakepubkey.push(line.stakepubkey));
      dataObj.map((line) => staker.push(line.staker));
      dataObj.map((line) => withdrawer.push(line.withdrawer));
      dataObj.map((line) => custodian.push(line.custodian));

      const grid = date.map((time, index) => {
        let myObject = {};
        myObject.id = index;
        myObject.date = date[index];
        myObject.amount = amount[index];
        myObject.stakepubkey = stakepubkey[index] || "-";
        myObject.staker = staker[index] || "-";
        myObject.withdrawer = withdrawer[index]  || "-";
        myObject.custodian = custodian[index] || "-";
        return myObject;
      });
      setUnlocksGrid(grid);
    });
}

const unlocksGridColumns = [
  { 
    field: "date", 
    headerName: "Date", 
    GridColDef: "flex", 
    flex: 1,
    renderCell: (params) =>
    new Date(params.row.date).toISOString().split("T")[0]
  },
  {
    field: "amount",
    headerName: "Amount (SOL)",
    GridColDef: "flex",
    flex: 1,
    renderCell: (params) =>
      Math.abs(params.row.uiamount) > 1000000
        ? formatNumber(params.row.amount) +
          " " +
          String.fromCodePoint("0x1F6A9")
        : formatNumber(params.row.amount),
  },
  {
    field: "stakepubkey",
    headerName: "Stake Pubkey",
    GridColDef: "flex",
    flex: 1,
    renderCell: (params) => (
      <Link
        color="secondary"
        href={
          "https://solscan.io/account/" +
          params.row.stakepubkey +
          "#transfers"
        }
      >
        {params.row.stakepubkey.slice(0, 4)}...
        {params.row.stakepubkey.slice(params.row.stakepubkey.length - 4)}
      </Link>
    ),
  },
  {
    field: "staker",
    headerName: "Stake Authority",
    GridColDef: "flex",
    flex: 1,
    renderCell: (params) => (
      <Link
        color="secondary"
        href={
          "https://solscan.io/account/" +
          params.row.staker +
          "#transfers"
        }
      >
        {params.row.staker.slice(0, 4)}...
        {params.row.staker.slice(params.row.staker.length - 4)}
      </Link>
    ),
  },
  {
    field: "withdrawer",
    headerName: "Withdraw Authority",
    GridColDef: "flex",
    flex: 1,
    renderCell: (params) => (
      <Link
        color="secondary"
        href={
          "https://solscan.io/account/" +
          params.row.withdrawer +
          "#transfers"
        }
      >
        {params.row.withdrawer.slice(0, 4)}...
        {params.row.withdrawer.slice(params.row.withdrawer.length - 4)}
      </Link>
    ),
  },
  {
    field: "custodian",
    headerName: "Custodian",
    GridColDef: "flex",
    flex: 1,
    renderCell: (params) => (
      <Link
        color="secondary"
        href={
          "https://solscan.io/account/" +
          params.row.custodian +
          "#transfers"
        }
      >
        {params.row.custodian.slice(0, 4)}...
        {params.row.custodian.slice(params.row.custodian.length - 4)}
      </Link>
    ),
  },
];

  return (
    <Stack alignItems={"center"}>
      <Tabs 
        value={tab} 
        variant="scrollable"
        scrollButtons="auto"
        onChange={(_, val) => setTab(val)}
      >
        <Tab label="Deposits/Withdrawals" />
        <Tab label="Transfer Log" />
        <Tab label="Active Stake" />
        <Tab label="Supply" />
        <Tab label="Unlocks" />
        {/* <Tab label="Shame" /> */}
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
              components={{
                Toolbar: GridToolbar,
                Footer: CustomFooter
              }}
              paginationMode="server"
              page={currentPage - 1}
              pageSize={pageSize}
              rowCount={totalCount}
              onPageChange={(newPage) => setCurrentPage(newPage + 1)}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              disableSelectionOnClick
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginY: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
              />
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                Results per page:
                <Select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  sx={{ marginLeft: 2, minWidth: 70 }}
                  size="small"
                >
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </Typography>
            </Box>
            <Divider sx={{ marginY: 2 }} />
          </div>
        </Paper>
      )}

      {/* {tab === 1 && (
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
      )} */}

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
          <div style={{ height: '100%' }}>
          <Typography variant="h5">
            Solana Stake Chart
         </Typography>
          <Divider sx={{ marginY: 2 }} />
          {/* <Typography>{stakeScatter.map(feature => console.log(feature))}</Typography> */}
          <Scatter options={options} data={data} />
          {/* <Bar options={supplyChartOptions} data={supplyChartData} /> */}
          <Divider sx={{ marginY: 2 }} />
          </div>
          <Box sx={{ paddingY: 3 }}>
          <Accordion
            elevation={2}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
            <Typography>About this chart</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                This chart display only the active stake, shown as the locked stake, unlocked stake, and the total (locked + unlocked).
                The locked stake is identified as any stake account with a lockup unixTimestamp > current date. Note that the total balance and the delegated stake
                can be greater than the active stake, since a stake account can contain coins that are undelegated, or delegated but inactive.
              </Typography>
            </AccordionDetails>
          </Accordion>
          </Box>
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
          <div style={{ height: '100%' }}>
          <Typography variant="h5">
            Solana Supply Chart
         </Typography>
          <Divider sx={{ marginY: 2 }} />
          {/* <Typography>{stakeScatter.map(feature => console.log(feature))}</Typography> */}
          <Scatter options={supplyOptions} data={supplyData} />
          {/* <Bar options={supplyChartOptions} data={supplyChartData} /> */}
          <Divider sx={{ marginY: 2 }} />
          </div>
          <Box sx={{ paddingY: 3 }}>
          <Accordion
            elevation={2}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
            <Typography>Solana Supply Fast Facts</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <TableContainer component={Paper}>
                  {/* <Table className={classes.table} aria-label="supply snapshot table">*/}
                  <Table aria-label="supply snapshot table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell align="right">Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    <TableRow key="general">
                        <TableCell component="th" scope="row"><b>General Info</b></TableCell>
                        <TableCell align="right"> </TableCell>
                      </TableRow>
                      <TableRow key="date">
                        <TableCell component="th" scope="row">Date</TableCell>
                        <TableCell align="right">{supplySnapshot.dt}</TableCell>
                      </TableRow>
                      <TableRow key="supplyTotal">
                        <TableCell component="th" scope="row">Total Supply</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.total_supply)}</TableCell>
                      </TableRow>
                      <TableRow key="circulatingSupply">
                        <TableCell component="th" scope="row">Circulating Supply</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.circulating_supply)}</TableCell>
                      </TableRow>
                      <TableRow key="nonCirculatingSupply">
                        <TableCell component="th" scope="row">Non-Circulating Supply</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.noncirculating_supply)}</TableCell>
                      </TableRow>
                      <TableRow key="inflation">
                        <TableCell component="th" scope="row">Inflation (%)</TableCell>
                        <TableCell align="right">{supplySnapshot.inflation}</TableCell>
                      </TableRow>
                      <TableRow key="stake">
                        <TableCell component="th" scope="row"><b>Stake Info</b></TableCell>
                        <TableCell align="right"> </TableCell>
                      </TableRow>
                      <TableRow key="balanceTotal">
                        <TableCell component="th" scope="row">Total Balance</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.balance_total)}</TableCell>
                      </TableRow>
                      {/* <TableRow key="delegatedTotal">
                        <TableCell component="th" scope="row">Total Delegated Balance</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.delegated_total)}</TableCell>
                      </TableRow> */}
                      <TableRow key="activeTotal">
                        <TableCell component="th" scope="row">Total Active Balance</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.active_total)}</TableCell>
                      </TableRow>
                      <TableRow key="activatingTotal">
                        <TableCell component="th" scope="row">Total Activating Balance</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.activating_total)}</TableCell>
                      </TableRow>
                      <TableRow key="deactivatingTotal">
                        <TableCell component="th" scope="row">Total Deactivating Balance</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.deactivating_total)}</TableCell>
                      </TableRow>
                      <TableRow key="balanceLocked">
                        <TableCell component="th" scope="row">Locked Balance</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.balance_locked)}</TableCell>
                      </TableRow>
                      {/* <TableRow key="delegatedLocked">
                        <TableCell component="th" scope="row">Locked Delegated Balance</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.delegated_locked)}</TableCell>
                      </TableRow> */}
                      <TableRow key="activeLocked">
                        <TableCell component="th" scope="row">Locked Active Balance</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.active_locked)}</TableCell>
                      </TableRow>
                      <TableRow key="activatingLocked">
                        <TableCell component="th" scope="row">Locked Activating Balance</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.activating_locked)}</TableCell>
                      </TableRow>
                      <TableRow key="deactivatingLocked">
                        <TableCell component="th" scope="row">Locked Deactivating Balance</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.deactivating_locked)}</TableCell>
                      </TableRow>
                      <TableRow key="balanceUnlocked">
                        <TableCell component="th" scope="row">Unlocked Balance</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.balance_unlocked)}</TableCell>
                      </TableRow>
                      {/* <TableRow key="delegatedUnlocked">
                        <TableCell component="th" scope="row">Unlocked Delegated Balance</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.delegated_unlocked)}</TableCell>
                      </TableRow> */}
                      <TableRow key="activeUnlocked">
                        <TableCell component="th" scope="row">Unlocked Active Balance</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.active_unlocked)}</TableCell>
                      </TableRow>
                      <TableRow key="activatingUnlocked">
                        <TableCell component="th" scope="row">Unlocked Activating Balance</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.activating_unlocked)}</TableCell>
                      </TableRow>
                      <TableRow key="deactivatingUnlocked">
                        <TableCell component="th" scope="row">Unlocked Deactivating Balance</TableCell>
                        <TableCell align="right">{formatNumber(supplySnapshot.deactivating_unlocked)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Typography>
            </AccordionDetails>
          </Accordion>
          </Box>
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
            // minHeight: "70vh",
          }}
        >
          <Typography variant="h5">Stake Account Unlock Schedule</Typography>
          <Divider sx={{ marginY: 2 }} />
          <Bar options={unlockChartOptions} data={unlockChartData} />
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
            <Typography>Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
              <h4>Stake Unlocks Chart</h4>
                This chart is generated by taking all stakes accounts and summing the accountBalance fields (using Solana CLI `$ solana stakes`) with a `custodian` and `unixTimestamp` which occurs later than the current date/time. While any user may create locked stake accounts, this practice is mostly done by the Solana Foundation, and has historically been the vehicle for distributing tokens and grants that have time locks or performance stipulations.
              </Typography>
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
            <Typography>Largest Unlocks</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <h4>Largest Unlocks</h4>
                <DataGrid
                  sx={{ minHeight: '600px' }}
                  rows={unlocksGrid}
                  columns={unlocksGridColumns}
                  components={{ Toolbar: GridToolbar }}
                />
              </Typography>
            </AccordionDetails>
          </Accordion>
          </Box>
        </Paper>
      )}
      {/* {tab === 5 && (
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
            Validator Wall of Shame
         </Typography>
          <Divider sx={{ marginY: 2 }} />

          <DataGrid
            sx={{ minHeight: '600px' }}
            rows={ruggerGrid}
            columns={ruggerGridColumns}
            components={{ Toolbar: GridToolbar }}
          />
          <Divider sx={{ marginY: 2 }} />
          <Accordion
            elevation={2}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
            <Typography>Commission Rugging</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <h4></h4>
                This section is dedicated to showing validators that are currently abusing stakers by changing their commission structure to take extraordinary staking reward fees. Commission rugging may entail sneaky tricks like changing the commission rate to 100% for a few epochs, or changing the commission rate to 100% at the end of an epoch, and then switching it back to a realistic rate to avoid detection. <br /><br /> 
                
                There are over 200 "private" (100% commission) validators on Solana, so this list shows only the most plausible commission ruggers. There are likely others, which we will work to find reliable ways to identify them. This list is comprised of ONLY validators that participate in the Solana Foundation stake program and therefore should not be charging greater than 10%. Additionally, we measure the proportion of the validator's total stake contributed by the Solana Foundation, where a higher number indicates a greater likelihood of commission rugging (e.g. no "skin in the game"). <br /><br />  

                Commission Rugging is harmful to the Solana community because it erodes trust in the stake delegation process, and steals resources from both users and the Foundation. Money that would otherwise be spent developing better features and technology to ensure a thriving on-chain economy..
                <br /><br />
                
                The list is generated automatically, and may not be 100% accurate. If your validator is incorrectly flagged please notify me and I may whitelist it.
              </Typography>
            </AccordionDetails>
          </Accordion>
          </div>
        </Paper>
      )} */}
    </Stack>
  );
}

export default Stake;
