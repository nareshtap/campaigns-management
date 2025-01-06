import React, { useState, useEffect } from "react";

import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Grid,
  Chip,
  Typography,
} from "@mui/material";
import { Schedule } from "@/types/campaign";
import styles from "./campaign.module.css";

interface CampaignFormProps {
  onClose: () => void;
  campaign?: any;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ onClose, campaign }) => {
  const [campaignType, setCampaignType] = useState("Cost per Click");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [schedule, setSchedule] = useState<Schedule[]>([
    { weekdays: [], startTime: "", endTime: "" },
  ]);

  useEffect(() => {
    if (campaign) {
      const { campaignType, startDate, endDate, schedule } = campaign;
      setCampaignType(campaignType);
      setStartDate(formatDateForInput(startDate));
      setEndDate(formatDateForInput(endDate));
      setSchedule(formatSchedule(schedule));
    }
  }, [campaign]);

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const convertTo24HourTime = (timeString: string) => {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const formatSchedule = (schedule: any[]) => {
    return schedule.map(({ startTime, endTime, ...rest }) => ({
      ...rest,
      startTime: convertTo24HourTime(startTime),
      endTime: convertTo24HourTime(endTime),
    }));
  };

  const formatTimeToAMPM = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${period}`;
  };

  const handleSubmit = async () => {
    const campaignData = {
      campaignType,
      startDate,
      endDate,
      schedule: schedule.map(({ startTime, endTime, ...rest }) => ({
        ...rest,
        startTime: formatTimeToAMPM(startTime),
        endTime: formatTimeToAMPM(endTime),
      })),
    };

    try {
      const method = campaign ? "PATCH" : "POST";
      const url = campaign
        ? `${process.env.NEXT_PUBLIC_API_URL}/campaigns/${campaign._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/campaigns`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      });

      if (response.ok) {
        setSchedule([{ weekdays: [], startTime: "", endTime: "" }]);
        onClose();
      } else console.error("Error creating/updating campaign");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleScheduleChange = (
    index: number,
    field: keyof Schedule,
    value: any
  ) => {
    setSchedule((prevSchedule) => {
      const updatedSchedule = [...prevSchedule];
      updatedSchedule[index][field] = value;
      return updatedSchedule;
    });
  };

  const handleAddSchedule = () => {
    setSchedule((prevSchedule) => [
      ...prevSchedule,
      { weekdays: [], startTime: "", endTime: "" },
    ]);
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedule((prevSchedule) => prevSchedule.filter((_, i) => i !== index));
  };

  const renderScheduleFields = (item: Schedule, index: number) => (
    <Box key={`schedule-${index}`} sx={{ marginBottom: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Weekdays</InputLabel>
            <Select
              multiple
              value={item.weekdays}
              onChange={(e) =>
                handleScheduleChange(index, "weekdays", e.target.value)
              }
              label="Weekdays"
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} sx={{ margin: 0.5 }} />
                  ))}
                </Box>
              )}
            >
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Start Time"
            type="time"
            fullWidth
            value={item.startTime}
            onChange={(e) =>
              handleScheduleChange(index, "startTime", e.target.value)
            }
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="End Time"
            type="time"
            fullWidth
            value={item.endTime}
            onChange={(e) =>
              handleScheduleChange(index, "endTime", e.target.value)
            }
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
          />
        </Grid>
      </Grid>

      <Button
        variant="outlined"
        color="error"
        sx={{ marginTop: 2 }}
        onClick={() => handleRemoveSchedule(index)}
      >
        Remove Schedule
      </Button>
    </Box>
  );

  return (
    <Box className={styles.formWrapper}>
      <Typography variant="h5" gutterBottom>
        {campaign ? "Edit Campaign" : "Create New Campaign"}
      </Typography>

      <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
        <InputLabel>Campaign Type</InputLabel>
        <Select
          value={campaignType}
          onChange={(e) => setCampaignType(e.target.value)}
          label="Campaign Type"
        >
          {["Cost per Order", "Cost per Click", "Buy One Get One"].map(
            (type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="End Date"
            type="date"
            fullWidth
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Box className={styles.scheduleWrapper} sx={{ margin: "24px 0" }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            mb: 3,
          }}
        >
          Campaign Schedule
        </Typography>
        {schedule.map(renderScheduleFields)}

        <Button
          className={styles.btnSchedule}
          variant="contained"
          sx={{ marginTop: 2 }}
          onClick={handleAddSchedule}
        >
          Add Schedule
        </Button>
      </Box>

      <Button
        variant="contained"
        className={styles.btnSchedule}
        fullWidth
        sx={{ marginTop: 3 }}
        onClick={handleSubmit}
      >
        {campaign ? "Update Campaign" : "Create Campaign"}
      </Button>
    </Box>
  );
};

export default CampaignForm;
