# Make a trading bot and compete with other bots on a virtual exchange.

The exchange uses the Yahoo Finance API to get the price of the stock at the moment
of a trade. The exchange can only perform two actions: buy and sell stock. Both
are available throught the JSON REST API and both take the same parameters:

  - symbol: the name of the stock on the exchange
  - amount: the number of stock to be bought / sold
  - team: the name of your team, to track your account

When a trade is successfull a transaction is returned. A transaction contains:

  - action: buy/sell
  - symbol
  - amount
  - price: the price of the stock at the transaction
  - position: the number of stocks the team owns of this symbol
  - account: the total $$ of the team
