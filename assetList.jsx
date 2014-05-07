/** @jsx React.DOM **/
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

