/** @jsx React.DOM **/
var Home = React.createClass({
  render: function() {
    return (
      <h1>Home</h1>
      );
  }
});

var HomeTab = React.createClass({
  name: "Home",
  path: "home",
  render: function() {
    return <Home />
  }
});

var PortfolioTab = React.createClass({
  name: "Portfolio",
  path: "portfolio",
  render: function() {
    return <PortfolioManager />
  }
});

var Tabs = React.createClass({
  homeTab: new HomeTab(),
  portfolioTab: new PortfolioTab(),

  getInitialState: function() {
    return { selectedTab: this.nameToTab(this.props.initialTabName) };
  },

  nameToTab: function(tabName) {
    if (tabName == "home") {
      return this.homeTab;
    } else {
      return this.portfolioTab;
    }
  },

  switchTo: function(tabName) {
    var newTab = this.nameToTab(tabName);
    window.history.pushState("", newTab.name, newTab.path)
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

if (window.location.href.search('portfolio') != -1)
{
  initialTabName = "portfolio"
} 
  
React.renderComponent(<Tabs initialTabName={initialTabName} />, document.body);
