"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controllers/reviewController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticate, reviewController_1.createReview);
router.get('/equipment/:equipmentId', reviewController_1.getEquipmentReviews);
exports.default = router;
