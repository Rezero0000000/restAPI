import { AddressController } from "../controller/address-controller";
import { ContactController } from "../controller/contact-controller";
import { UserController } from "../controller/user-controller";
import { authMiddleware } from "../middleware/auth-middleware";
import express from "express";

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
apiRouter.delete("/api/contacts/:contactId(\\d+)", ContactController.remove);


// address
apiRouter.post("/api/contacts/:contactId(\\d+)/addresses", AddressController.create);
apiRouter.get("/api/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", AddressController.get);
apiRouter.put("/api/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", AddressController.update);
apiRouter.delete("/api/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", AddressController.remove);
apiRouter.get("/api/contacts/:contactId(\\d+)/addresses/", AddressController.list);
