const fetch = require('node-fetch');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

const getErrors = require('../controllers/errorController');

// Get Data By Symbol API call
const getDataBySymbol = async (symbol) => {
  const response = await fetch(
    `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${process.env.IEX_API_KEY}`
  );
  const data = await response.json();

  return data;
};

// Return API Call data Price as response

module.exports.getPrice = async (req, res) => {
  try {
    const { symbol } = req.params;

    const response = await getDataBySymbol(symbol);
    const { latestPrice } = response;

    res.status(200).json({
      status: 'success',
      data: latestPrice,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: getErrors.getStockErrors(err),
    });
  }
};
// Get Stocks A User owns

module.exports.getStocks = async (req, res) => {
  try {
    const stocks = [...res.locals.user.stocks];

    const response = [];

    stocks.forEach((stock) => {
      const { symbol, company, shares, boughtFor } = stock;
      response.push({
        symbol,
        company,
        shares,
        boughtFor,
      });
    });

    res.status(200).json({
      message: 'success',
      data: response,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
// Quote

module.exports.quoteGet = (req, res) => {
  res.render('quote');
};

module.exports.quotePost = async (req, res) => {
  try {
    const { symbol } = req.body;
    const data = await getDataBySymbol(symbol);

    res.status(200).json({
      status: 'success',
      symbol: data.symbol,
      company: data.companyName,
      price: data.latestPrice,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: getErrors.getStockErrors(err),
    });
  }
};

// Buy

module.exports.buyGet = (req, res) => {
  res.render('buy');
};

module.exports.buyPost = async (req, res) => {
  try {
    const { symbol, shares } = req.body;
    const user = res.locals.user;
    const data = await getDataBySymbol(symbol);

    if (shares <= 0) {
      throw new Error('zero-error');
    }
    if ((shares * data.latestPrice).toFixed(2) > user.funds) {
      throw new Error('funds-error');
    }

    // If there are no stocks yet
    if (!user.stocks.length) {
      const newStock = {
        symbol: data.symbol,
        company: data.companyName,
        shares: Number(shares),
        boughtFor: (data.latestPrice * Number(shares)).toFixed(2),
      };
      user.stocks.push(newStock);
      user.funds = (user.funds - data.latestPrice * shares).toFixed(2);
    } else {
      let stockExists = false;

      // Loop through stocks and check if it already exists, then just increase number of shares and price
      user.stocks.forEach((stock) => {
        if (stock.symbol === data.symbol) {
          stock.shares += Number(shares);
          stock.boughtFor += Number(shares * data.latestPrice).toFixed(2);
          user.funds = (user.funds - data.latestPrice * shares).toFixed(2);
          stockExists = true;
        }
      });
      if (stockExists === false) {
        const newStock = {
          symbol: data.symbol,
          company: data.companyName,
          shares: Number(shares),
          boughtFor: (data.latestPrice * Number(shares)).toFixed(2),
        };
        user.stocks.push(newStock);
        user.funds = (user.funds - data.latestPrice * shares).toFixed(2);
      }
    }

    // Create a new transaction
    await Transaction.create({
      user: user._id,
      transaction: {
        type: 'buy',
        symbol: data.symbol,
        shares: Number(shares),
        sharePrice: data.latestPrice,
      },
    });

    // Update prince and current stocks
    await User.findByIdAndUpdate(
      user._id,
      {
        funds: user.funds,
        stocks: user.stocks,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    res.status(201).json({
      status: 'success',
      message: `Successfully bought ${shares} shares of ${data.symbol} with a price of ${data.latestPrice}`,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: getErrors.getStockErrors(err),
    });
  }
};

module.exports.sellGet = (req, res) => {
  res.render('sell');
};
module.exports.sellPost = async (req, res) => {
  try {
    const { symbol, shares } = req.body;
    const user = res.locals.user;
    const data = await getDataBySymbol(symbol);

    if (shares <= 0) {
      throw new Error('zero-error');
    }
    if (!user.stocks) {
      throw new Error('invalid-symbol');
    } else {
      let stockExists = false;

      // Loop through stocks and check if it already exists, then just increase number of shares and price
      user.stocks.forEach((stock, index) => {
        if (stock.symbol === symbol) {
          if (Number(shares) === stock.shares) {
            user.stocks.splice(index, 1);
          } else if (Number(shares) < stock.shares) {
            stock.shares -= Number(shares);
            stock.boughtFor -= Number(shares * data.latestPrice).toFixed(2);
          } else {
            throw new Error('too-many-shares');
          }
          user.funds = (user.funds + data.latestPrice * shares).toFixed(2);
          stockExists = true;
        }
      });
      if (stockExists === false) {
        throw new Error('invalid-symbol');
      }
    }

    // Create a new transaction
    await Transaction.create({
      user: user._id,
      transaction: {
        type: 'sell',
        symbol,
        shares: Number(shares),
        sharePrice: data.latestPrice,
      },
    });

    // Update prince and current stocks
    await User.findByIdAndUpdate(
      user._id,
      {
        funds: user.funds,
        stocks: user.stocks,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    res.status(200).json({
      status: 'success',
      message: `Successfully sold ${shares} shares of ${data.symbol} with a price of ${data.latestPrice}`,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: getErrors.getStockErrors(err),
    });
  }
};

module.exports.historyGet = async (req, res) => {
  res.render('history');
};
module.exports.transactionsGet = async (req, res) => {
  try {
    const query = Transaction.find({ user: res.locals.user._id });
    query.select('-_id');
    query.select({  'transaction.type': 1, 'transaction.symbol': 1, 'transaction.shares': 1, 'transaction.sharePrice': 1, 'transaction.transactionDate': 1});
    const transactions = await query;

    res.status(200).json({
      status: 'success',
      data: transactions,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};