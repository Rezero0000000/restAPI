import express from "express"
import { publicRouter } from "../router/public-api";
import { ErrorMiddleware } from "../middleware/error-middleware";
import { apiRouter } from "../router/api";

export const web = express();
web.use(express.json());
web.use(publicRouter);
web.use(apiRouter);
web.use(ErrorMiddleware);