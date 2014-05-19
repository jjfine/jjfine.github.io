var Data = function() {
  this.count = 0;
  setInterval(function() {
    this.count = this.count + 1;
  }.bind(this), 1000);
}
