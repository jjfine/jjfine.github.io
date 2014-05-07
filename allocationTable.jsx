/** @jsx React.DOM **/
var AllocationTable = React.createClass({
  render: function() {
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
            <tr>
              <td>US Large</td> 
              <td>25%</td>
              <td>25%</td>
            </tr>
            <tr>
              <td>US Small</td> 
              <td>25%</td>
              <td>25%</td>
            </tr>
            <tr>
              <td>International Large</td> 
              <td>25%</td>
              <td>25%</td>
            </tr>
            <tr>
              <td>International Small</td> 
              <td>25%</td>
              <td>25%</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
});

