var Account = require('../models/account');
var _ = require('underscore');

/*** account ***/
exports.get_signup = function (req, res) {
  res.render('account/signup', {
    title: '用户注册'
  });
};

exports.post_signup = function (req, res) {
  var accountForm = req.body.account;
  var account = new Account(accountForm);
  account.save(function (err, acc) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
};

exports.get_signin = function (req, res) {
  res.render('account/signin', {
    title: '用户登录'
  });
};

exports.post_signin = function (req, res) {
  var uid = req.body.account.uid;
  var upwd = req.body.account.upwd;
  Account.findOne({
    uid: uid,
    upwd: upwd,
    enable: true
  }, function (err, account) {
    if (err) {
      return res.redirect('/account/signin');
    } else {
      if (account) {
        req.session.account = account;
        res.redirect('/');
      } else {
        res.redirect('/account/signin');
      }
    }
  });
};

exports.get_signout = function (req, res) {
  delete req.session.account;
  res.redirect('/');
};

exports.get_setting = function (req, res) {
  var account = req.session.account;
  if (account) {
    Account.findById(account._id, function (err, acc) {
      res.render('account/setting', {
        title: '用户设置',
        account: acc
      });
    });
  } else {
    console.log('no');
  }
};

exports.post_setting = function (req, res) {
  var accountForm = req.body.account;
  var id = accountForm._id;
  var _account;
  if (id) {
    Account.findById(id, function (err, account) {
      _account = _.extend(account, accountForm);
      _account.save(function (err, a) {
        if (err) {
          console.log(err);
        }
        res.redirect('/');
      });
    });
  }
};

exports.require_signin = function (req, res, next) {
  var account = req.session.account;
  if (!account) {
    return res.redirect('/account/signin');
  }
  next();
}

exports.require_admin = function (req, res, next) {
  var account = req.session.account;
  if (account.level <= 6) {
    return res.redirect('/');
  }
  next();
}

exports.get_list = function (req, res) {
  Account
    .find({uid:{$ne:'sa'}})
    .exec(function (err, accounts) {
      res.render('account/list', {
        title: '用户列表',
        accounts: accounts
      });
    });
}

exports.get_edit = function (req, res) {
  var id = req.params.id;
  if (id) {
    Account.findById(id, function (err, account) {
      res.render('account/edit', {
        title: '编辑用户',
        account: account
      });
    });
  }
}

exports.post_edit = function (req, res) {
  var accountForm = req.body.account;
  var id = accountForm._id;
  var _account;
  if (id) {
    Account.findById(id, function (err, account) {
      _account = _.extend(account, accountForm);
      if (!accountForm.enable) {
        _account.enable = false;
      }
      _account.save(function (err, a) {
        res.redirect('/account/list');
      });
    })
  }
}