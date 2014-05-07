/** @jsx React.DOM **/
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


