/** @jsx React.DOM **/
var colorScale = d3.scale.category20();

var RandomColor = function() {
  return colorScale(Math.random()*20);
}


