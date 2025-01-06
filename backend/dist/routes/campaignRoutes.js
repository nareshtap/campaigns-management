"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const campaignController_1 = require("../controllers/campaignController");
const router = express_1.default.Router();
router.get("/", campaignController_1.getAllCampaigns);
router.post("/", campaignController_1.createCampaign);
router.get("/:id", campaignController_1.getCampaignById);
router.patch("/:id", campaignController_1.updateCampaign);
exports.default = router;
