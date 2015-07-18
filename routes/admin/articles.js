"use strict"
let express = require('express');
let config = require('../../config');
let util = require('util');
let Article = require('../../models/article');
let Author = require('../../models/author');
let articleUtils = require('../../util/articles')

let router = express.Router();

/* GET articles list. */
router.get('/list', (req, res, next) => {
    Article.find()
           .sort({ createdDate: -1 })
           .exec((err, articles) => {
                if (err) {
                    return next(err);
                }
                res.render(res.view(), { articles: articles, pageTitle: 'Articles' });
            });
});

/* new article */
router.route('/add')
      .get((req, res) => {
            let art = {
                title: '',
                keywordsString: '',
                summary: '',
                content: '',
                smallImage: '',
                largeImage: '',
                video: '',
                authorsOverride: req.session.user.username
            };
           res.render(res.view(), {article: art, csrfToken: req.csrfToken(), pageTitle: 'Nouvel article' });
      })
      .post((req, res, next) => {
            let art = req.body.article;
            let article = new Article({
                title: art.title,
                keywords: art.keywords.toLowerCase().split(/\s*,\s*/).sort(),
                summary: art.summary,
                content: art.content,
                smallImage: art.smallImage,
                largeImage: art.largeImage,
                video: art.video,
                authors: [req.session.user._id],
                authorsOverride: art.authorsOverride
            });
            article.save((err, article) => {
                if (err) {
                    return next(err);
                }
                res.redirect('list');
            });
      });

/* edit article */
router.route('/edit/:articleId')
      .get(function(req, res, next) {
            Article.findById(req.params.articleId, (err, article) => {
                if (err) {
                    return next(err);
                }
                let articleAuthors = (article.authorsOverride != undefined 
                                      && article.authorsOverride != null
                                      && article.authorsOverride.trim().length > 0)
                                   ? article.authorsOverride
                                   : req.session.user.username;
                article.authorsOverride = articleAuthors;
                res.render(res.view('..'), { 
                    article: article, 
                    csrfToken: req.csrfToken(), 
                    pageTitle: 'Modifier l\'article' });
            });
      })
      .post((req, res, next) => {
            let art = req.body.article;
            let upd = {
                title: art.title,
                keywords: art.keywords.toLowerCase().split(/\s*,\s*/).sort(),
                summary: art.summary,
                content: art.content,
                smallImage: art.smallImage,
                largeImage: art.largeImage,
                video: art.video,
                authorsOverride: art.authorsOverride,
                live: art.live,
                commentsAllowed: art.commentsAllowed,
                lastEditedDate: new Date(),
                lastEditors: [req.session.user._id]
            };
            Article.findOneAndUpdate({ _id: req.params.articleId }, upd, { new: true }, (err, article) => {
                if (err) {
                    return next(err);
                }
                res.redirect('../list');
            });
      });

/* GET preview article */
router.get('/preview/:articleId', (req, res, next) => {
    return articleUtils.getArticleWithRelated({ _id: req.params.articleId }, res, next);
});

module.exports = router;
