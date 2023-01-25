import './Sol.css';
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { TableContainer, Table, TableBody, TableCell, TableRow } from '@mui/material';

const URL = process.env.REACT_APP_API_URL;
// const URL = "http://localhost:3001"

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
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
      scaleLabel: {
          display: true,
          labelString: 'Mean Time Between Stock-Out'
      }
    }
}
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
  const [eventData, setEventData] = useState([]);
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
        const dataArray = [];
        dataObj.map(row => dataArray.push([row.dt, row.slot, row.owner, row.sol, row.delta]));
        setEventData(dataArray);
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
      });
  }

  function getRandomColor() {
    const colorArray = ['#FF7F50','#FCFCFC','#3DDC97','#46237A','#256EFF','#1446a0','#99D17B','#3C3C3B','#B4436C','#9D8DF1','#5FAD56','#4D9078','#4D9078','#645DD7','#B3FFFC'];
    const index = Math.floor(Math.random() * (colorArray.length - 0 + 1) + 0)
    return colorArray[index];
  }

  const data = {
    datasets: 
      exchangeData.map(exchange => {
        let color = getRandomColor();
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
        return myObject
    })
  }

  function renderTable() {
    return (
      <TableContainer sx={{height: 250}}>
        <Table sx={{height: "max-content"}}   options={{filtering: true}}>
        <TableBody>
          <TableRow>
            <TableCell><b>date</b></TableCell>
            <TableCell><b>slot</b></TableCell>
            <TableCell><b>exchange</b></TableCell>
            <TableCell><b>owner</b></TableCell>
            <TableCell><b>balance</b></TableCell>
            <TableCell><b>change (%)</b></TableCell>
            <TableCell><b>change (SOL)</b></TableCell>
          </TableRow>
        {eventData.map(row => <TableRow><TableCell>{row[0]}</TableCell><TableCell>{row[1]}</TableCell><TableCell>{exchangeLabelMap.get(row[2])}</TableCell><TableCell><a href={"https://solana.fm/address/" + row[2] + "?cluster=mainnet-qn1"}>{row[2].slice(0,4)}...{row[2].slice(row[2].length - 4)}</a></TableCell><TableCell>{row[3]}</TableCell><TableCell>{Math.round(row[4] / row[3] * 100 * 100) / 100}</TableCell><TableCell>{(Math.abs(row[4]) > 100000) ? row[4] + " " + String.fromCodePoint("0x1F6A9"): row[4]}</TableCell></TableRow>)}
        </TableBody>
      </Table>
    </TableContainer>
    );
  }

  function renderExchangeTable() {
    return (
      <TableContainer sx={{height: 250}}>
        <Table sx={{height: "max-content"}}   options={{filtering: true}}>
        <TableBody>
          <TableRow>
            <TableCell><b>exchange</b></TableCell>
            <TableCell><b>address</b></TableCell>
            <TableCell><b>balance</b></TableCell>
            <TableCell><b>share of total (%)</b></TableCell>
          </TableRow>
        {balanceData.map(row => <TableRow><TableCell>{row.label}</TableCell><TableCell><a href={"https://solana.fm/address/" + row.owner + "?cluster=mainnet-qn1"}>{row.owner.slice(0,4)}...{row.owner.slice(row.owner.length - 4)}</a></TableCell><TableCell>{row.latest_balance}</TableCell><TableCell>{Math.round(row.pct_share * 100) / 100}</TableCell></TableRow>)}
        </TableBody>
      </Table>
    </TableContainer>
    );
  }

  return (
    <div id="main-wrapper">
      <div>
        <Scatter options={options} data={data} />
      </div>
      <div>
        <p><br/>
          <b>Why exchange inflows?</b><br />
          Tracking coin balances on exchanges can give a clue into what's happening with token 
          distribution. While not a guarantee, large inflows may foreshadow ensuing volatility and selling, while outflows
          could signify a buyer has been accumulating. 
        </p>
      </div>
      <div id="table-wrapper">
        <br/>
        <p><b>Recent Inflow/Outflows (&gt;10k SOL):</b></p>
        {renderTable()}
        <br />
      </div>
      <div id="exch-table-wrapper">
        <br />
        <p><b>On-Exchange Balance Summary (descending):</b></p>
        {renderExchangeTable()}
      </div>
    </div>
  );
}

export default Sol;