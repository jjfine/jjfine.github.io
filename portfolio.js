var Portfolio = function(assets, onUpdate) {
  this.assets = assets;

  assets.forEach(function(asset) {
    asset.updatePrice(onUpdate);
  });
}

Portfolio.prototype.fromLocalStorage = function(onUpdate) {
  var newAssets = SAMPLE_ASSETS;
  if (localStorage['assets'] !== undefined) {
    newAssets = JSON.parse(localStorage['assets']).map(function(x) {return new Asset(x)});
  }
  return new Portfolio(newAssets, onUpdate);
}

var SAMPLE_ASSETS = [ new Asset({symbol: "SCHA", shares: 50, assetClass: "US Small"})
                    , new Asset({symbol: "SCHX", shares: 10, assetClass: "US Large"})
                    , new Asset({symbol: "SCHF", shares: 5, assetClass: "International Large"})
                    ];
