var Portfolio = function(assets, onUpdate) {
  this.assets = assets;
  assets.forEach(function(asset) {
    asset.updatePrice(onUpdate);
  });
}

