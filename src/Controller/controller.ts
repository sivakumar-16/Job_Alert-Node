import { Request, Response } from 'express';
import {  getZohoAuthToken, saveToken } from '../Services/services';
import { getTimeLog } from '../Services/zohoServices';


export const getAccessToken = async (req: Request, res: Response) => {

  try {
    const { access_token, refresh_token, expires_in } = await getZohoAuthToken();
    console.log("Token received", { access_token, refresh_token, expires_in });
    await saveToken(access_token, refresh_token, expires_in);
    return res.json({ access_token, refresh_token, expires_in });
  } catch (error) {
    console.error('Error generating access token:', error);
    res.status(500).json({ error: 'Failed to generate access token' });
  }
};


export const getZohoTimeLogs = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate, billingStatus, jobId, user,  } = req.query;
    const timeLogs = await getTimeLog(String(fromDate), String(toDate), String(billingStatus), String(jobId), String(user));
    res.json(timeLogs);
  } catch (error) {
    console.error('Error fetching time logs:', error);
    res.status(500).json({ error: 'Failed to fetch time logs' });
  }
};
