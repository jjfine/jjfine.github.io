/** @jsx React.DOM **/
var AssetPieChart = React.createClass({
  nonzeroAssets: function() {
    assets = [];
    this.props.assets.forEach(function(asset) { 
      if (this.props.getPrice(asset.symbol)*asset.shares > 0) 
        assets.push(asset)
    }.bind(this));

    return assets;
  },

  componentDidUpdate: function() {
    this.pie.value(function(d) { 
        return this.props.getPrice(d.symbol)*d.shares;
    }.bind(this));


    var g = this.svg.selectAll("path").data(this.pie(this.nonzeroAssets()));
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

    var g = svg.selectAll("path")
        .data(pie(this.nonzeroAssets()))
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



