var Asset = function(properties) {
  this.symbol = properties.symbol;
  this.shares = properties.shares;
  this.assetClass = properties.assetClass || "US Large";
}
