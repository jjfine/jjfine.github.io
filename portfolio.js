/** @jsx React.DOM **/
var AddAssetForm = React.createClass({
  getInitialState: function() {
    return { symbol: '', shares: ''};
  },

  onChange: function() {
    this.setState(
        { symbol: this.refs.symbol.getDOMNode().value
        , shares: this.refs.shares.getDOMNode().value
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.props.addAsset(this.state.symbol,this.state.shares);
  },
  
  render: function() {
    return (
      <form onSubmit={this.handleSubmit} className="form">
        <div className="form-group row">
          <div className="col-xs-3">
            <input type="text" onChange={this.onChange} placeholder="Sybmol" ref="symbol" className="form-control" />
          </div>
          <div className="col-xs-3">
            <input type="text" onChange={this.onChange} placeholder="Shares" ref="shares" className="form-control" />
          </div>
          <div className="col-xs-2">
            <button className="btn btn-default">Add</button>
          </div>
        </div>
      </form>
    );
  }
});

var SharesInput = React.createClass({
  onChange: function() {
    newShares = this.refs.shares.getDOMNode().value;
    this.props.changeShares(newShares);
  },

  render: function() {
    return (
      <input type="text" onChange={this.onChange} placeholder="Shares" ref="shares" value={this.props.shares} className="form-control shares-input"/>
    );
  }
});

var AssetRow = React.createClass({
  changeShares:function(shares) {
    this.props.changeSharesByIndex(this.props.key, shares);
  },

  deleteRow: function() {
    this.props.deleteAsset(this.props.key);
  },

  render: function() {
    return (
      <tr>
        <td>{this.props.asset.symbol}</td>
        <td><SharesInput changeShares={this.changeShares} shares={this.props.asset.shares} /></td>
        <td>{formatDollars(this.props.price)}</td>
        <td>{formatDollars(this.props.price*this.props.asset.shares)}</td>
        <td><a href="javascript:void(0);" onClick={this.deleteRow}>Delete</a></td>
      </tr>
    );
  }
});

var AssetList = React.createClass({
  render: function() {
    var rows = [];
    this.props.assets.forEach(function(asset, index) {
      rows.push(<AssetRow price={this.props.getPrice(asset.symbol)} asset={asset} key={index} changeSharesByIndex={this.props.changeSharesByIndex} deleteAsset={this.props.deleteAsset} />);
    }.bind(this));
    return (
      <table className="table">
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});

var PortfolioManager = React.createClass({
  getInitialState: function() {
    return { 
      assets: {},
      prices: {}
    };
  },

  componentWillMount: function() {
    this.loadAssetsFromLocalStorage();
  },

  addAsset: function(symbol, shares) {
    var newAssets = this.state.assets.concat({symbol: symbol, shares: shares});
    this.setState({assets: newAssets});
  },

  deleteAsset: function(index) {
    this.state.assets.splice(index, 1);
    this.setState({assets: this.state.assets});
  },

  changeSharesByIndex: function(index, shares) {
    this.state.assets[index].shares = shares; 
    this.setState({assets: this.state.assets});
  },

  saveAssetsToLocalStorage: function() {
    localStorage['assets'] = JSON.stringify(this.state.assets);
  },

  loadAssetsFromLocalStorage: function() {
    if (localStorage['assets'] === undefined) {
      newAssets = SAMPLE_ASSETS;
    } else {
      newAssets = JSON.parse(localStorage['assets']);
    }
    this.setState({assets: newAssets});
  },

  getPrice: function(symbol) {
    price = this.state.prices[symbol];
    if (price == undefined) {
      this.updatePrice(symbol);
      price = 0.0;
    }
    return price;
  },

  updatePrice: function(symbol) {
    var portfolio = this;
    MarketAPI.getAssetInfo(symbol, function() {
      var price = parseFloat(JSON.parse(this.response).query.results.quote.LastTradePriceOnly);
      portfolio.state.prices[symbol] = price;
      portfolio.setState({prices: portfolio.state.prices});
    });
  },

  render: function() {
    return (
      <div className="row">
        <div className="col-md-6">
          <AddAssetForm addAsset={this.addAsset} />
          <AssetList getPrice={this.getPrice} assets={this.state.assets} changeSharesByIndex={this.changeSharesByIndex} deleteAsset={this.deleteAsset}/>
          <button className="btn btn-default" onClick={this.saveAssetsToLocalStorage}>Save to Local Storage</button>
          <button className="btn btn-default" onClick={this.loadAssetsFromLocalStorage}>Load from Local Storage</button>
        </div>
      </div>
    );
  }
});

var formatDollars = function(x) { 
  return "$" + x.toFixed(2); 
}

var MarketAPI = {
  getAssetInfo: function(symbol,onload) {
    var req = new XMLHttpRequest();
    req.onload = onload;
    req.open("get",'http://query.yahooapis.com/v1/public/yql?q=select LastTradePriceOnly from yahoo.finance.quotes where symbol in ("' + symbol + '")%0A%09%09&env=http://datatables.org/alltables.env&format=json');
    req.send();
  }

};

var SAMPLE_ASSETS = [{symbol: "SCHA", shares: 50}, {symbol: "SCHX", shares: 10}, {symbol: "SCHF", shares: 5}];

var ASSET_CLASSES = { "SCHA": ["small","domestic"]
                   , "SCHX": ["large","domestic"]
                   , "SCHF": ["large","foreign"]
                   , "SCHO": ["bond","domestic"]
                   };

