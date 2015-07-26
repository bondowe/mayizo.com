'use strict';
let express = require('express');
let User = require('../../models/user');

let router = express.Router();

router.get('/list', (req, res, next) => {
    User.findAll().then(users => {
        return res.render(res.view(), { users: users, pageTitle: 'Utilisateurs' });
    }).catch(err => {
        return next(err);
    });
});
        
router.route('/edit/:userId')
      .get((req, res, next) => {
            User.getById(req.params.userId).then(user => {
                return res.render(res.view('..'), { user: user, csrfToken: req.csrfToken(), pageTitle: 'Modifier l\'utilisateur' });
            }).catch(err => {
                return next(err);
            });
      })
      .post((req, res, next) => {
            let upd = {
                email: req.body.user.email,
                roleId: req.body.user.roleId
            };
            User.updateOne(req.params.userId, upd).then(user => {
                return res.redirect('../list');
            }).catch(err => {
                return next(err);
            });
      });

router.route('/delete/:userId')
      .post((req, res, next) => {
            User.delete(req.params.userId).then(() => {
               return res.redirect('../list');
            }).catch(err => {
               return next(err);
            });
      });
	  
module.exports = router;
