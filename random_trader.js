var http = require('http');

var team = 'gertje';
var symbols = [
    'aapl',
    'goog',
    'fb',
    'z',
    'amzn',
    'twtr'
];
var actions = [
    'buy',
    'sell'
]

function trade() {
    var symbol = symbols[Math.floor(Math.random()*symbols.length)],
        action = actions[Math.floor(Math.random()*actions.length)],
        amount = Math.random();

    var data_str = JSON.stringify({symbol:symbol, action:action, amount:amount, team:team});

    var headers = {
      'Content-Type': 'application/json',
      'Content-Length': data_str.length
    };

    var options = {
        host    : 'localhost',
        port    : 8080,
        path    : '/'+ action,
        method  : 'POST',
        headers : headers
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf-8');

        var response_str = '';

        res.on('data', function(data) {
            response_str += data;
        });

        res.on('end', function() {
            console.log(response_str);
        });
    });

    req.write(data_str);
    req.end();
}

setInterval(trade, 2000);
