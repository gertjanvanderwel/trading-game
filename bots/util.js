var request = require('request');

module.exports.get_eur_price = function(callback) {
    var btcAPI = "http://api.coindesk.com/v1/bpi/currentprice.json";
    request.get(btcAPI, function(err, res, body) {
        var response = JSON.parse(body);
        callback(parseFloat(response.bpi.EUR.rate));
    });
}

module.exports.trade = function(action, amount, team, callback) {
    var data = JSON.stringify({action:action, amount:amount, team:team});

    var headers = {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    };

    request.post({
        url     : 'http://localhost:8080/'+action,
        headers : headers,
        body    : data
    }, function(err, res, body) {
        callback(body);
    });
}
