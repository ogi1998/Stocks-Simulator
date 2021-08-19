const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  transaction: {
      type: {
        type: String,
        enum: ["buy", "sell"]
      },
      symbol: {
        type: String
      },
      shares: {
        type: Number
      },
      sharePrice: {
        type: Number
      },
      transactionDate: {
        type: Date,
        default: Date.now()
      }
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
