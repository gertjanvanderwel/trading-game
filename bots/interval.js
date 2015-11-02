var fs = require('fs');
var util = require('./util.js')

var team = 'team1';
var amount_btc = 0;
var amount_eur = 10000;
var profit_margin = 0.5;
var prev_price, purchase_eur_price;;

//var filename = 'trader-3.csv';
//var stream = fs.createWriteStream(filename);
//stream.write("timestamp,ask,bid,price\n");

//util.add_to_portfolio('FB');

//setInterval(main, 5000);

fs.readFileSync('./data/hitbtcEUR.csv')
    .toString()
    .split('\n')
    .forEach(function(line) {
        var price = parseFloat(line.split(',')[1]);
        main(price);
    });


function main(cur_price) {

/*
    var portfolio = util.portfolio;

    var value = 0;
    for(var symbol in portfolio) {
        var stock = portfolio[symbol];
        value += stock.amount * stock.prev_bid;

        if(stock.prev_ask > 0) {
            var csvStr = util.get_date_time() +","+ stock.prev_ask +","+ stock.prev_bid;
            if(stock.amount > 0) {
                csvStr += ","+ stock.price;
            }
            stream.write(csvStr +"\n");
        }
    }
    console.log('portfolio:', value, 'account:', util.account, 'total:', value + util.account);
*/

//    util.get_eur_price(function(cur_price) {
        if(prev_price > 0) {
            // buy
            if(amount_btc < 1) {
                var delta = cur_price - prev_price;
//                console.log('will buy if delta ('+ delta +') > 0')

                if (delta > 0) {
                    var amount_trade = amount_eur / cur_price;
                    console.log('BUY', cur_price)
//                    util.trade('buy', amount_trade, team, function() {
                        amount_btc += amount_trade;
                        amount_eur -= amount_trade * cur_price;
                        purchase_eur_price = cur_price;
//                    });
                }
            }
            // sell
            else {
//                console.log(purchase_eur_price);
                var trade_costs = purchase_eur_price * 0.001;
                var selling_eur_price = purchase_eur_price + trade_costs + profit_margin;
//                console.log('will sell if current price ('+ cur_price +') > selling price ('+ selling_eur_price +')');

                // zoiezo verkopen als bid teveel gedaald is om erger te voorkomen

               if (cur_price > selling_eur_price) { // en pas verkopen als de bid voor het eerst daalt

//                    util.trade('sell', amount_btc, team, function() {
                        amount_eur = amount_btc * cur_price;
                        amount_btc = 0;
//                    });
                        console.log('SELL', cur_price, amount_eur)
                }
            }
        }

        prev_price = cur_price;
//    });
}
