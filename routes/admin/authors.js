var express = require('express');
var router = express.Router();
var config = require('../../config');
var util = require('util');
var Author = require('../../models/author');

var debuglog = util.debuglog('mayizo:admin-authors');

/* GET authors */
router.get('/list', (req, res, next) => {
    Author.find({}, (err, authors) => {
        if (err) {
            return next(err);
        }
        res.render(res.view(), { authors: authors, pageTitle: 'Auteurs' });
    });
});

/* edit article */
router.route('/edit/:authorId')
      .get(function(req, res, next) {
            Author.findById(req.params.authorId, (err, author) => {
                if (err) {
                    return next(err);
                }
                res.render(res.view('..'), { author: author, csrfToken: req.csrfToken(), pageTitle: 'Modifier l\'auteur' });
            });
      })
      .post((req, res, next) => {
            var authr = req.body.author;
            var upd = {
                pseudo: authr.pseudo,
                reviewRequired: authr.reviewRequired,
                isReviewer: authr.isReviewer,
                isAdmin: authr.isAdmin
            };
            Author.findOneAndUpdate({ _id: req.params.authorId }, upd, { new: true }, (err, author) => {
                if (err) {
                    return next(err);
                }
                res.redirect('../list');
            });
      });


module.exports = router;

