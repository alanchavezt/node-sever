const express = require('express');
const router = express.Router();
const userController = require('../../controllers/UserController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), userController.getAllUsers)
    .post(verifyRoles(ROLES_LIST.Admin), userController.createNewUser);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), userController.getUser)
    .put(verifyRoles(ROLES_LIST.Admin), userController.updateUser)
    .delete(verifyRoles(ROLES_LIST.Admin), userController.deleteUser);

module.exports = router;
