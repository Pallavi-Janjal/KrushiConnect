"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const smartMatchController_1 = require("../controllers/smartMatchController");
const router = (0, express_1.Router)();
router.post('/', smartMatchController_1.getSmartMatches);
exports.default = router;
