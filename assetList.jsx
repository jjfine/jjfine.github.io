/** @jsx React.DOM **/
var AssetList = React.createClass({
  render: function() {
    var rows = [];
    this.props.assets.assets.forEach(function(asset, index) {
      rows.push(<AssetRow price={asset.price} asset={asset} key={index} changeSharesByIndex={this.props.changeSharesByIndex} changeClassByIndex={this.props.changeClassByIndex} deleteAsset={this.props.deleteAsset} />);
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

