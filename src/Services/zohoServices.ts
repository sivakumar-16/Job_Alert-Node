import axios from 'axios';
import { getLatestToken } from './services';


export const getTimeLog = async (fromDate: string, toDate: string, billingStatus: string, jobId: string, user: string) => {
  const token = await getLatestToken();

  if (!token) {
    throw new Error('No valid access token found');
  }

  const url = `https://people.zoho.com/people/api/timetracker/gettimelogs`;
  const params = {
    user,
    jobId,
    fromDate,
    toDate,
    billingStatus
  };

  const response = await axios.get(url, {
    headers: {
      Authorization: `Zoho-oauthtoken ${token.access_token}`,
    },
    params,
  });
  console.log("response",response.data);
  
  return response.data;
};


