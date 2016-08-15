const stocks = (state = [], action) => {
  switch(action.type){
    case 'ADD':
      return [...state,action.stock]
  }
}
const StockGraph = (data) => {
  return (
    <Line data={data}
  )
}
