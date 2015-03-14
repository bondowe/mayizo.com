var express = require('express');
var router = express.Router();
var util = require('util');
var Article = require('../models/article');
var User = require('../models/user');
var Author = require('../models/author');

/* GET home page. */
router.get('/', function(req, res) {
    Article.find().sort({ lastEditedDate: -1 }).limit(9).exec(function(err, articles) {
        if (err) {
            util.log(err);
        }
        var leadArticle = articles[0];
        var articlesList = articles.slice(1);
        res.render('index', { leadArticle: leadArticle, articlesList: articlesList, pageTitle: 'Acceuil' });
    });
});

/* GET article page. */
router.get('/article/:articleId', function(req, res) {
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
                res.render('article', { article: article, relatedArticles: relatedArticles, authors: authors, pageTitle: 'Article' });
            })
        });
    });
});

module.exports = router;
