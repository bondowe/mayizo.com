var express = require('express');
var router = express.Router();
var config = require('../../config');
var util = require('util');
var Article = require('../../models/article');
var Author = require('../../models/author');

var debuglog = util.debuglog('mayizo:admin-articles');

/* GET articles list. */
router.get('/list', (req, res, next) => {
    Article.find()
           .sort({createdDate: -1})
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
            var art = {
                title: '',
                keywordsString: '',
                summary: '',
                content: '',
                smallImage: '',
                largeImage: '',
                video: ''
            };
           res.render(res.view(), {article: art, csrfToken: req.csrfToken(), pageTitle: 'Nouvel article' });
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
                res.render(res.view('..'), { article: article, csrfToken: req.csrfToken(), pageTitle: 'Modifier l\'article' });
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
                res.redirect('../list');
            });
      });

/* GET preview article */
router.get('/preview/:articleId', (req, res, next) => {
    Article.findById(req.params.articleId, (err, article) => {
        if (err) {
            return next(err);
        }
        Article.find({ _id: { $ne: article._id } })
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
                debuglog(authors);
                res.render('article', { article: article, relatedArticles: relatedArticles, authors: authors, pageTitle: 'Preview de l\'article' });
            })
        });
    });
});

module.exports = router;
