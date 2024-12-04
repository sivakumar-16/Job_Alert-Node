import { Router } from "express";
import { getAccessToken,   getZohoTimeLogs } from "../Controller/controller";
import { refreshTokenMiddleware } from "../middleware/tokemMiddleware";


const route =Router();

route.post('/oauth/token',getAccessToken);
route.get('/timelog',refreshTokenMiddleware,getZohoTimeLogs);



export default route;