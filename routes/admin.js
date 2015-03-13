var express = require('express');
var router = express.Router();
var config = require('../config');
var util = require('util');
var Article = require('../models/article');
var User = require('../models/user');

var debuglog = util.debuglog('mayizo:admin');

/* GET articles list. */
router.get('/articles', function(req, res) {
    
    Article.find()
            .sort({createdDate: -1})
            .exec(function(err, articles) {
                User.find({ _id: { $in: articles.reduce(function (list, article) { return list.concat(article.authors);  }, []) }})
                    .exec(function(err, auths) {
                        res.render('admin/articles', { articles: articles, authors: auths, pageTitle: 'Articles' });
                    });
            });
});

/* GET new article */
router.route('/new-article')
      .get(function(req, res) {
            var art = {
                title: '',
                summary: '',
                content: '',
                smallImage: '',
                largeImage: '',
                video: ''
            };
           res.render('admin/new-article', {article: art, pageTitle: 'Nouvel Article' });
      })
      .post(function(req, res) {
            var art = req.body.article;
            var article = new Article({
                title: art.title,
                summary: art.summary,
                content: art.content,
                smallImage: art.smallImage || undefined,
                largeImage: art.largeImage || undefined,
                video: art.video || undefined,
                authors: [req.session.user]
            });
            article.save(function(err, article, next) {
                if(err) {
                    return res.json(err);   
                }
                res.redirect('/admin/articles');
            });
      });

/* GET new article */
router.route('/edit-article/:articleId')
      .get(function(req, res) {
            Article.findById(req.params.articleId, function(err, article) {
                if (err) {
                    return res.json(err);
                }
                res.render('admin/edit-article', { article: article, pageTitle: 'Nouvel Article' });
            });
      })
      .post(function(req, res) {   
            var art = req.body.article;  
            var article = new Article({
                title: art.title,
                summary: art.summary,
                content: art.content,
                smallImage: art.smallImage || undefined,
                largeImage: art.largeImage || undefined,
                video: art.video || undefined,
                authors: [req.session.user]
            });  
            article.save(function(err, article, next) {
                if(err) {
                    return res.json(err);   
                }
                res.redirect('/admin/articles');
            });
      });

module.exports = router;
