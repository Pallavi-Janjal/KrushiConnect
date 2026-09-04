"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyticsController_1 = require("../controllers/analyticsController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/owner', auth_1.authenticate, (0, auth_1.requireRole)(['EQUIPMENT_OWNER', 'equipment_owner']), analyticsController_1.getOwnerAnalytics);
exports.default = router;
