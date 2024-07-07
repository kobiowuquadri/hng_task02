import express from 'express'
import { userLogin, userRegister} from "../controllers/auth-controllers.js"
import { validateUser } from '../../validator/authValidator.js'

export const authRoutes = express.Router()

authRoutes.post('/user-register', validateUser, userRegister)
authRoutes.post('/user-login', userLogin)

