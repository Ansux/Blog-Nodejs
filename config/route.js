var Account = require('../controllers/account');
var Category = require('../controllers/category');
var Blog = require('../controllers/blog');

module.exports = function (app) {
    // account
    app.get('/account/signup', Account.is_signin, Account.get_signup);
    app.post('/account/signup', Account.post_signup);
    app.get('/account/signin', Account.is_signin, Account.get_signin);
    app.post('/account/signin', Account.post_signin);
    app.get('/account/setting', Account.get_setting);
    app.post('/account/setting', Account.post_setting);
    app.get('/account/signout', Account.get_signout);
    app.post('/account/exist', Account.post_exist);
    app.get('/account/list', Account.require_signin, Account.require_admin, Account.get_list);
    app.get('/account/edit/:id', Account.require_signin, Account.require_admin, Account.get_edit);
    app.post('/account/edit', Account.require_signin, Account.require_admin, Account.post_edit);

    // category
    app.get('/category/list', Account.require_signin, Account.require_admin, Category.get_list);
    app.get('/category/create', Account.require_signin, Account.require_admin, Category.get_create);
    app.get('/category/edit/:id', Account.require_signin, Account.require_admin, Category.get_edit);
    app.post('/category/save', Account.require_signin, Account.require_admin, Category.post_save);
    app.post('/category/remove', Account.require_signin, Account.require_admin, Category.post_remove);
    app.get('/category/:id', Account.require_signin, Account.require_admin, Category.get_detail);

    // blog
    app.get('/blog/list', Blog.get_list);
    app.get('/blog/create', Blog.get_create);
    app.get('/blog/edit/:id', Blog.get_edit);
    app.post('/blog/save', Blog.post_save);
    app.post('/blog/remove', Blog.post_remove);
    app.get('/blog/:id', Blog.get_detail);
}