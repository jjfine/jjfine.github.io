var Asset = function(properties) {
  this.price = -1;
  this.symbol = properties.symbol;
  this.shares = properties.shares;
  this.assetClass = properties.assetClass || "US Large";
}

Asset.prototype.updatePrice = function(onUpdate) {
  var asset = this;
  MarketAPI.getAssetInfo(this.symbol, function() {
    var price = parseFloat(JSON.parse(this.response).query.results.quote.LastTradePriceOnly);
    asset.price = price;
    if (onUpdate) {
      onUpdate();
    }
  });
}

