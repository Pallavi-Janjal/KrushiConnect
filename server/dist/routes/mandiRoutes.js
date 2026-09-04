"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mandiController_1 = require("../controllers/mandiController");
const router = (0, express_1.Router)();
router.get('/', mandiController_1.getMandiRates);
exports.default = router;
