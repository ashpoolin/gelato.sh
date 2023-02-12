import React, { Component, useState } from 'react';
import { render } from 'react-dom';
// import './style.css';
import { Scatter } from 'react-chartjs-2'

import { mintMap } from "../data/mints.js";
import { exchangeToAddressMap } from "../data/exchanges.js";


const URL = process.env.REACT_APP_API_URL;


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

// PULL THE DATA FROM DB
// async function nabData (coin) {
const nabData = (coin) => {
    // function nabData (coin) {
    // const [exchangeData, setExchangeData] = useState([]);

    let datasetsArray = [];
    let colorIndex = 0;

    for (let [key, value] of exchangeToAddressMap) {
        // console.log(key + " = " + value);
        // }
    // exchangeToAddressMap.forEach(async function(exchange, key) {
        const mint = mintMap.get(coin).mint;
        const decimals = mintMap.get(coin).decimals;
        const scale_factor = mintMap.get(coin).scale_factor;

        // exchangeData.map(async exchange => {
        fetch(`${URL}/${value}/${mint}`) // using new, external exchangeToAddressMap
          // await fetch(`${URL}/${exchange[1]}/${mint}`) // using exchangeData array type
            .then(response => {
              return response.text();
            })
            .then(data => {
              // transposing the column-based data to x,y (point) form for the 2D scatter plot
              const dataObj = JSON.parse(data);
              const x_data = [];
              const y_data = [];
              dataObj.map(line => x_data.push(line.date));
              dataObj.map(line => y_data.push(line.amount / 10 ** (decimals + scale_factor)));
    
              const scatter = x_data.map((date, index) => {
                let myObject = {};
                myObject.x = new Date(date).valueOf();
                myObject.y = y_data[index];
                return myObject
              });
    
              // filters out exchanges with empty data arrays
              if (Object.keys(scatter).length > 0) {
                let color = getRandomColor(colorIndex);
                let myObject = {};
                myObject.label = key;
                // myObject.label = exchange[0];
                myObject.data = scatter;
                myObject.borderColor = `${color}`;
                myObject.pointRadius = 1;
                myObject.pointHoverRadius = 5;
                myObject.fill = false;
                myObject.tension = 0;
                myObject.showLine = true;
                myObject.backgroundColor = `${color}`;
                datasetsArray[colorIndex] = myObject;
                // console.log(`${JSON.stringify(myObject)}`)
                colorIndex += 1;
                datasetsArray.push(myObject); // (!) never pushes data. Array is `null`.
                console.log(JSON.stringify(datasetsArray[0]));
                // setExchangeData(oldExchangeData => [...oldExchangeData, myObject]);
                // setExchangeData(oldExchangeData => [...oldExchangeData, [exchange[0], scatter]]); // old way. (!) I changed data structure of exchangeData
              }
            });
        };
        // });
    return datasetsArray // (!) Here's the problem: always null result. Never populates. don't know why.
    // return exchangeData
}

    // BUILD THE CHART "data" STRUCTURE, SET STATE VARIABLES
    // setSelectedChartData({
    //   // datasets: datasetsArray
    //   datasets: exchangeData
    // });

class SplChart extends Component {





  constructor() {
    super();
    this.coin = 'BONK';      
    
    // this.chartReference = {};
    this.chartReference = React.createRef();
    this.state = {
      name: 'React',
      data: {
        // labels: ['Red', 'Green', 'Blue'],
        // datasets: [{
        //   data: [5, 7, 6],
        //   backgroundColor: ['red', 'green', 'blue']
        // }]
        // datasets: nabData(this.coin)  // The issue: you don't get back values from datasetsArray. WTF
        // datasets: [(nabData(this.coin)).map(objecto => {
            // return objecto
        // })]
        datasets:[{
            label:"kraken",
            data:[{"x":1675516366000,"y":250},{"x":1675729360000,"y":265},{"x":1675942579000,"y":200}],
            borderColor:"#FF7F50",
            pointRadius:1,
            pointHoverRadius:5,
            fill:false,
            tension:0,
            showLine:true,
            backgroundColor:"#FF7F50"
        }]       
      },
      options : {
        responsive: true,
        plugins: {
          legend: {
            position: "right", // as const,
          },
          title: {
            display: true,
            text: "On-Exchange Balances",
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
          // xAxes: [{  // This does nothing. Trying to get data point on chart to show date, not unix time (integer)
          //   type: 'time',
          //   time: { parser: 'YYYY/MM/DD HH:mm:ss' },
          // }],
          x: {
            // type: 'time',
            // time: { parser: 'YYYY/MM/DD HH:mm:ss' },
            ticks: {
              callback: function (value, index, values) {
                return new Date(value).toISOString().split("T")[0];
              },
            },
          },
          y: {
            type: "logarithmic",
            min: 10 ** mintMap.get(this.coin).range_low,
            max: 10 ** mintMap.get(this.coin).range_high,
            ticks: {
              autoSkip: true,
              min: 100,
              callback: function (value, index, values) {
                if (
                  value === 100 ||
                  value === 1000 ||
                  value === 10000 ||
                  value === 100000 ||
                  value === 1000000 ||
                  value === 10000000 ||
                  value === 100000000
                ) {
                  return value;
                }
              },
            },
          },
        },
      }
    };

    // let lineChart = this.reference.chartInstance
    // lineChart.update();
    


        // setInterval(() => {
    //   const chart = this.chartReference.current.chartInstance;
    //   chart.data.datasets[0].data = [
    //     Math.floor(Math.random() * 10) + 1,
    //     Math.floor(Math.random() * 10) + 1, 
    //     Math.floor(Math.random() * 10) + 1
    //   ];
    //   chart.update();
    // }, 2000); 
  }

  async initialize() {
    //   const datasetsResult = await nabData(this.coin);
    //   const db = await initializeDatabase();
    //   const data = await db.fetchUser(this.#id);
    //   const result = await doSomeMoreWork(data);
      this.state.data = {
        datasets: await nabData(this.coin)
        // datasets: datasetsResult
      }
  }

  componentDidMount() {
    console.log(this.chartReference); // returns a Chart.js instance reference
  }

  // I don't think this works. The reference is undefined
  refresh() {
    // const chart = this.chartReference.chartInstance;
    // const chart = this.chartReference.current.chartInstance;
    // const chart = this.chartReference;
    // chart.update();
    let lineChart = this.chartInstance
    lineChart.update();
  }; 

  setCoin(coin) {
    this.coin = coin;
  }
  render() {
    // this.componentDidMount()
    this.initialize();
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // this.refresh();
    return (
        // JSON.stringify(this.state.data)
    //   <Scatter ref={this.chartReference} data={this.state.data} options={this.state.options}/>
      <Scatter ref={(reference) => this.chartReference = reference } data={this.state.data} options={this.state.options}/>
      
    )
  }
}

// why toggling these two recreates the chart????
// render(<SplChart />, document.getElementById('root'));
export default SplChart;