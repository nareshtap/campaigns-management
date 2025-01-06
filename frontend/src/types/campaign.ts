export interface Schedule {
  weekdays: string[];
  startTime: string;
  endTime: string;
  _id?: string;
}

export interface Campaign {
  _id: string;
  campaignType: string;
  startDate: string;
  endDate: string;
  schedule: Schedule[];
  __v: number;
}

export interface CampaignsResponse {
  campaigns: Campaign[];
}
