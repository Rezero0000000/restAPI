import express from "express";
import { UserController } from "../controller/user-controller";
import { authMiddleware } from "../middleware/auth-middleware";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// user
apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update)