var Blog = require('../models/blog');
var Category = require('../models/category');
var _ = require('underscore');

/*** blog ***/
exports.get_list = function (req, res) {
    Blog
        .find({})
        .populate('category account')
        .exec(function (err, blogs) {
            res.render('blog/list', {
                title: '博客列表',
                blogs: blogs
            });
        });
};

exports.get_create = function (req, res) {
    Category.fetch(function (err, categories) {
        res.render('blog/create', {
            title: '发布博客',
            blog: {},
            categories: categories
        });
    })
};

exports.get_edit = function (req, res) {
    var id = req.params.id;
    if (id) {
        Blog.findById(id, function (err, blog) {
            Category.fetch(function (err, cates) {
                res.render('blog/create', {
                    title: '编辑',
                    blog: blog,
                    categories: cates
                })
            })
        });
    }
};

exports.post_save = function (req, res) {
    var blogForm = req.body.blog;
    var id = blogForm._id;
    var cid = blogForm.category;
    var _blog;
    var account = req.session.account._id;
    if (id) {
        Blog.findById(id, function (err, blog) {
            // 判断博客栏目是否修改
            if (blog.category != cid) {
                // 从原栏目中移除该博客ID
                Category.findById(blog.category, function (err, cate) {

                    for (var i = 0; i < cate.blogs.length; i++) {
                        if (cate.blogs[i].toString() == blog._id.toString()) {
                            cate.blogs.splice(i, 1);
                            cate.save(function (err, c) {});
                            break;
                        }
                    }
                });
                // 向新栏目中加入博客ID
                Category.findById(cid, function (err, cate) {
                    cate.blogs.push(blog._id);
                    cate.save(function (err, c) {});
                });
            }

            // 保存博客
            _blog = _.extend(blog, blogForm);
            _blog.save(function (err, b) {
                res.redirect('/blog/' + b._id);
            });
        })
    } else {
        _blog = new Blog(blogForm);
        _blog.account = account;

        _blog.save(function (err, blog) {
            Category.findById(cid, function (err, cate) {
                cate.blogs.push(blog._id);
                cate.save(function (err, c) {
                    res.redirect('/blog/' + blog._id);
                });
            })
        });
    }
};

exports.post_remove = function (req, res) {
    var id = req.body.id;
    if (id) {
        Blog.findById(id, function (err, blog) {
            // 现将该博客从所属栏目中删除掉
            Category.findById(blog.category, function (err, cate) {
                for (var i = 0; i < cate.blogs.length; i++) {
                    if (cate.blogs[i].toString() == id.toString()) {
                        cate.blogs.splice(i, 1);
                        cate.save(function (err, c) {});
                        break;
                    }
                }
            });
            // 删除博客
            Blog.remove({
                _id: id
            }, function (err, blog) {
                if (!err) {
                    res.json({
                        success: 1
                    });
                }
            })
        });
    }
};

exports.get_detail = function (req, res) {
    var id = req.params.id;
    if (id) {
        Blog
            .findOne({
                _id: id
            })
            .populate('category')
            .exec(function (err, blog) {
                res.render('blog/detail', {
                    title: '详情页',
                    blog: blog
                });
            });
    }
};