"use client";

import React, { useCallback, useEffect, useState } from "react";
import CampaignForm from "./campaignForm";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import styles from "./campaign.module.css";

const CampaignTable: React.FC = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isCampaignFormOpen, setIsCampaignFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentCampaign, setCurrentCampaign] = useState<any>(null);

  const formatDate = (date: string) => {
    const options: any = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // const getNextScheduledActivation = (schedule: any[], startDate: string) => {
  //   const now = new Date();

  //   const start = new Date(startDate);

  //   if (start > now) {
  //     return `${formatDate(startDate)} ${schedule[0]?.startTime}`;
  //   }

  //   for (const sch of schedule) {
  //     const weekdays = sch.weekdays;
  //     const startTime = sch.startTime;
  //     const endTime = sch.endTime;

  //     for (let i = 0; i < weekdays.length; i++) {
  //       const weekday = weekdays[i];
  //       const weekdayIndex = [
  //         "Sunday",
  //         "Monday",
  //         "Tuesday",
  //         "Wednesday",
  //         "Thursday",
  //         "Friday",
  //         "Saturday",
  //       ].indexOf(weekday);

  //       const nextActivation = new Date(now);
  //       nextActivation.setDate(
  //         now.getDate() + ((weekdayIndex + 7 - now.getDay()) % 7)
  //       );

  //       return `${formatDate(nextActivation.toISOString())} ${startTime}`;
  //     }
  //   }

  //   return "N/A";
  // };

  const fetchCampaigns = useCallback(() => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns`)
      .then((response) => response.json())
      .then((data) => {
        setCampaigns(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching campaigns:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleCampaignFormToggle = useCallback(() => {
    setIsCampaignFormOpen((prev) => !prev);
    setCurrentCampaign(null);
  }, []);

  const handleCampaignFormClose = useCallback(() => {
    setIsCampaignFormOpen(false);
    fetchCampaigns();
    setCurrentCampaign(null);
    setSnackbarMessage("Campaign saved successfully!");
    setOpenSnackbar(true);
  }, [fetchCampaigns]);

  const handleEditClick = (campaign: any) => {
    setCurrentCampaign(campaign);
    setIsCampaignFormOpen(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className={styles.contentBody}>
      <div className={styles.containerLarge}>
        <div>
          <div className={styles.btnAdd}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCampaignFormToggle}
            >
              Add
            </Button>
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <CircularProgress />
            </div>
          ) : (
            <table className={styles.tableWrapper}>
              <thead>
                <tr>
                  <th>Campaign Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  {/* <th>Next Scheduled Activation</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <div className={styles.noDataFound}>No Data Found</div>
                    </td>
                  </tr>
                )}
                {campaigns.map((campaign) => (
                  <tr key={campaign._id}>
                    <td>{campaign.campaignType}</td>
                    <td>{formatDate(campaign.startDate)}</td>
                    <td>{formatDate(campaign.endDate)}</td>
                    {/* <td>
                      {getNextScheduledActivation(
                        campaign.schedule,
                        campaign.startDate
                      )}
                    </td> */}
                    <td>
                      <button
                        className={styles.btnIcon}
                        onClick={() => handleEditClick(campaign)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <Dialog
            open={isCampaignFormOpen}
            onClose={handleCampaignFormToggle}
            aria-labelledby="campaign-form-dialog"
            fullWidth
            className={styles.modalWrapper}
          >
            <DialogTitle id="campaign-form-dialog">
              {currentCampaign ? "Edit Campaign" : "Add Campaign"}
            </DialogTitle>
            <DialogContent>
              <CampaignForm
                onClose={handleCampaignFormClose}
                campaign={currentCampaign}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCampaignFormToggle} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
};

export default CampaignTable;
