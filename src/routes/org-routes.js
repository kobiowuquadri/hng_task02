import { Router } from "express";
import { verify } from "../middlewares/auth-middleware.js";
import { getUserorOrgById, getOrg, getOrgById, createOrg, addUserToOrg } from "../controllers/org-controller.js";

export const orgRoutes = Router()

orgRoutes.get('/organisations', verify, getOrg)

orgRoutes.post('/organisations', verify, createOrg)

orgRoutes.post('/organisations/:orgId/users', verify, addUserToOrg)

orgRoutes.get('/users/:id', verify, getUserorOrgById)

orgRoutes.get('/organisations/:orgId', verify, getOrgById)