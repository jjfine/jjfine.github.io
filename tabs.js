/** @jsx React.DOM **/
var Home = React.createClass({
  render: function() {
    return (
      <h1>Home</h1>
      );
  }
});

var HomeTab = {
  name: "Home",
  path: "home",
  component: <Home />
};

var PortfolioTab = {
  name: "Portfolio",
  path: "portfolio",
  component: <PortfolioManager />
};

var Tabs = React.createClass({
  getInitialState: function() {
    return { selectedTab: this.nameToTab(this.props.initialTabName) };
  },

  nameToTab: function(tabName) {
    if (tabName == "home") {
      return HomeTab;
    } else {
      return PortfolioTab;
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
      <div className="container">
        <ul className="list-inline">
          <li onClick={this.onClick("home")}><h2><a>Home</a></h2></li>
          <li onClick={this.onClick("portfolio")}><h2><a>Portfolio Manager App</a></h2></li>
        </ul>
        <hr />
        {selectedTab.component}
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

