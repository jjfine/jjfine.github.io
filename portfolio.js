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
      <form onSubmit={this.handleSubmit}>
        <input type="text" onChange={this.onChange} placeholder="Sybmol" ref="symbol" />
        <input type="text" onChange={this.onChange} placeholder="Shares" ref="shares" />
        <button>Add</button>
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
      <input type="text" onChange={this.onChange} placeholder="Shares" ref="shares" value={this.props.shares} />
    );
  }
});

var AssetRow = React.createClass({
  changeShares:function(shares) {
    this.props.changeSharesByIndex(this.props.key, shares);
  },

  render: function() {
    return (
      <tr>
        <td>{this.props.asset.symbol}</td>
        <td><SharesInput changeShares={this.changeShares} shares={this.props.asset.shares} /></td>
        <td>{formatDollars(MarketAPI.getPrice([this.props.asset.symbol]))}</td>
        <td>{formatDollars(MarketAPI.getPrice([this.props.asset.symbol])*this.props.asset.shares)}</td>
      </tr>
    );
  }
});

var AssetList = React.createClass({
  render: function() {
    var rows = [];
    this.props.assets.forEach(function(asset, index) {
      rows.push(<AssetRow asset={asset} key={index} changeSharesByIndex={this.props.changeSharesByIndex} />);
    }.bind(this));
    return (
      <table>
        {rows}
      </table>
    );
  }
});

var PortfolioManager = React.createClass({
  getInitialState: function() {
    return { assets: SAMPLE_ASSETS };
  },

  addAsset: function(symbol, shares) {
    var newAssets = this.state.assets.concat({symbol: symbol, shares: shares});
    this.setState({assets: newAssets});
  },

  changeSharesByIndex: function(index, shares) {
    this.state.assets[index].shares = shares; 
    this.setState({assets: this.state.assets});
  },

  saveAssetsToLocalStorage: function() {
    localStorage['assets'] = JSON.stringify(this.state.assets);
  },

  loadAssetsFromLocalStorage: function() {
    var newAssets = JSON.parse(localStorage['assets']);
    if (!newAssets) newAssets = [];
    this.setState({assets: newAssets});
  },

  render: function() {
    return (
      <div>
        <AddAssetForm addAsset={this.addAsset} />
        <AssetList assets={this.state.assets} changeSharesByIndex={this.changeSharesByIndex} />
        <button onClick={this.saveAssetsToLocalStorage}>Save to Local Storage</button>
        <button onClick={this.loadAssetsFromLocalStorage}>Load from Local Storage</button>
      </div>
    );
  }
});

var formatDollars = function(x) { return "$" + x.toFixed(2); }

var getAssetInfo = function(symbol) {
  var req = new XMLHttpRequest();
  req.open("get",'http://query.yahooapis.com/v1/public/yql?q=select symbol, Bid, Ask from yahoo.finance.quotes where symbol in ("' + symbol + '")%0A%09%09&env=http://datatables.org/alltables.env&format=json');
  req.send();
}

MarketAPI = {
  getPrice: function(symbol) {
    price = ASSET_PRICES[symbol];
    if (price == undefined) price = 0.0;
    return price;
  }
}


// getAssetInfo("SCHA");
var SAMPLE_ASSETS = [{symbol: "SCHA", shares: 50}, {symbol: "SCHX", shares: 10}, {symbol: "SCHF", shares: 5}];

var ASSET_CLASSES = { "SCHA": ["small","domestic"]
                   , "SCHX": ["large","domestic"]
                   , "SCHF": ["large","foreign"]
                   , "SCHO": ["bond","domestic"]
                   };

var ASSET_PRICES = { "SCHA": 51.76
                  , "SCHX": 44.83
                  , "SCHF": 31.90
                  , "SCHO": 50.56
                  };


