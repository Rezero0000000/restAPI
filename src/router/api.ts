import express from "express";
import { UserController } from "../controller/user-controller";
import { ContactController } from "../controller/contact-controller";
import { authMiddleware } from "../middleware/auth-middleware";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// user
apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.delete("/api/users/current/logout", UserController.logout);

// contact
apiRouter.post("/api/contacts", ContactController.create);
apiRouter.get("/api/contacts/:contactId(\\d+)", ContactController.get);
apiRouter.put("/api/contacts/:contactId(\\d+)", ContactController.update);
