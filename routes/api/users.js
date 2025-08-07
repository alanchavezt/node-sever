const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);
    // TODO: Implement create user functionality
    // .post(verifyRoles(ROLES_LIST.Admin), usersController.createNewUser);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser)
    // TODO: Implement update user functionality, probably move the deleteUser to from '/' to '/:id'
    // .put(verifyRoles(ROLES_LIST.Admin), usersController.updateUser)
    // .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

module.exports = router;
