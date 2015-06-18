var request = require('request');
var cheerio = require('cheerio');

var interval = 5000;
var symbols = [
	'aapl',
    'goog',
    'amzn',
    'fb',
    'twtr',
    'z'
];

function scrape(symbol){
    var url = 'http://www.nasdaq.com/symbol/'+ symbol +'/financials';

    request(url, function(err, resp, html){
        var $ = cheerio.load(html);
        var lastsale = parseFloat($('#qwidget_lastsale').text().replace('$', ''));
        console.log(symbol, lastsale, new Date())
    });
}

for(var i = 0; i < symbols.length; i++) {
    scrape(symbols[i]);
}