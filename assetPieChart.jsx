/** @jsx React.DOM **/
var AssetPieChart = React.createClass({
  nonzeroAssets: function() {
    assets = [];
    this.props.assets.forEach(function(asset) { 
      if (this.props.getPrice(asset.symbol)*asset.shares > 0) 
        assets.push(asset)
    }.bind(this));

    return assets;
  },

  componentDidUpdate: function() {
    this.pie.value(function(d) { 
        return this.props.getPrice(d.symbol)*d.shares;
    }.bind(this));


    var g = this.svg.selectAll("path").data(this.pie(this.nonzeroAssets()));
    g.enter().append("path")
      .style("fill", function() { return RandomColor() }.bind(this));
    g.exit().remove();
    g.attr("d",this.arc);
  },

  componentDidMount: function() {
    var width = 250,
    height = 250,
    radius = width/2;

    var arc = this.arc = d3.svg.arc()
      .outerRadius(radius-10)
      .innerRadius(0);

    var pie = this.pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { 
        return this.props.getPrice(d.symbol)*d.shares; 
      }.bind(this));

    var svg = this.svg = d3.select("#chart").append("svg")
        .attr("width",width)
        .attr("height",height)
      .append("g")
        .attr("transform", "translate(" + width/2 + ", " + height/2 + ")");

    var g = svg.selectAll("path")
        .data(pie(this.nonzeroAssets()))
        .enter().append("path")
          .attr("d", arc)
          .style("fill", function() { return RandomColor(); })
  },

  render: function() {
    return <div id="chart"></div>;
  }
});

