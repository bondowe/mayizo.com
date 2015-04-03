var express = require('express');
var router = express.Router();
var config = require('../../config');
var util = require('util');
var User = require('../../models/user');

var debuglog = util.debuglog('mayizo:admin-users');

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

