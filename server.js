var express = require('express');
var parser = require('body-parser');
var http = require('http');

var teams = {
    'gertje' : {
        account : 2000,
        transactions: []
    }
}


var app = express();
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

var router = express.Router();

// buy
router.route('/buy')
    .post(function(req, res) {
        var b = req.body;
        doTransaction('buy', b.symbol, b.amount, b.team, function(transaction) {
            res.json(transaction);
        });
    });

// sell
router.route('/sell')
    .post(function(req, res) {
        var b = req.body;
        doTransaction('sell', b.symbol, b.amount, b.team, function(transaction) {
            res.json(transaction);
        });
    });

app.use('/', router);
app.listen(8080);
console.log('Started trading game server at port 8080...')

function doTransaction(action, symbol, amount, teamName, callback) {
    var team = teams[teamName],
        account = team.account;

    queryYahoo(symbol, function(price) {
        var total = price * amount;

        if(action === 'buy' && account >= total) {
            team.account = account - total;
        }

        if(action === 'sell') {
            team.account = account + total;
        }

        transaction = {action:action, symbol:symbol, price:price, amount:amount, account:team.account};
        team.transactions.push(transaction)

        console.log(transaction);
        callback(transaction);

    });
}

function queryYahoo(symbol, callback) {
    var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20%3D%22"+ symbol +"%22&format=json&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";

    http.get(url, function(res) {
        var body = '';

        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var response = JSON.parse(body);
            callback(response.query.results.quote.Ask);
        });
    })
}
