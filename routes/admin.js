var express = require('express');
var router = express.Router();
var config = require('../config');
var Article = require('../models/article');

/* GET articles list. */
router.get('/articles', function(req, res) {
    
    Article.find().sort({createdDate: -1}).exec(function(err, articles) {       
        res.render('admin/articles', { articles: articles, pageTitle: 'Articles' });
    });
});

/* GET new article */
router.route('/new-article')
      .get(function(req, res) {
           res.render('admin/new-article', { pageTitle: 'Nouvel Article' });
      })
      .post(function(req, res) {
    
            var art = req.body.article;
    
            var article = new Article({
                title: art.title,
                summary: art.summary,
                content: art.content,
                smallImage: art.smallImage || undefined,
                largeImage: art.largeImage || undefined,
                video: art.video || undefined               
            });
    
            article.save(function(err, article, next) {
                if(err) {
                    return res.json(err);   
                }
                res.redirect('/admin/articles');
            });
      });

module.exports = router;
