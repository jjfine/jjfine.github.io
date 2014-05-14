/** @jsx React.DOM **/
var AllocationRow = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.assetClass.name}</td> 
        <td>{this.props.assetClass.desiredAllocation}</td>
        <td>Implement Me</td>
      </tr>
    );
  }
});
