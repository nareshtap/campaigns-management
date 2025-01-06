"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCampaign = exports.getCampaignById = exports.createCampaign = exports.getAllCampaigns = void 0;
const campaign_1 = __importDefault(require("../models/campaign"));
// Get all campaigns
const getAllCampaigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaigns = yield campaign_1.default.find();
        res.status(200).json(campaigns);
    }
    catch (err) {
        res.status(500).json({ error: err === null || err === void 0 ? void 0 : err.message });
    }
});
exports.getAllCampaigns = getAllCampaigns;
// Create a new campaign
const createCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { campaignType, startDate, endDate, schedule } = req.body;
    try {
        const newCampaign = new campaign_1.default({
            campaignType,
            startDate,
            endDate,
            schedule,
        });
        yield newCampaign.save();
        res.status(201).json(newCampaign);
    }
    catch (err) {
        res.status(500).json({ error: err === null || err === void 0 ? void 0 : err.message });
    }
});
exports.createCampaign = createCampaign;
// Get an existing campaign by ID
const getCampaignById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const getCampaign = yield campaign_1.default.findById(id);
        if (!getCampaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }
        res.status(200).json(getCampaign);
    }
    catch (err) {
        res.status(500).json({ error: err === null || err === void 0 ? void 0 : err.message });
    }
});
exports.getCampaignById = getCampaignById;
// Update an existing campaign
const updateCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { campaignType, startDate, endDate, schedule } = req.body;
    try {
        const updatedCampaign = yield campaign_1.default.findByIdAndUpdate(id, { campaignType, startDate, endDate, schedule }, { new: true });
        if (!updatedCampaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }
        res.status(200).json(updatedCampaign);
    }
    catch (err) {
        res.status(500).json({ error: err === null || err === void 0 ? void 0 : err.message });
    }
});
exports.updateCampaign = updateCampaign;
