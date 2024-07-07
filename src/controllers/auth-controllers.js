import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { User } from '../models/auth-model.js';
import { organisation } from '../models/org-model.js';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';




export const userRegister = async (req, res) => {
  try {
    const userId = uuidv4()
    const { firstName, lastName, email, password, phone } = req.body   
    // console.log(req.body) 

    // existing user
    const existingUser = await db.select().from(User, 'users').where(eq(User.email, email)).execute() 
    if (existingUser > 0 ){
      return res.status(422).json({
        errors: [
          {
            field: 'email',
            message: "User with this email already exists"
          }
        ]
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // console.log(userId)

    const user = await db.insert(User).values({
      userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone
    }).returning().execute()

    const orgId = uuidv4()
    console.log("orgId", orgId)
    const orgName = `${firstName}'s Organisation`
    await db.insert(organisation).values({
      orgId,
      name: orgName,
      description: `${firstName}'s default organisation`,
      userId: user[0].userId
    }).execute()

    const token = jwt.sign({ userId: user[0].userId }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: {
          userId,
          firstName,
          lastName,
          email,
          phone,
        }
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Registration unsuccessful',
      msg: error.message,
      statusCode: 400
    })
  }
}


export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    const query = db.select().from(User, 'users').where(eq(User.email, email))
    const result = await query.execute()
    // console.log("result", result)

    if (result.length === 0) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
        msg: 'User not found'
      })
    }
    const isPasswordValid = await bcrypt.compare(password, result[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      })
    }

    const token = jwt.sign({ userId: result[0].userId }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: result[0].userId,
          firstName: result[0].firstName,
          lastName: result[0].lastName,
          email: result[0].email,
          phone: result[0].phone
        }
      }
    })
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      status: 'Bad request',
      message: 'Authentication failed',
      statusCode: 401,
      msg: error.message
    })
  }
}
