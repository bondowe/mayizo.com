'use strict';
let express = require('express');
let PendingUser = require('../../models/pendingUser');
let Role = require('../../models/role');

let router = express.Router();

router.get('/list', (req, res, next) => {
    let pendingUsersPromise = PendingUser.findAll();
    let rolesPromise = Role.findAll();
    Promise.all([pendingUsersPromise, rolesPromise]).then(result => {
        res.render(res.view(), { pendingUsers: result[0], roles: result[1], pageTitle: 'Utilisateurs en attente' });
    }).catch(err => {
        // TODO Log err
    });
});

router.route('/add')
      .get((req, res, next) => {
            let pendingUserPromise = Promise.resolve(
                new PendingUser({
                        email: ''
                }));
            let rolesPromise = Role.findAll();
            Promise.all([pendingUserPromise, rolesPromise]).then(result => {
                res.render(res.view(), {pendingUser: result[0], roles: result[1], csrfToken: req.csrfToken(), pageTitle: 'Nouvel utilisateur' });
            }).catch(err => {
                // TODO Log&render err
            });
      })
      .post((req, res, next) => {
            let document = {
                email: req.body.pendingUser.email,
                roleId: req.body.pendingUser.roleId,
                createdBy: req.session.user._id
            };
            PendingUser.createNew(document).then(pendingUser => {              
                res.redirect('list');
            }).catch(err => {
                // TODO Log&render err
            });
      });
        
router.route('/edit/:pendingUserId')
      .get((req, res, next) => {
            let pendingUserPromise = PendingUser.getById(req.params.pendingUserId);
            let rolesPromise = Role.findAll();
            Promise.all([pendingUserPromise, rolesPromise]).then(result => {
                res.render(res.view('..'), { pendingUser: result[0], roles: result[1], csrfToken: req.csrfToken(), pageTitle: 'Modifier l\'utilisateur' });
            }).catch(err => {
                // TODO Log&render err
            });
      })
      .post((req, res, next) => {
            let upd = {
                email: req.body.pendingUser.email,
                roleId: req.body.pendingUser.roleId
            };
            PendingUser.updateOne(req.params.pendingUserId, upd)
                       .then(pendingUser => {
                            res.redirect('../list');
            }).catch(err => {
                console.log(err);
                // TODO Log&render err
            });
      });

router.route('/delete/:pendingUserId')
      .post((req, res, next) => {
            PendingUser.delete(req.params.pendingUserId).then(() => {
               res.redirect('../list');
            }).catch(err => {
               // TODO Log&render err
            });
      });
	  
module.exports = router;
