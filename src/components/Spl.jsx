import './Spl.css';
// import './Sol.css';
// import { FormControl, InputLabel, NativeSelect } from '@mui/material'
// import { Select, MenuItem, FormHelperText, FormControl, InputLabel } from '@material-ui/core';
import { Select, MenuItem, FormHelperText, FormControl, InputLabel, NativeSelect, Container } from '@mui/material';
import moment from 'moment';
import React, { useState, useEffect, useRef, Component } from 'react';
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
import { Scatter, getDatasetAtEvent } from 'react-chartjs-2';

// add filtering to tables
// import { DataGrid, GridToolbar, GridColDef, renderActionsCell } from '@mui/x-data-grid';

import { mintMap } from './data/mints.js';
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
  const chartRef = useRef();
  const [exchangeData, setExchangeData] = useState([]);
  const [exchangeLookup, setExchangeLookup] = useState([
    ['Binance_hot', '5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9'],
    ['binance_cold', '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'],
    ['bybit', 'AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2'],
    ['coinbase', 'H8sMJSCQxfKiFTCfDR3DUMLPwcRbM61LGFJ8N4dK3WjS'],
    ['coinbase2', '2AQdpHJ2JpcEgPiATUXjQxA8QmafFegfQwSLWSprPicm'],
    ['crypto_com_1', '6FEVkH17P9y8Q9aCkDdPcMDjvj7SVxrTETaYEm8f51Jy'],
    ['crypto_com_2', 'AobVSwdW9BbpMdJvTqeCN4hPAmh4rHm7vwLnQ5ATSyrS'],
    ['gate_io', 'u6PJ8DtQuPFnfmwHbGFULQ4u4EgjDiyYKjVEsynXq2w'],
    ['OKX', '5VCwKtCXgCJ6kit5FybXjvriW3xELsFDhYrPSqtJNmcD'],
    ['huobi', '88xTWZMeKfiTgbfEmPLdsUCQcZinwUfk25EBQZ21XMAZ'],
    ['kraken', 'FWznbcNXWQuHTawe9RxvQ2LdCENssh12dsznf4RiouN5'],
    ['mexc', 'ASTyfSima4LLAdDgoFGkgqoKowG1LZFDr9fAQrg7iaJZ'],
  ]);
  const exchangeLabelMap = new Map();
  exchangeLabelMap.set('5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9', 'Binance_hot');
  exchangeLabelMap.set('9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', 'binance_cold');
  exchangeLabelMap.set('AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2', 'bybit');
  exchangeLabelMap.set('H8sMJSCQxfKiFTCfDR3DUMLPwcRbM61LGFJ8N4dK3WjS', 'coinbase');
  exchangeLabelMap.set('2AQdpHJ2JpcEgPiATUXjQxA8QmafFegfQwSLWSprPicm', 'coinbase2');
  exchangeLabelMap.set('6FEVkH17P9y8Q9aCkDdPcMDjvj7SVxrTETaYEm8f51Jy', 'crypto_com_1');
  exchangeLabelMap.set('AobVSwdW9BbpMdJvTqeCN4hPAmh4rHm7vwLnQ5ATSyrS', 'crypto_com_2');
  exchangeLabelMap.set('u6PJ8DtQuPFnfmwHbGFULQ4u4EgjDiyYKjVEsynXq2w', 'gate_io');
  exchangeLabelMap.set('5VCwKtCXgCJ6kit5FybXjvriW3xELsFDhYrPSqtJNmcD', 'OKX');
  exchangeLabelMap.set('88xTWZMeKfiTgbfEmPLdsUCQcZinwUfk25EBQZ21XMAZ', 'huobi');
  exchangeLabelMap.set('FWznbcNXWQuHTawe9RxvQ2LdCENssh12dsznf4RiouN5', 'kraken');
  exchangeLabelMap.set('ASTyfSima4LLAdDgoFGkgqoKowG1LZFDr9fAQrg7iaJZ', 'mexc');


  const [selectedCoin, setSelectedCoin] = useState('BONK');
  const [selectedRangeLow, setSelectedRangeLow] = useState(0);
  const [selectedRangeHigh, setSelectedRangeHigh] = useState(4);
  const [selectedOptions, setSelectedOptions] = useState({});
  // const [selectedChartData, setSelectedChartData] = useState({});
  const [selectedChartData, setSelectedChartData] = useState(
    {
      datasets: {
        label:"coinbase",
        data:{"x":1675126453000,"y":2507.787687944597},
        borderColor:"#46237A",
        pointRadius:1,
        pointHoverRadius:5,
        fill:false,
        tension:0,
        showLine:true,
        backgroundColor:"#46237A"
      }
    }
  );

  // ticker,mint,index,decimals,scale factor,range low (log),range high (log)
  function getRandomColor(index) {
    const colorArray = ['#FF7F50', '#FCFCFC', '#3DDC97', '#46237A', '#256EFF', '#1446a0', '#99D17B', '#3C3C3B', '#B4436C', '#9D8DF1', '#5FAD56', '#4D9078', '#645DD7', '#B3FFFC'];
    // const index = Math.floor(Math.random() * (colorArray.length - 0 + 1) + 0)
    return colorArray[index];
  }
  
  useEffect(() => {
    getExchangeSplData();
  }, []);
  // }); // don't do this --> infinitely queries your db some reason
  function getExchangeSplData() {
    const mint = mintMap.get(selectedCoin).mint;

    // let exchData = [];
    exchangeLookup.map(async exchange => {
      await fetch(`${URL}/${exchange[1]}/${mint}`)
        .then(response => {
          return response.text();
        })
        .then(data => {
          // transposing the column-based data to x,y (point) form for the 2D scatter plot 
          const dataObj = JSON.parse(data);
          const x_data = [];
          const y_data = [];
          const decimals = mintMap.get(selectedCoin).decimals;
          const scale_factor = mintMap.get(selectedCoin).scale_factor;
          const range_low = mintMap.get(selectedCoin).range_low;
          const range_high = mintMap.get(selectedCoin).range_high;
          setSelectedRangeLow(range_low);
          setSelectedRangeHigh(range_high);
          dataObj.map(line => x_data.push(line.date));
          dataObj.map(line => y_data.push(line.amount / 10 ** (decimals + scale_factor)));

          const scatter = x_data.map((date, index) => {
            let myObject = {};
            myObject.x = moment.utc(date).valueOf();
            // myObject.x = moment.utc(date).format('YYYY/MM/DD HH:mm:ss');
            // myObject.x = moment.utc(date).format('YYYY/MM/DD HH:mm:ss'); // new Date(date).valueOf()
            // myObject.x = new Date(date).valueOf();
            myObject.y = y_data[index];
            return myObject
          });
          // exchData.push([exchange[0], scatter]);
          setExchangeData(oldExchangeData => [...oldExchangeData, [exchange[0], scatter]]);
        });
    })

    // let colorIndex = 0;
    // let data = {
    //   datasets:
    //     exchangeData.map(exchange => {
    //       let color = getRandomColor(colorIndex);
    //       let myObject = {};
    //       myObject.label = exchange[0];
    //       myObject.data = exchange[1];
    //       myObject.borderColor = `${color}`;
    //       myObject.pointRadius = 1;
    //       myObject.pointHoverRadius = 5;
    //       myObject.fill = false;
    //       myObject.tension = 0;
    //       myObject.showLine = true;
    //       myObject.backgroundColor = `${color}`;
    //       colorIndex += 1;
    //       return myObject
    //     })
    // }
    // setSelectedChartData({data});

  }

  let colorIndex = 0;
  let data = {
    datasets:
      exchangeData.map(exchange => {
        // if (exchange[1].length !== 0) { // attempt to ignore exchange w/o data, but doesn't work currently
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
        // }
      })
  }

  // function setChartOptions() {
    let options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'right', // as const,
        },
        title: {
          display: true,
          text: 'On-Exchange Balances',
        },
      },
      elements: {
        line: {
          showLine: true,
          backgroundColor: '#FFFFFF'
        },
        point: {
          radius: 5
        },
      },
      scales: {
          // xAxes: [{  // This does nothing. Trying to get data point on chart to show date, not unix time (integer)
          //   type: 'time',
          //   time: { parser: 'YYYY/MM/DD HH:mm:ss' },
          // }],
        x: {
          // type: 'time', 
          // time: { parser: 'YYYY/MM/DD HH:mm:ss' },
          ticks: {
            callback: function (value, index, values) {
              return (new Date(value)).toISOString().split('T')[0];
            }
          }
        },
        y: {
          type: 'logarithmic',
          min: 10 ** (selectedRangeLow),
          max: 10 ** (selectedRangeHigh),
          ticks: {
            autoSkip: true,
            min: 100,
            callback: function (value, index, values) {
              if (value === 100 || value === 1000 || value === 10000 || value === 100000 || value === 1000000 || value === 10000000 || value === 100000000) {
                return value;
              }
            }
          },
        }
      }
    }
    // setSelectedOptions(options);
  // };
  // setChartOptions();

function renderScatter() {
    
    // let ref = useRef(0);
    return (
      <Scatter options={options} data={data} ref={chartRef} />
      // <Scatter options={options} data={data} reference = {(referee) => this.reference = referee} />
      // <Scatter options={options} data={selectedChartData} reference = {(referee) => this.reference = referee} />
    )
  }

  const selectionChangeHandler = (event) => {
    setSelectedCoin(event.target.value);
    setExchangeData([]);
    getExchangeSplData();
  };
    
  return (
    <div id="main-wrapper">
      {/* <div> */}
      <Container maxWidth="lg" style={{ backgroundColor: '#1e2127'}} sx={{ borderRadius: '16px' }}>
        <br/>
        <p><b>{selectedCoin} On-Exchange Balances</b><br /></p>
        {/* <Scatter options={selectedOptions} data={selectedChartData} /> */}
        {/* <p>{JSON.stringify(data)}</p> */}
        {renderScatter()}
        {/* <Scatter options={options} data={selectedChartData.data} /> */}
        <p>y-scale = 1 / 10^{mintMap.get(selectedCoin).scale_factor} <br /><br /></p>
        <p>
          <FormControl style={{ width: '100%' }}>
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
        </p>
      </Container>

      {/* </div> */}
      
      {/* <div> */}
        <Container maxWidth="lg" style={{ backgroundColor: '#1e2127'}} sx={{ borderRadius: '16px' }}>
        <p><br />
          <b>SPL Tokens On-Exchange</b><br />
          As SPL tokens are only marginally represented on most CEXes, this data may be of limited use to you. A much greater volume of SPL tokens are traded
          on-chain, versus larger tokens like SOL, ETH, and BTC. However, CEXes are often used to obscure the actions of whales, particularly with low market cap coins.
          This chart will be most useful when a new token is released, and it's likely to be sent onto an exchange to "provide liquidity." This first major spot inflows
          can be indicative of distribution, and often mark a top, as we saw with coins like GMT on FTX, where both Alameda and Wintermute sent everything around the same time.
        </p>
      {/* </div> */}
      </Container>

      <div id="filler" />
    </div>



  );
}

export default Spl;