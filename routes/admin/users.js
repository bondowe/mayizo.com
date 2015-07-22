'use strict';
let express = require('express');
let config = require('../../config');
let util = require('util');
let User = require('../../models/user');
let Author = require('../../models/author');

let router = express.Router();

/* GET authors */
router.get('/list', (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) {
            return next(err);
        }
        res.render(res.view(), { users: users, pageTitle: 'Utilisateurs' });
    });
});

/* edit article */
router.route('/edit/:userId')
      .get(function(req, res, next) {
            User.findById(req.params.userId, (err, user) => {
                if (err) {
                    return next(err);
                }
                res.render(res.view('..'), { user: user, csrfToken: req.csrfToken(), pageTitle: 'Modifier l\'utilisateur' });
            });
      })
      .post((req, res, next) => {
            let authr = req.body.author;
            let upd = {
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

