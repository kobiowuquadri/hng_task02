import express from 'express'
import { userLogin, userRegister} from "../controllers/auth-controllers.js"


export const authRoutes = express.Router()

authRoutes.post('/user-register', userRegister)
authRoutes.post('/user-login', userLogin)

