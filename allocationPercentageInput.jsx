/** @jsx React.DOM **/
var AllocationPercentageInput = React.createClass({
  onChange: function() {
    allocationPercentage = this.refs.allocationPercentage.getDOMNode().value;
    this.props.changeAllocationPercentage(allocationPercentage);
  },

  render: function() {
    return (
      <input type="text" onChange={this.onChange} placeholder="" ref="allocationPercentage" value={this.props.shares} className="form-control"/>
    );
  }
});

