var Data = function() {
  this.count = 0;
  setInterval(function() {
    this.count = this.count + 1;
  }.bind(this), 1000);

  this.subscribe = function(func) {
    this.subscribers = this.subscribers.concat(func)
  }
  
  this.subscribers = [];

  this.callSubscribers = function() {
    this.subscribers.forEach(function(func) {
      func.call();
    });
  }.bind(this)

  this.portfolio = Portfolio.prototype.fromLocalStorage(this.callSubscribers);
}
