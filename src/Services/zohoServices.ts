import axios from "axios";
import { getLatestToken } from "./services";
import { AppDataSource } from "../../dbConfig";
import { Job } from "../Models/timeLog";


export const getTimeLog = async (
  fromDate: string,
  toDate: string,
  billingStatus: string,
  jobId: string,
  user: string
) => {
  try {
    const token = await getLatestToken();

    if (!token) {
      throw new Error("No valid access token found");
    }

    const url = `https://people.zoho.com/people/api/timetracker/gettimelogs`;
    const params = {
      user,
      jobId,
      fromDate,
      toDate,
      billingStatus,
    };

    const response = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token.access_token}`,
      },
      params,
    });

    console.log("response", response.data);

    // Check if the response structure is correct
    if (!response.data || !response.data.response || !Array.isArray(response.data.response.result)) {
      throw new Error("Invalid response data: result not found or not an array");
    }
   
    const timeLogs = response.data.response.result
        .map((log: any) => ({
      firstname: log.employeeFirstName,
      jobname: log.jobName,
      workdate: log.workDate,
      hours: log.hours,
    }));
    if (timeLogs.length === 0) {
      throw new Error("No valid timelogs found");
    }

    // Store in database
    const timeLogRepository = AppDataSource.getRepository(Job);
    await timeLogRepository.save(timeLogs);

    return timeLogs;
  } catch (error) {
    console.error("Error fetching time logs:", error);
    throw error;
  }
};

