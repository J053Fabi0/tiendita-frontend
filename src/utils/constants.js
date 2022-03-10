const { toFixedS } = require("./numbersString");
const { freeze } = Object;

module.exports = freeze({
  COIN_APIS: freeze({
    btc: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=mxn",
    xmr: "https://api.coingecko.com/api/v3/simple/price?ids=monero&vs_currencies=mxn",
    doge: "https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=mxn",
    dash: "https://api.coingecko.com/api/v3/simple/price?ids=dash&vs_currencies=mxn",
    ltc: "https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=mxn",
    zec: "https://api.coingecko.com/api/v3/simple/price?ids=zcash&vs_currencies=mxn",
    bnb: "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=mxn",
  }),

  COINS_FULLNAMES: freeze({
    btc: "bitcoin",
    xmr: "monero",
    doge: "dogecoin",
    dash: "dash",
    ltc: "litecoin",
    zec: "zcash",
    bnb: "binance coin",
  }),

  COINS_MINS: freeze({
    btc: 0.0001,
    xmr: 0.0001,
    doge: 10,
    dash: 0.01,
    ltc: 0.01,
    zec: 0.001,
    bnb: 0.07,
  }),

  COINS_AUTOMATIC_QR: freeze({
    btc: (address, amount) => `bitcoin:${address}?amount=${toFixedS(amount, 8)}`,
    xmr: (address, amount) => `monero:${address}?tx_amount=${toFixedS(amount, 12)}`,
    doge: (address, amount) => `dogecoin:${address}?amount=${toFixedS(amount, 8)}`,
    dash: (address, amount) => `dash:${address}?amount=${toFixedS(amount, 8)}`,
    ltc: (address, amount) => `litecoin:${address}?amount=${toFixedS(amount, 8)}`,
    zec: (address, amount) => `zcash:${address}?amount=${toFixedS(amount, 8)}`,
    bnb: (address, amount) => `binance:${address}?amount=${toFixedS(amount, 8)}`,
  }),

  COINS_DECIMALS: freeze({
    btc: 8,
    xmr: 12,
    doge: 8,
    dash: 8,
    ltc: 8,
    zec: 8,
    bnb: 8,
  }),

  API: "https://btc-api.josefabio.com",
});
