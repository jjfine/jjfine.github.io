/** @jsx React.DOM **/
var MarketAPI = {
  getAssetInfo: function(symbol,onload) {
    var req = new XMLHttpRequest();
    req.onload = onload;
    req.open("get",'http://query.yahooapis.com/v1/public/yql?q=select LastTradePriceOnly from yahoo.finance.quotes where symbol in ("' + symbol + '")%0A%09%09&env=http://datatables.org/alltables.env&format=json');
    req.send();
  }

};



