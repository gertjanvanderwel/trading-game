var util = require('./util.js');

setInterval(function() {
    var action = Math.random() < 0.5 ? 'sell' : 'buy';
    var amount = Math.random();
    util.trade(action, amount, 'team1', function(body) {
        console.log(body)
    })
}, 2000);
