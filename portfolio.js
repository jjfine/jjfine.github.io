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

var AssetClassSelect = React.createClass({
  onChange: function() {
    newClass = this.refs.assetClass.getDOMNode().value;
    this.props.changeClass(newClass);
  },

  render: function() {
    return (
      <select onChange={this.onChange} ref="assetClass" value={this.props.assetClass} className="form-control" >
        <option>US Small</option>
        <option>US Large</option>
        <option>International Small</option>
        <option>International Large</option>
      </select>
    );
  }
});

var AssetRow = React.createClass({
  changeShares:function(shares) {
    this.props.changeSharesByIndex(this.props.key, shares);
  },

  changeClass:function(assetClass) {
    this.props.changeClassByIndex(this.props.key, assetClass);
  },

  deleteRow: function() {
    this.props.deleteAsset(this.props.key);
  },

  priceOrLoading: function() {
    if (this.props.price === -1) {
      return "Loading..."
    }
    return formatDollars(this.props.price)
  },

  valueOrLoading: function() {
    if (this.props.price === -1) {
      return "Loading..."
    }
    return formatDollars(this.props.price*this.props.asset.shares)
  },

  render: function() {
    return (
      <tr>
        <td>{this.props.asset.symbol}</td>
        <td><SharesInput changeShares={this.changeShares} shares={this.props.asset.shares} /></td>
        <td>{this.priceOrLoading()}</td>
        <td>{this.valueOrLoading()}</td>
        <td><AssetClassSelect changeClass={this.changeClass} assetClass={this.props.asset.assetClass} /></td>
        <td><a href="javascript:void(0);" onClick={this.deleteRow}>Delete</a></td>
      </tr>
    );
  }
});

var AssetList = React.createClass({
  render: function() {
    var rows = [];
    this.props.assets.forEach(function(asset, index) {
      rows.push(<AssetRow price={this.props.getPrice(asset.symbol)} asset={asset} key={index} changeSharesByIndex={this.props.changeSharesByIndex} changeClassByIndex={this.props.changeClassByIndex} deleteAsset={this.props.deleteAsset} />);
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

var colorScale = d3.scale.category20();

var RandomColor = function() {
  return colorScale(Math.random()*20);
}

var AssetPieChart = React.createClass({
  componentDidUpdate: function() {
    this.pie.value(function(d) { 
        return this.props.getPrice(d.symbol)*d.shares;
    }.bind(this));

    var nonzeroAssets = [];
    this.props.assets.forEach(function(asset) { 
      if (this.props.getPrice(asset.symbol)*asset.shares != 0.0) 
        nonzeroAssets.push(asset)
    }.bind(this));

    var g = this.svg.selectAll("path").data(this.pie(nonzeroAssets));
    g.enter().append("path")
      .style("fill", function() { return RandomColor() }.bind(this));
    g.exit().remove();
    g.attr("d",this.arc);
  },

  componentDidMount: function() {
    var width = 250,
    height = 250,
    radius = width/2;

    var arc = this.arc = d3.svg.arc()
      .outerRadius(radius-10)
      .innerRadius(0);

    var pie = this.pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { 
        return this.props.getPrice(d.symbol)*d.shares; 
      }.bind(this));

    var svg = this.svg = d3.select("#chart").append("svg")
        .attr("width",width)
        .attr("height",height)
      .append("g")
        .attr("transform", "translate(" + width/2 + ", " + height/2 + ")");

    var nonzeroAssets = [];
    this.props.assets.forEach(function(asset) { 
      if (this.props.getPrice(asset.symbol) != 0.0) 
        nonzeroAssets.push(asset)
    }.bind(this));

    var g = svg.selectAll("path")
        .data(pie(nonzeroAssets))
        .enter().append("path")
          .attr("d", arc)
          .style("fill", function() { return RandomColor(); })
  },

  render: function() {
    return <div id="chart"></div>;
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

  changeClassByIndex: function(index, assetClass) {
    this.state.assets[index].assetClass = assetClass; 
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
      price = -1;
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
          <AssetList getPrice={this.getPrice} assets={this.state.assets} changeSharesByIndex={this.changeSharesByIndex} deleteAsset={this.deleteAsset} changeClassByIndex={this.changeClassByIndex}/>
          <button className="btn btn-default" onClick={this.saveAssetsToLocalStorage}>Save to Local Storage</button>
          <button className="btn btn-default" onClick={this.loadAssetsFromLocalStorage}>Load from Local Storage</button>
        </div>
        <div className="col-xs-6" >
          <AssetPieChart getPrice={this.getPrice} assets={this.state.assets}/>
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

var SAMPLE_ASSETS = [{symbol: "SCHA", shares: 50, assetClass: "US Small"}, {symbol: "SCHX", shares: 10, assetClass: "US Large"}, {symbol: "SCHF", shares: 5, assetClass: "International Large"}];



