/** @jsx React.DOM **/
var PortfolioManager = React.createClass({
  componentWillMount: function() {
    this.props.data.subscribe(function() {
      this.forceUpdate();
    }.bind(this));

    this.forceUpdate();
  },

  saveAssetsToLocalStorage: function() {
    localStorage['assets'] = JSON.stringify(this.state.assets);
  },

  getAssetsFromLocalStorage: function() {
    var newAssets = SAMPLE_ASSETS;
    if (localStorage['assets'] !== undefined) {
      newAssets = JSON.parse(localStorage['assets']).map(function(x) {return new Asset(x)});
    }
    var portfolio = new Portfolio(newAssets, function() {
      this.setState({assets: portfolio});
    }.bind(this));
    return portfolio;
  },

  loadAssetsFromLocalStorage: function() {
    var newAssets = this.getAssetsFromLocalStorage();
    this.setState({assets:portfolio});
  },

  render: function() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <AddAssetForm data={data} />
            <AssetList data={data} assets={this.props.data.portfolio}/>
            <button className="btn btn-default" onClick={this.saveAssetsToLocalStorage}>Save to Local Storage</button>
            <button className="btn btn-default" onClick={this.loadAssetsFromLocalStorage}>Load from Local Storage</button>
          </div>
          <div className="col-xs-6" >
            <AssetPieChart assets={this.props.data.portfolio}/>
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

