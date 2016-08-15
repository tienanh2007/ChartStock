import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery'
import {Component} from 'react'
import {Line} from "react-chartjs-2"
const HOST = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(HOST);
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
const defaultData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My First dataset",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40],
      spanGaps: false,
    }
  ]
};

class Box extends Component {
  constructor(props) {
    super(props);
    this.state = {stock: defaultData,value:"",stocks: ['MMM','RLYP']};
  }

  getData(stocks){
    let stockData = {
      labels: [],
      datasets: []
    };
    stocks.map( (s) => {
      const color = ""+getRandomColor();
      stockData.datasets.unshift({
        label: s,
        fill: false,
        lineTension: 0.1,
        backgroundColor: color,
        borderColor: color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: color,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [],
        spanGaps: false,
      })
      $.ajax({
        url: 'https://www.quandl.com/api/v3/datasets/WIKI/' + s +
        '.json?api_key=5JariFax996CBUB4cXmY&start_date=2016-01-04',
        type: 'GET',
        async: false,
        success: (data) => {
          data = data.dataset.data;
          console.log('user polls found, data: ');
          console.log(data);
          data.map((today) =>{
            stockData.datasets[0].data.unshift(today[1])
          })
          console.log(stockData)
        },
        error: (err) => {
          console.log(err);
        }
      });
    })
    $.ajax({
      url: 'https://www.quandl.com/api/v3/datasets/WIKI/RLYP' +
      '.json?api_key=5JariFax996CBUB4cXmY&start_date=2016-01-04',
      type: 'GET',
      async: false,
      success: (data) => {
        data = data.dataset.data;
        data.map((today) =>{
          stockData.labels.unshift(today[0])
        })
        this.setState({stock:stockData})
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  componentDidMount(){
    this.getData(this.state.stocks);
    ws.onmessage = (event) => {
      this.setState({stocks:[...this.state.stocks,...JSON.parse(event.data)]},() =>
        this.getData(this.state.stocks)
      )
    };
  }


  submitStock = () => {
    if(this.state.value){
      ws.send(this.state.value)
      this.setState({value:""})
    }
    console.log(this.state.stocks)
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value
    })
  }

  render(){
    return(
      <div>
      <Line data={this.state.stock}/>
      <input value={this.state.value} onChange={this.handleChange}/>
      <button onClick={this.submitStock}>Add a stock</button>
      </div>
    );
  }
}
ReactDOM.render(
  <Box/>,
  document.getElementById('root')
);
