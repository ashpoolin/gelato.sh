import './Sol.css';
import React, { useState, useEffect } from 'react';
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
  ArcElement
} from 'chart.js';

// import chart devices
import { Scatter, Bar, Pie, Doughnut } from 'react-chartjs-2';

// add filtering to tables
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';

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
      position: 'right', // as const,
    },
    title: {
      display: true,
      text: 'On-Exchange Balances (SOL)',
    },
  },
  elements: {
    line:{
      showLine: true,
      backgroundColor: '#FFFFFF'
    },
    point:{
        radius: 5
    },
  },
  scales: {
    x: {
        ticks: {
            callback: function(value, index, values) {
                return (new Date(value)).toISOString().split('T')[0];
            }
        }
    },
    y: {
      type: 'logarithmic',
      min: 10000,
      ticks: {
          autoSkip: true,
          min: 10000,
          callback: function (value, index, values) {
              if( value===10000 || value===100000  || value===1000000 || value===10000000){
                  return value;
              }
          }
      },
    }
}
};

export const inflowChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Combined Exchange Flows by Date',
    },
  },
};

function Sol() {

  const [exchangeData, setExchangeData] = useState([]);
  const [exchangeLookup, setExchangeLookup] = useState([
    ['Binance_hot','5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9'],	
    ['binance_cold','9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'],	
    ['bybit','AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2'],	
    ['coinbase','H8sMJSCQxfKiFTCfDR3DUMLPwcRbM61LGFJ8N4dK3WjS'],	
    ['coinbase2','2AQdpHJ2JpcEgPiATUXjQxA8QmafFegfQwSLWSprPicm'],	
    ['crypto_com_1','6FEVkH17P9y8Q9aCkDdPcMDjvj7SVxrTETaYEm8f51Jy'],	
    ['crypto_com_2','AobVSwdW9BbpMdJvTqeCN4hPAmh4rHm7vwLnQ5ATSyrS'],	
    ['gate_io','u6PJ8DtQuPFnfmwHbGFULQ4u4EgjDiyYKjVEsynXq2w'],	
    ['OKX','5VCwKtCXgCJ6kit5FybXjvriW3xELsFDhYrPSqtJNmcD'],	
    ['huobi','88xTWZMeKfiTgbfEmPLdsUCQcZinwUfk25EBQZ21XMAZ'],	
    ['kraken','FWznbcNXWQuHTawe9RxvQ2LdCENssh12dsznf4RiouN5'],	
    ['mexc','ASTyfSima4LLAdDgoFGkgqoKowG1LZFDr9fAQrg7iaJZ'],	
  ]);
  const [balanceData, setBalanceData] = useState([]); 
  const exchangeLabelMap = new Map();
  exchangeLabelMap.set('5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9','Binance_hot');	
  exchangeLabelMap.set('9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM','binance_cold');	
  exchangeLabelMap.set('AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2','bybit');	
  exchangeLabelMap.set('H8sMJSCQxfKiFTCfDR3DUMLPwcRbM61LGFJ8N4dK3WjS','coinbase');	
  exchangeLabelMap.set('2AQdpHJ2JpcEgPiATUXjQxA8QmafFegfQwSLWSprPicm','coinbase2');	
  exchangeLabelMap.set('6FEVkH17P9y8Q9aCkDdPcMDjvj7SVxrTETaYEm8f51Jy','crypto_com_1');	
  exchangeLabelMap.set('AobVSwdW9BbpMdJvTqeCN4hPAmh4rHm7vwLnQ5ATSyrS','crypto_com_2');	
  exchangeLabelMap.set('u6PJ8DtQuPFnfmwHbGFULQ4u4EgjDiyYKjVEsynXq2w','gate_io');	
  exchangeLabelMap.set('5VCwKtCXgCJ6kit5FybXjvriW3xELsFDhYrPSqtJNmcD','OKX');	
  exchangeLabelMap.set('88xTWZMeKfiTgbfEmPLdsUCQcZinwUfk25EBQZ21XMAZ','huobi');	
  exchangeLabelMap.set('FWznbcNXWQuHTawe9RxvQ2LdCENssh12dsznf4RiouN5','kraken');	
  exchangeLabelMap.set('ASTyfSima4LLAdDgoFGkgqoKowG1LZFDr9fAQrg7iaJZ','mexc');

  const [dataGrid, setDataGrid] = useState([]); 
  const [eventGrid, setEventGrid] = useState([]); 

  // calls to collect data from the postgres API (gelato.express)
  useEffect(() => {
    getExchangeData();
  }, []);
  function getExchangeData() {
    exchangeLookup.map(async exchange => {
      await fetch(`${URL}/${exchange[1]}`)
      .then(response => {
        return response.text();
      })
      .then(data => {
        // transposing the column-based data to x,y (point) form for the 2D scatter plot 
        const dataObj = JSON.parse(data);
        const x_data = [];
        const y_data = [];
        dataObj.map(line => x_data.push(line.date_trunc));
        dataObj.map(line => y_data.push(line.solbalance));

        const scatter = x_data.map((date, index) => {
          let myObject = {};
          myObject.x = new Date(date).valueOf();
          myObject.y = y_data[index];
          return myObject
        });
        setExchangeData(oldExchangeData => [...oldExchangeData, [exchange[0], scatter]]);
      });
    })
  }

  useEffect(() => {
    getLatestEvents();
  }, []);
  function getLatestEvents() {
      fetch(`${URL}/events`)
      .then(response => {
        return response.text();
      })
      .then(data => {
        const dataObj = JSON.parse(data);
        const dt = [];
        const slot = [];
        const owner = [];
        const sol = [];
        const delta = [];
        dataObj.map(line => dt.push(line.dt));
        dataObj.map(line => slot.push(line.slot));
        dataObj.map(line => owner.push(line.owner));
        dataObj.map(line => sol.push(line.sol));
        dataObj.map(line => delta.push(line.delta));

        const grid = dt.map((time, index) => {
          let myObject = {};
          myObject.id = index;
          myObject.dt = time;
          myObject.slot = slot[index];
          myObject.owner = owner[index];
          myObject.label = exchangeLabelMap.get(owner[index]);
          myObject.sol = sol[index];
          myObject.delta = delta[index];
          return myObject
        });
        setEventGrid(grid);
      });
  }

  useEffect(() => {
    getExchangeBalances();
  }, []);
  function getExchangeBalances() {
      fetch(`${URL}/balances`)
      .then(response => {
        return response.text();
      })
      .then(data => {
        const dataObj = JSON.parse(data);
        setBalanceData(dataObj);

        const label = [];
        const address = [];
        const balance = [];
        const pct_share = [];
        dataObj.map(line => label.push(line.label));
        dataObj.map(line => address.push(line.owner));
        dataObj.map(line => balance.push(line.latest_balance));
        dataObj.map(line => pct_share.push(line.pct_share));

        const grid = label.map((label_n, index) => {
          let myObject = {};
          myObject.id = index;
          myObject.label = label_n;
          myObject.address = address[index];
          myObject.balance = balance[index];
          myObject.pct_share = pct_share[index];
          return myObject
        });
        setDataGrid(grid);

      });
  }

  // These are the column fields for the MUI grid tables 
  const eventGridColumns = [
    { field: 'dt', headerName: 'Timestamp', GridColDef: 'flex', flex: 1 },
    { field: 'slot', headerName: 'Slot', GridColDef: 'flex', flex: 1 },
    { field: 'label', headerName: 'Label', GridColDef: 'flex', flex: 1 },
    { 
      field: 'owner', 
      headerName: 'Address', 
      GridColDef: 'flex', flex: 1,
      renderCell: (params) => <a href={"https://solana.fm/address/" + params.row.owner + "?cluster=mainnet-qn1"}>{params.row.owner.slice(0,4)}...{params.row.owner.slice(params.row.owner.length - 4)}</a>,
    },
    { field: 'sol', headerName: 'Balance (SOL)', GridColDef: 'flex', flex: 1 },
    { 
      field: 'delta', 
      headerName: 'Balance Change (SOL)', 
      GridColDef: 'flex', 
      flex: 1,
      renderCell: (params) => (Math.abs(params.row.delta) > 100000) ? params.row.delta + " " + String.fromCodePoint("0x1F6A9"): params.row.delta,
    },
  ];

  const balanceGridColumns = [
    { field: 'label', headerName: 'Exchange', GridColDef: 'flex', flex: 1 },
    { 
      field: 'address', 
      headerName: 'Address', 
      GridColDef: 'flex', flex: 1,
      renderCell: (params) => <a href={"https://solana.fm/address/" + params.row.address + "?cluster=mainnet-qn1"}>{params.row.address.slice(0,4)}...{params.row.address.slice(params.row.address.length - 4)}</a>,
    },
    { field: 'balance', headerName: 'Balance', GridColDef: 'flex', flex: 1 },
    { field: 'pct_share', headerName: '% Share', GridColDef: 'flex', flex: 1 },
  ];




// NET INFLOW CHART DATA PULL AND CONFIG
const [inflowData, setInflowData] = useState([]);

  useEffect(() => {
    getNetInflows();
  }, []);
  function getNetInflows() {
    // exchangeLookup.map(async exchange => {
      fetch(`${URL}/inflows`)
      .then(response => {
        return response.text();
      })
      .then(data => {
        // transposing the column-based data to x,y (point) form for the 2D scatter plot 
        const dataObj = JSON.parse(data);
        const x_data = [];
        const y_data = [];
        const y2_data = [];
        const y3_data = [];
        dataObj.map(line => x_data.push((new Date(line.dt)).toISOString().split('T')[0])); 
        dataObj.map(line => y_data.push(line.net));
        dataObj.map(line => y2_data.push(line.inflows));
        dataObj.map(line => y3_data.push(line.outflows));

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
      label: 'Inflows',
      data: inData,
      backgroundColor: '#FF7F50',
      stack: 'stack1'
    },
    {
      label: 'Outflows',
      data: outData,
      backgroundColor: '#3DDC97',
      stack: 'stack1'
    },
    {
      label: 'Net Inflow/Outflow',
      data: netInflowData,
      backgroundColor: '#FCFCFC',
      stack: 'stack0'
    },
  ],
};

  function getRandomColor(index) {
    const colorArray = ['#FF7F50','#FCFCFC','#3DDC97','#46237A','#256EFF','#1446a0','#99D17B','#3C3C3B','#B4436C','#9D8DF1','#5FAD56','#4D9078','#645DD7','#B3FFFC'];
    // const index = Math.floor(Math.random() * (colorArray.length - 0 + 1) + 0)
    return colorArray[index];
  }

  let colorIndex = 0;
  const data = {
    datasets: 
      exchangeData.map(exchange => {
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
        return myObject
    })
  }

  const pieData = {
    labels: balanceData.map(row => row.label),
    datasets: [
      {
        label: '% Share',
        data: balanceData.map(row => row.pct_share),
        backgroundColor: ['#3DDC97','#FF7F50', '#FCFCFC','#46237A','#256EFF','#1446a0','#99D17B','#3C3C3B','#B4436C','#9D8DF1','#5FAD56','#4D9078','#4D9078','#645DD7','#B3FFFC'],
        borderColor: ['#15171b'],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Exchange % Share (SOL)',
      },
    },
  }

  return (
    <div id="main-wrapper">
      <div>
        <p><b>Solana On-Exchange Balances</b><br /></p>
        <Scatter options={options} data={data} />
      </div>
      <div>
        <p><br/>
          <b>Why watch exchange balances?</b><br />
          Tracking coin balances on exchanges can give a clue into what's happening with token 
          distribution. There are various reasons that coins move to and from an exchange, and nothing is definite. 
          But large inflows may foreshadow ensuing volatility and selling, while outflows could signify a buyer has been accumulating. 
        </p>
      </div>
      <div id="table-wrapper">
        <p><b>Recent Inflow/Outflows (&gt;10k SOL)</b></p>
        <DataGrid rows={eventGrid} columns={eventGridColumns} components={{ Toolbar: GridToolbar }} />
        <br />
      </div>
      <div id="inflow-wrapper">
        <br />
        <br />
        <p><b>Total Exchange Inflows(+ve)/Outflows(-ve) by Date</b></p>
        <Bar options={inflowChartOptions} data={inflowChartData} />
      </div>
      <div><br/><p><b>On-Exchange Balance Summary</b></p></div>
      <div class="center" style={{ height: 400 }}>
        {/* <br /> */}
        <DataGrid rows={dataGrid} columns={balanceGridColumns} components={{ Toolbar: GridToolbar }} />
      </div>
      <div class="center">
        <br />
        <p><b>Percent Share</b></p>
          <Doughnut options={pieOptions} data={pieData} />
      </div>
      <div id="filler" />
    </div>
  );
}

export default Sol;