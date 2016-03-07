var mongoose = require('mongoose');
var AccountSchema = require('../schemas/account');
var Account = mongoose.model('Account', AccountSchema);

module.exports = Account;