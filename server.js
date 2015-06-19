var http = require('http');

var interval = 5000;
var symbols = [
	'aapl',
    'goog',
    'amzn',
    'fb',
    'twtr',
    'z'
];

function query() {
    var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22YHOO%22%2C%22AAPL%22%2C%22GOOG%22%2C%22MSFT%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";

    http.get(url, function(res) {
        var body = '';

        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var response = JSON.parse(body);
            var results = response.query.results.quote;

            for (var i = 0; i < results.length; i++) {
                console.log(results[i].symbol, results[i].Ask)
            }
        })
    })
}

setInterval(query, 1000);
