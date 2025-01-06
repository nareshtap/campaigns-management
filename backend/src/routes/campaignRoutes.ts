import express from "express";

import {
  getAllCampaigns,
  createCampaign,
  getCampaignById,
  updateCampaign,
} from "../controllers/campaignController";

const router = express.Router();

router.get("/", getAllCampaigns);
router.post("/", createCampaign);
router.get("/:id", getCampaignById);
router.patch("/:id", updateCampaign);

export default router;
