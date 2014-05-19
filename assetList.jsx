/** @jsx React.DOM **/
var AssetList = React.createClass({
  render: function() {
    var rows = [];
    this.props.assets.assets.forEach(function(asset, index) {
      rows.push(<AssetRow data={data} price={asset.price} asset={asset} key={index} />);
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

