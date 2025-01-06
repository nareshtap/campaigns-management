import { Request, Response } from "express";

import Campaign from "../models/campaign";

// Get all campaigns
export const getAllCampaigns = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
};

// Create a new campaign
export const createCampaign = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { campaignType, startDate, endDate, schedule } = req.body;

  try {
    const newCampaign = new Campaign({
      campaignType,
      startDate,
      endDate,
      schedule,
    });
    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
};

// Get an existing campaign by ID
export const getCampaignById = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  const { id } = req.params;
  try {
    const getCampaign = await Campaign.findById(id);
    if (!getCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json(getCampaign);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
};

// Update an existing campaign
export const updateCampaign = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  const { id } = req.params;
  const { campaignType, startDate, endDate, schedule } = req.body;

  try {
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      id,
      { campaignType, startDate, endDate, schedule },
      { new: true }
    );
    if (!updatedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json(updatedCampaign);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
};
