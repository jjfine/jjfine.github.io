/** @jsx React.DOM **/
var Home = React.createClass({
  render: function() {
    return (
      <h1>Home</h1>
      );
  }
});

var Tabs = React.createClass({
  getInitialState: function() {
    return { selectedTab: this.props.initialTab };
  },

  onClick: function(tabName) {
    return function(e) {
      console.log(tabName);
      console.log(this.state);
      if (tabName == "Home") {
        console.log("switching to home");
        selectedTab = HOME_INSTANCE;
        window.history.pushState("something", "Home", '/')
      } else {
        console.log("switching to portfolio_manager");
        selectedTab = PORTFOLIO_INSTANCE;
        window.history.pushState("something portf", "Portfolio Manager", '/portfolio_manager')
      }
      
      this.setState({selectedTab: selectedTab});
    }.bind(this);
  },

  render: function() {
    var selectedTab = this.state.selectedTab;
    return (
      <div>
        <div>
          <span onClick={this.onClick("Home")}>Home</span>
          <span onClick={this.onClick("Portfolio")}>Portfolio Manager App</span>
        </div>
        <hr />
        {selectedTab}
      </div>
      );
  }
});

var path = window.location.pathname;
var HOME_INSTANCE = <Home />
var PORTFOLIO_INSTANCE = <PortfolioManager />
var initialTab = HOME_INSTANCE;

if (window.location.hash === '#portfolio_manager')
{
  initialTab = PORTFOLIO_INSTANCE;
} 
  
React.renderComponent(<Tabs initialTab={initialTab} />, document.body);
