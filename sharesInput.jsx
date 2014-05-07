/** @jsx React.DOM **/
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

