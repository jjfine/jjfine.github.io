/** @jsx React.DOM **/
var AssetRow = React.createClass({
  changeShares:function(shares) {
    this.props.changeSharesByIndex(this.props.key, shares);
  },

  changeClass:function(assetClass) {
    this.props.changeClassByIndex(this.props.key, assetClass);
  },

  deleteRow: function() {
    this.props.data.portfolio.deleteAsset(this.props.key);
  },

  priceOrLoading: function() {
    if (this.props.price === -1) {
      return "Loading..."
    }
    return Utils.formatDollars(this.props.price)
  },

  valueOrLoading: function() {
    if (this.props.price === -1) {
      return "Loading..."
    }
    return Utils.formatDollars(this.props.price*this.props.asset.shares)
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


