'use strict'
let express = require('express');
let util = require('util');
let Article = require('../models/article');
let User = require('../models/user');
let Author = require('../models/author');
let articleUtils = require('../util/articles')

let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    console.log(req.user);
    Article.find({ live: true })
           .sort({ lastEditedDate: -1 })
           .limit(9)
           .exec((err, articles) => {
        if (err) {
            return next(err);
        }
        let leadArticle = articles[0];
        let articlesList = articles.slice(1);
        // res.cacheFor(180);
        res.render('index', { leadArticle: leadArticle, articlesList: articlesList, pageTitle: 'Acceuil' });
    });
});

/* GET about us page. */
router.get('/about-us', (req, res) => {
    // res.cacheFor(180);
    res.render(res.view(), { pageTitle: 'Qui somme-nous?' });
});

/* GET about us page. */
router.get('/contact-us', (req, res) => {
    // res.cacheFor(180);
    res.render(res.view(), { pageTitle: 'Contact' });
});

/* GET article page. */
router.get('/article/:articleId', (req, res, next) => {
    return articleUtils.getArticleWithRelated({ _id: req.params.articleId, live: true }, res, next);
});

/* GET archives page. */
router.get('/archives', (req, res, next) => {
    let skip = +req.query.skip || 0;
    let limit = 8;
    Article.find({ live: true })
           .sort({ createdDate: -1 })
           .skip(skip)
           .limit(limit + 1)
           .exec((err, articles) => {
                if (err) {
                    return next(err);
                }
                let hasPrev = (skip > 0)
                let prevSkip = Math.max(0, skip - limit);
                let hasNext = articles.length > limit;
                let nextSkip = 0;
                if(hasNext) {
                    nextSkip = skip + limit;
                }
                if(articles.length > limit) {
                    articles.pop();   
                }
                res.render(res.view(), { 
                    articlesList: articles, 
                    hasPrev: hasPrev, 
                    prevSkip: prevSkip, 
                    hasNext:hasNext, 
                    nextSkip: nextSkip, 
                    limit: limit, 
                    pageTitle: 'Archives' });
                });
    });

/* GET archives page. */
router.get('/search', (req, res, next) => {
    let term = req.query.term;
    let skip = +req.query.skip || 0;
    let limit = 8;
    Article.find({ live: true, $text: { $search: term } }, { score: { $meta: "textScore" } })
           .sort({ score: { $meta: "textScore" } })
           .skip(skip)
           .limit(limit + 1)
           .exec((err, articles) => {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                let hasPrev = (skip > 0)
                let prevSkip = Math.max(0, skip - limit);
                let hasNext = articles.length > limit;
                let nextSkip = 0;
                if(hasNext) {
                    nextSkip = skip + limit;
                }
                if(articles.length > limit) {
                    articles.pop();   
                }
                res.render(res.view(), { 
                    term: term,
                    articlesList: articles, 
                    hasPrev: hasPrev, 
                    prevSkip: prevSkip, 
                    hasNext:hasNext, 
                    nextSkip: nextSkip, 
                    limit: limit, 
                    pageTitle: 'Recherche' });
                });
    });

module.exports = router;
