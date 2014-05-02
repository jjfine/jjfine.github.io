/** @jsx React.DOM **/
var Home = React.createClass({
  render: function() {
    return (
      <h1>Home</h1>
      );
  }
});

var Tabs = React.createClass({
  HOME_INSTANCE: <Home />,
  PORTFOLIO_INSTANCE: <PortfolioManager />,

  getInitialState: function() {
    return { selectedTab: this.nameToTab(this.props.initialTabName) };
  },

  nameToTab: function(tabName) {
    if (tabName == "home") {
      return this.HOME_INSTANCE;
    } else {
      return this.PORTFOLIO_INSTANCE;
    }
  },

  switchTo: function(tabName) {
    var newTab = this.nameToTab(tabName);
    if (tabName == "home") {
      window.history.pushState("something", "Home", '/')
    } else {
      window.history.pushState("something portf", "Portfolio Manager", '/portfolio_manager')
    }
    
    this.setState({selectedTab: newTab});
  },

  onClick: function(tabName) {
    return function() { this.switchTo(tabName) }.bind(this);
  },

  render: function() {
    var selectedTab = this.state.selectedTab;
    return (
      <div>
        <div>
          <span onClick={this.onClick("home")}>Home</span>
          <span onClick={this.onClick("portfolio")}>Portfolio Manager App</span>
        </div>
        <hr />
        {selectedTab}
      </div>
      );
  }
});

var path = window.location.pathname;
var initialTabName = "home"

if (window.location.href.search('portfolio_manager') != -1)
{
  initialTabName = "portfolio"
} 
  
React.renderComponent(<Tabs initialTabName={initialTabName} />, document.body);
