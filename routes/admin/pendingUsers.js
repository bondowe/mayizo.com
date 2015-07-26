'use strict';
let express = require('express');
let PendingUser = require('../../models/pendingUser');
let Role = require('../../models/role');

let router = express.Router();

router.get('/list', (req, res, next) => {
    PendingUser.findAll().then(pendingUser => {
        return res.render(res.view(), { pendingUsers: pendingUser, pageTitle: 'Utilisateurs en attente' });
    }).catch(err => {
        return next(err);
    });
});

router.route('/add')
      .get((req, res, next) => {
            let pendingUser = {
                email: ''
            };
            return res.render(res.view(), { pendingUser: pendingUser, csrfToken: req.csrfToken(), pageTitle: 'Nouvel utilisateur' });
      })
      .post((req, res, next) => {
            let document = {
                email: req.body.pendingUser.email,
                roleId: req.body.pendingUser.roleId,
                createdBy: req.session.currentUser._id
            };
            PendingUser.createNew(document).then(pendingUser => {              
                return res.redirect('list');
            }).catch(err => {
                return next(err);
            });
      });
        
router.route('/edit/:pendingUserId')
      .get((req, res, next) => {
            PendingUser.getById(req.params.pendingUserId).then(pendingUserId => {
                return res.render(res.view('..'), { pendingUser: pendingUserId, csrfToken: req.csrfToken(), pageTitle: 'Modifier l\'utilisateur' });
            }).catch(err => {
                return next(err);
            });
      })
      .post((req, res, next) => {
            let upd = {
                email: req.body.pendingUser.email,
                roleId: req.body.pendingUser.roleId
            };
            PendingUser.updateOne(req.params.pendingUserId, upd)
                       .then(pendingUser => {
                            return res.redirect('../list');
            }).catch(err => {
                return next(err);
            });
      });

router.route('/delete/:pendingUserId')
      .post((req, res, next) => {
            PendingUser.delete(req.params.pendingUserId).then(() => {
               return res.redirect('../list');
            }).catch(err => {
               return next(err);
            });
      });
	  
module.exports = router;
