import axios from "axios";
import qs from "qs";
import { AppDataSource } from "../../dbConfig";
import { AccessToken } from "../Models/token";
import util from "util";
import { addSeconds } from "date-fns";

const url = "https://accounts.zoho.com/oauth/v2/token";

// Get Zoho Auth Token
export const getZohoAuthToken = async () => {
  const data = {
    grant_type: "authorization_code",
    client_id: process.env.Client_id,
    client_secret: process.env.Client_secret,
    code: process.env.code,
  };
  try {
    const response = await axios.post(url, qs.stringify(data), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const { access_token, refresh_token, expires_in } = response.data;

    return { access_token, refresh_token, expires_in };
  } catch (error: any) {
    throw new Error("Error creating access token:");
  }
};

export const saveToken = async (
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) => {
  try {
    const tokenRepository = AppDataSource.getRepository(AccessToken);
    const token = new AccessToken();
    token.access_token = accessToken;
    token.refresh_token = refreshToken;
    token.expires_in = addSeconds(new Date(), expiresIn).getTime();
    await tokenRepository.save(token);
    console.log("Token saved successfully:", token);
  } catch (error) {
    console.error("Error saving token:", error);
    throw error;
  }
};

export const getToken = async () => {
  try {
    const tokenRepository = AppDataSource.getRepository(AccessToken);
    // Fetch the most recent token
    const token = await tokenRepository.findOne({
      order: { id: "DESC" },
    });
    if (!token) {
      console.log("No token found in the database.");
      return null;
    }
    console.log("Token retrieved from database:", token);
    return token;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
};

export const getLatestToken = async (): Promise<AccessToken | null> => {
  try {
    const tokenRepository = AppDataSource.getRepository(AccessToken);

    // Fetch the most recent token
    const tokens = await tokenRepository.find({
      order: { created_at: 'DESC' },
      take: 1
    });

    if (tokens.length === 0) {
      console.log('No token found in the database.');
      return null;
    }

    const token = tokens[0];
    console.log('Token retrieved from database:', token);
    return token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
};
export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
      null,
      {
        params: {
          client_id: "1000.09VD6CTYW5K5H6LM1XGW17JL8XTMYH",
          client_secret: "294253be0dad08cac0ef41a4881ca0bf66afcf23e7",
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, expires_in } = response.data;
    const tokenExpiresAt = addSeconds(new Date(), expires_in).getTime();

    const tokenRepository = AppDataSource.getRepository(AccessToken);
    let token = await tokenRepository.findOne({
      where: { refresh_token: refreshToken },
    });
    if (token) {
      token.access_token = access_token;
      token.expires_in = tokenExpiresAt;
      await tokenRepository.save(token);
      console.log("Token refreshed and saved:", token);
    } else {
      console.error("No token found with the provided refresh token");
      throw new Error("No token found with the provided refresh token");
    }

    return { accessToken: access_token, tokenExpiresAt: tokenExpiresAt };
  } catch (error: any) {
    console.error(
      "Error refreshing token:",
      error.response ? error.response.data : error
    );
    throw new Error("Failed to refresh token");
  }
};

// export const updateFormStatus = async(id: number, status:FormStatus) => {
//   const formDataRepository = AppDataSource.getRepository(FormData);
//   const form = await formDataRepository.findOne({where:{ id }});

//   if(form){
//       form.status = status;
//       await formDataRepository.save(form);
//   }
//   else{
//     console.error(`Form with id ${id} not found`);
//   }
//