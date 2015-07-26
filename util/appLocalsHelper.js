'use strict';
let markdown= require('../util/markdown');
let Roles = require('../models/role');

let loadRoles = (app) => {
	return Roles.findAll().then(roles => {
		app.locals.rolesList = roles;
		return Promise.resolve(app);
	}).catch(err => {
		return Promise.reject(err);
	});	
}

let addIsUserInRoleFn = (app) => {
	let fn = (user, roleCode) => {
		if(!user || !roleCode) {
			return false;
		}
		let role = app.locals.rolesList.find(x => x.code == roleCode);
		return role 
			&& role.id == user.roleId;	
	};
	app.locals.isUserInRole = fn;
	return Promise.resolve(app);
};

let addGetRoleNameFn = (app) => {
	let fn = (roleId) => {
	    let role = app.locals.rolesList.find(x => x.id == roleId);
	    return (role ? role.name : roleId);
	}; 	
	app.locals.getRoleName = fn;
	return Promise.resolve(app);
};

let addMarkdownFn = (app) => {
	app.locals.markdown = markdown;	
	return Promise.resolve(app);
};

function init(app) {
	return loadRoles(app)
				.then(addGetRoleNameFn)
				.then(addIsUserInRoleFn)
				.then(addMarkdownFn)
				.catch(err => {
					console.log(err);
					// TODO shutdown app
				});	
}

module.exports = {
	init: init	
};