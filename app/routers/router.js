const express = require('express');
const router = express.Router();
const controller = require('../controller/controller.js');
const varifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');

// -> For add new User
router.post('/signup', [varifySignUp.checkDuplicateUserNameOrEmail, varifySignUp.checkRolesExisted], controller.signup);

// -> SignIn newly created user
router.post('/signin', controller.signin);

// -> If role is user
router.get('/test/user', [authJwt.verifyToken], controller.userContent);

// -> If role is ADMIN or SUPERUSER
router.get('/superuser', [authJwt.verifyToken, authJwt.isSuperuserOrAdmin], controller.managementBoard);

// -> If role is ADMIN
router.get('/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);

module.exports = router;