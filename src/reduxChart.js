const {createStore} = Redux
const {connect,Provider} = ReactRedux;
const stocks = (state = [], action) => {
  switch(action.type){
    case 'ADD':
    return [...state,action.stock]
  }
}
class StockGraph extends Component {
  componentDidMount(){
    ws.onmessage = (event) => {
      onAdd(event.data);
    };
  }

  render(){
    <Line data={this.props.data} />
  }
}
const DaGraph = connect(
  mapStateToGraph,
  mapDispatchToGraph
)(StockGraph);
mapStateToGraph = (state) => {
  return {
    data: getData(state)
  }
}
mapDispatchToGraph = (dispatch) => {
  return {
    onAdd: (data) => {
      dispatch({"type":"ADD","stock":data})
    }
  }
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
    },
    error: (err) => {
      console.log(err);
    }
  });
  return stockData;
}
