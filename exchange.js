var express = require('express');
var parser = require('body-parser');
var http = require('http');

var teams = {
    'gertje' : {
        account: 2000,
        positions: [],
        transactions: []
    }
}

var app = express();
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

var router = express.Router();

router.route('/buy')
    .post(function(req, res) {
        var b = req.body;
        transact('buy', b.symbol, parseFloat(b.amount), b.team, function(transaction) {
            res.json(transaction);
        });
    });

router.route('/sell')
    .post(function(req, res) {
        var b = req.body;
        transact('sell', b.symbol, parseFloat(b.amount), b.team, function(transaction) {
            res.json(transaction);
        });
    });

app.use('/', router);
app.listen(8080);
console.log('Started trading game server at port 8080...')

function transact(action, symbol, amount, team_name, callback) {
    var team = teams[team_name],
        account = team.account;

    if(team.positions[symbol] === undefined) {
        team.positions[symbol] = 0;
    }
    var position = parseFloat(team.positions[symbol]);

    query_yahoo(symbol, function(price) {
        var total = price * amount,
            success = false,
            error = '';

        if(action === 'buy') {
            if(account >= total) {
                team.account = account - total;
                team.positions[symbol] = position + amount;
                success = true;
            } else {
                error = 'Sorry, '+ symbol +' is too expensive: '+ account +' < '+ total;
            }
        }

        if(action === 'sell') {
            if(position >= amount) {
                team.account = account + total;
                team.positions[symbol] = position - amount;
                success = true;
            } else {
                error = "Can't sell "+ symbol +" because you don't own enough: "+ position +" < "+ amount;
            }
        }

        if(success) {
            transaction = {
                action      : action,
                symbol      : symbol,
                price       : price,
                amount      : amount,
                position    : team.positions[symbol],
                account     : team.account
            };
            team.transactions.push(transaction)

            console.log(JSON.stringify(transaction));
            callback(transaction);
        } else {
            callback({error: error})
        }

    });
}

function query_yahoo(symbol, callback) {
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
