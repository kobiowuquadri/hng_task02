import { Router } from "express";
import { verify } from "../middlewares/auth-middleware.js";
import { getOrg, getOrgById } from "../controllers/org-controller.js";

export const orgRoutes = Router()

orgRoutes.get('org', verify, getOrg)

orgRoutes.get('org/:orgId', verify, getOrgById)