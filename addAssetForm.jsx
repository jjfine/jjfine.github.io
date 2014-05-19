/** @jsx React.DOM **/
var AddAssetForm = React.createClass({
  getInitialState: function() {
    return { symbol: '', shares: ''};
  },

  onChange: function() {
    this.setState(
        { symbol: this.refs.symbol.getDOMNode().value
        , shares: this.refs.shares.getDOMNode().value
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.props.data.portfolio.addAsset(this.state.symbol,this.state.shares);
  },
  
  render: function() {
    return (
      <form onSubmit={this.handleSubmit} className="form">
        <div className="form-group row">
          <div className="col-xs-3">
            <input type="text" onChange={this.onChange} placeholder="Sybmol" ref="symbol" className="form-control" />
          </div>
          <div className="col-xs-3">
            <input type="text" onChange={this.onChange} placeholder="Shares" ref="shares" className="form-control" />
          </div>
          <div className="col-xs-2">
            <button className="btn btn-default">Add</button>
          </div>
        </div>
      </form>
    );
  }
});
