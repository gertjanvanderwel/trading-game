var express = require('express');
var parser = require('body-parser');
var request = require('request');

var account = 10000;
var btcAPI = "http://api.coindesk.com/v1/bpi/currentprice.json";

var teams = {
    'team1' : {btc: 0, eur:10000, transactions: []}
}

var app = express();
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

var router = express.Router();

router.route('/buy')
    .post(function(req, res) {
        var b = req.body;
        trade('buy', parseFloat(b.amount), b.team, function(transaction) {
            res.json(transaction);
        });
    });

router.route('/sell')
    .post(function(req, res) {
        var b = req.body;
        trade('sell', parseFloat(b.amount), b.team, function(transaction) {
            res.json(transaction);
        });
    });

app.use('/', router);
app.listen(8080);
console.log('Started trading game server at port 8080...')

function trade(action, amountBtc, team_name, callback) {
    var team = teams[team_name],
        eur = team.eur,
        btc = team.btc;

    request.get(btcAPI, function(err, res, body) {
        var response = JSON.parse(body);
        var price = parseFloat(response.bpi.EUR.rate);

        var total = price * amountBtc,
            success = false,
            error = '';

        if(action === 'buy') {
            if(eur >= total) {
                team.eur = eur - total;
                team.btc = btc + amountBtc;
                success = true;
            } else {
                error = "You can't buy more BTC, because you are out of money.";
            }
        }

        if(action === 'sell') {
            if(btc >= amountBtc) {
                team.eur = eur + total;
                team.btc = btc - amountBtc;
                success = true;
            } else {
                error = "You can't sell more BTC, because you don't own enough";
            }
        }

        if(success) {
            transaction = {
                team_name   : team_name,
                action      : action,
                price       : price,
                amount      : amountBtc,
                eur         : team.eur,
                btc         : team.btc
            };
            team.transactions.push(transaction)

            console.log(JSON.stringify(transaction));
            callback(transaction);
        } else {
            callback({error: error})
        }

    });
}

//trade('buy', 1, 'team1', function(transaction) {})
