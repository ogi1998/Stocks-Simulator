const User = require('../models/User');

// Register errors are mongoose native errors, so they need proper handling
module.exports.getRegisterErrors = (err) => {

    // Validation errors
    if (err.name === 'ValidationError') {
      const fields = Object.keys(User.schema.tree);
      for (let i = 0; i < fields.length; i++) {
        if (err.errors[fields[i]]) {
          return err.errors[fields[i]].properties.message;
        }
      }
      // Duplicate error
    } else if (err.code === 11000) {
        const capitalized = Object.keys(err.keyValue)[0].charAt(0).toUpperCase() + Object.keys(err.keyValue)[0].slice(1)
        return `${capitalized} must be unique`;
    }
    return '';
  };

  // Login errors are manually thrown so they are much more simple
  module.exports.getLoginErrors = (err) => err.message;

  module.exports.getStockErrors = (err) => {
    // API Error, invalid symbol
    if(err.type === 'invalid-json') {
      return 'Invalid symbol.';
    }
    // DB Error, invalid symbol
    if(err.type === 'invalid-symbol') {
      return 'You do not own that stock.'
    }
    // Too many stocks error
    if(err.message === 'too-many-shares') {
      return 'You dont have that many shares';
    }
    // No funds error
    if(err.message === 'funds-error') {
      return 'You have insufficient funds.';
    }
    if(err.message === 'zero-error') {
      return 'Number of shares must be a positive number.';
    }
    return '';
  }