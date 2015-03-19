var express = require('express');
var router = express.Router();
var config = require('../config');
var util = require('util');
var Article = require('../models/article');
var User = require('../models/user');
var Author = require('../models/author');

var debuglog = util.debuglog('mayizo:admin');

/* GET articles list. */
router.get('/articles', (req, res, next) => {   
    Article.find()
           .sort({createdDate: -1})
           .exec((err, articles) => {
                if (err) {
                    return next(err);   
                }
                res.render('admin/articles', { articles: articles, pageTitle: 'Articles' });
            });
});

/* new article */
router.route('/new-article')
      .get((req, res) => {
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
      .post((req, res, next) => {
            var art = req.body.article;
            var article = new Article({
                title: art.title,
                keywords: art.keywords.toLowerCase().split(/\s*,\s*/).sort(),
                summary: art.summary,
                content: art.content,
                smallImage: art.smallImage,
                largeImage: art.largeImage,
                video: art.video,
                authors: [req.session.user._id]
            });
            article.save((err, article) => {
                if (err) {
                    return next(err);   
                }
                res.redirect('/admin/articles');
            });
      });

/* edit article */
router.route('/edit-article/:articleId')
      .get(function(req, res, next) {
            Article.findById(req.params.articleId, (err, article) => {
                if (err) {
                    return next(err);   
                }
                res.render('admin/edit-article', { article: article, pageTitle: 'Modifier l\'article' });
            });
      })
      .post((req, res, next) => {   
            var art = req.body.article;
            var upd = {
                title: art.title,
                keywords: art.keywords.toLowerCase().split(/\s*,\s*/).sort(),
                summary: art.summary,
                content: art.content,
                smallImage: art.smallImage,
                largeImage: art.largeImage,
                video: art.video,
                live: art.live,
                commentsAllowed: art.commentsAllowed,
                lastEditedDate: new Date(),
                lastEditors: [req.session.user._id]  
            };
            Article.findOneAndUpdate({ _id: req.params.articleId }, upd, { new: true }, (err, article) => {
                if (err) {
                    return next(err);   
                }
                res.redirect('/admin/articles');
            });
      });

/* GET preview article */
router.get('/preview-article/:articleId', (req, res, next) => {
    Article.findById(req.params.articleId, (err, article) => {
        if (err) {
            return next(err);   
        }
        Article.find({ _id: { $ne: article.id } })
               .sort({ lastEditedDate: -1 })
               .limit(2)
               .exec((err, relatedArticles) => {
            if (err) {
                return next(err);   
            }
            var authorIds = article.authors;
            if(article.lastEditors) {
                authorIds = authorIds.concat(article.lastEditors);
            }
            Author.find({ userId: { $in: authorIds } }, (err, authors) => {
                if (err) {
                    return next(err);   
                }       
                res.render('article', { article: article, relatedArticles: relatedArticles, authors: authors, pageTitle: 'Preview de l\'article' });
            })
        });
    });
});

/* GET authors */
router.get('/authors', (req, res, next) => {
    Author.find({}, (err, authors) => {
        if (err) {
            return next(err);   
        }
        res.render('admin/authors', { authors: authors, pageTitle: 'Auteurs' });
    });
});

/* edit article */
router.route('/edit-author/:authorId')
      .get(function(req, res, next) {
            Author.findById(req.params.authorId, (err, author) => {
                if (err) {
                    return next(err);   
                }
                res.render('admin/edit-author', { author: author, pageTitle: 'Modifier l\'auteur' });
            });
      })
      .post((req, res, next) => {   
            var authr = req.body.author;
            var upd = {
                pseudo: authr.pseudo
                
            };
            Author.findOneAndUpdate({ _id: req.params.authorId }, upd, { new: true }, (err, author) => {
                if (err) {
                    return next(err);   
                }
                res.redirect('/admin/authors');
            });
      });

module.exports = router;
