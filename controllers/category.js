var Category = require('../models/category');
var _ = require('underscore');

/*** category ***/
exports.get_list = function (req, res) {
    Category.fetch(function (err, categories) {
        res.render('category/list', {
            title: '栏目列表',
            categories: categories
        })
    });
};

exports.get_create = function (req, res) {
    res.render('category/create', {
        title: '新增栏目',
        category: {}
    });
};

exports.get_edit = function (req, res) {
    var id = req.params.id;
    if (id) {
        Category.findById(id, function (err, cate) {
            res.render('category/create', {
                title: '编辑栏目',
                category: cate
            });
        })
    }
};

exports.post_save = function (req, res) {
    var cateForm = req.body.category;
    var id = cateForm._id;
    var _category;
    if (id) {
        Category.findById(id, function (err, category) {
            _category = _.extend(category, cateForm);
            _category.save(function (err, cate) {
                res.redirect('/category/' + cate._id);
            });
        })
    } else {
        var category = new Category({
            name: cateForm.name
        });
        category.save(function (err, cate) {
            res.redirect('/category/' + cate._id);
        });
    }
};

exports.post_remove = function (req, res) {
    var id = req.body.id;
    if (id) {
        Category.remove({
            _id: id
        }, function (err, cate) {
            if (err) {
                res.json({
                    success: 0
                });
            } else {
                res.json({
                    success: 1
                });
            }
        });
    }
};

exports.get_detail = function (req, res) {
    var id = req.params.id;
    if (id) {
        Category.findById(id, function (err, cate) {
            res.render('category/detail', {
                title: '栏目详情',
                category: cate
            });
        })
    }
};