var express = require('express');
var router = express.Router();
var config = require('../config');
var util = require('util');
var Article = require('../models/article');
var User = require('../models/user');
var Author = require('../models/author');

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

/* new article */
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
           res.render('admin/new-article', {article: art, pageTitle: 'Nouvel article' });
      })
      .post(function(req, res) {
            var art = req.body.article;
            var article = new Article({
                title: art.title,
                summary: art.summary,
                content: art.content,
                smallImage: art.smallImage,
                largeImage: art.largeImage,
                video: art.video,
                authors: [req.session.user.id]
            });
            article.save(function(err, article, next) {
                if(err) {
                    return res.json(err);   
                }
                res.redirect('/admin/articles');
            });
      });

/* edit article */
router.route('/edit-article/:articleId')
      .get(function(req, res) {
            Article.findById(req.params.articleId, function(err, article) {
                if (err) {
                    return res.json(err);
                }
                res.render('admin/edit-article', { article: article, pageTitle: 'Modifier l\'article' });
            });
      })
      .post(function(req, res) {   
            var art = req.body.article;
            var upd = {
                title: art.title,
                summary: art.summary,
                content: art.content,
                smallImage: art.smallImage,
                largeImage: art.largeImage,
                video: art.video,
                live: art.live,
                commentsAllowed: art.commentsAllowed,
                lastEditedDate: new Date(),
                lastEditors: [req.session.user.id]  
            };
            Article.findOneAndUpdate({ _id: req.params.articleId }, upd, { new: true }, function (err, article) {
                if(err) {
                    return res.json(err);   
                }
                res.redirect('/admin/articles');
            });
      });

/* GET preview article */
router.get('/preview-article/:articleId', function(req, res) {
    Article.findById(req.params.articleId, function(err, article) {
        if (err) {
            return res.json(err);
        }
        Article.find({ _id: { $ne: article.id } }).sort({ lastEditedDate: -1 }).limit(2).exec(function(err, relatedArticles) {
            if (err) {
                util.log(err);
            }
            var authorIds = article.authors;
            if(article.lastEditors) {
                authorIds = authorIds.concat(article.lastEditors);
            }
            Author.find({ userId: { $in: authorIds } }, function (err, authors) {
                if (err) {
                    return res.json(err);
                }       
                res.render('article', { article: article, relatedArticles: relatedArticles, authors: authors, pageTitle: 'Preview de l\'article' });
            })
        });
    });
});

module.exports = router;
