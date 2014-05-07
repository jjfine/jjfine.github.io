/** @jsx React.DOM **/
var AllocationTable = React.createClass({
  getInitialState: function() {
    return { allocations: SAMPLE_ALLOCATIONS };
  },

  render: function() {
    var rows = [];
    this.state.allocations.forEach(function(assetClass, index) {
      var actualAllocation = 0.25;
      rows.push(
            <tr>
              <td>{assetClass.name}</td> 
              <td>{assetClass.desiredAllocation}</td>
              <td>{actualAllocation}</td>
            </tr>
        );
    }.bind(this));
    return (
      <div>
        <h3>Asset Allocations</h3>
        <table className="table">
          <thead>
            <th>Type</th>
            <th>Desired Allocation</th>
            <th>Actual Allocation</th>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
});

var SAMPLE_ALLOCATIONS = [{desiredAllocation: 0.50, name: "US Small"}, {desiredAllocation: 0.25, name: "US Large"},{desiredAllocation: 0.10, name: "International Small"}, {desiredAllocation: 0.15, name: "International Large"}];

