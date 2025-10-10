const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/RoleController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), roleController.getAllRoles)
    .post(verifyRoles(ROLES_LIST.Admin), roleController.createRole);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), roleController.getRoleById)
    .put(verifyRoles(ROLES_LIST.Admin), roleController.updateRole)
    .delete(verifyRoles(ROLES_LIST.Admin), roleController.deleteRole);

module.exports = router;