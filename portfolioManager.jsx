/** @jsx React.DOM **/
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
      newAssets = JSON.parse(localStorage['assets']).map(function(x) {return new Asset(x)});
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
      <div>
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
        <div className="row">
          <AllocationTable />
        </div>
      </div>
    );
  }
});


var SAMPLE_ASSETS = [ new Asset({symbol: "SCHA", shares: 50, assetClass: "US Small"})
                    , new Asset({symbol: "SCHX", shares: 10, assetClass: "US Large"})
                    , new Asset({symbol: "SCHF", shares: 5, assetClass: "International Large"})
                    ];

