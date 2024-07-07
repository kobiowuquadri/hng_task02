import { Router } from "express";
import { verify } from "../middlewares/auth-middleware.js";
import { getOrg, getOrgById } from "../controllers/org-controller.js";

export const orgRoutes = Router()

orgRoutes.get('organisations', verify, getOrg)

orgRoutes.get('organisations/:orgId', verify, getOrgById)