const express = require('express');
const router = express.Router();
const userController = require('../../controllers/UserController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), userController.getUser)

module.exports = router;
