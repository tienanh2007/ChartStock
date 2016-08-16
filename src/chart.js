import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery'
import {Component} from 'react'
import {Line} from "react-chartjs-2"
import {createStore} from 'redux'
import {connect,Provider} from 'react-redux';
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
const stocks = (state = ['MMM'], action) => {
  switch(action.type){
    case 'ADD':
    return [...state,...action.stock];
    default:
    return state;
  }
}
class StockGraph extends Component {
  componentDidMount(){
    ws.onmessage = (event) => {
      this.props.onAdd(JSON.parse(event.data));
    };
  }

  render(){
    return (
      <Line data={this.props.data}/>
    )
  }
}
const mapStateToGraph = (state) => {
  return {
    data: getData(state)
  }
}
const mapDispatchToGraph = (dispatch) => {
  return {
    onAdd: (data) => {
      dispatch({"type":"ADD","stock":data})
    }
  }
}
const DaGraph = connect(
  mapStateToGraph,
  mapDispatchToGraph
)(StockGraph);
const getData = (stocks) => {
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
    },
    error: (err) => {
      console.log(err);
    }
  });
  return stockData;
}
class Box extends Component {

  submitStock = () => {
    if(this.input.value){
      ws.send(this.input.value)
      this.input.value = "";
    }
  }

  render(){
    return(
      <div>
      <DaGraph/>
      <input ref={node => {this.input = node}} />
      <button onClick={this.submitStock}>Add a stock</button>
      </div>
    );
  }
}
ReactDOM.render(
  <Provider store={createStore(stocks)}>
  <Box/>
  </Provider>,
  document.getElementById('root')
);
