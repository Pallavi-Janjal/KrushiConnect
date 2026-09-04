"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usageController_1 = require("../controllers/usageController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, (0, auth_1.requireRole)(['EQUIPMENT_OWNER', 'equipment_owner']), usageController_1.getOwnerUsageLogs);
router.post('/', auth_1.authenticate, (0, auth_1.requireRole)(['EQUIPMENT_OWNER', 'equipment_owner']), usageController_1.createUsageLog);
exports.default = router;
