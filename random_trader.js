var request = require('request');

var team = 'team1';
var actions = [
    'buy',
    'sell'
]

function trade() {
    var action = actions[Math.floor(Math.random()*actions.length)],
        amount = Math.random();

    var data_str = JSON.stringify({action:action, amount:amount, team:team});

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

    request.post({url:'http://localhost:8080/'+action, headers: headers, body:data_str}, function(err, res, body) {
        console.log(body);
    });
}

setInterval(trade, 2000);
