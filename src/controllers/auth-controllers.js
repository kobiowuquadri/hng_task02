import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { User } from '../models/auth-model.js';
import { organisations } from '../models/org-model.js';




export const userRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body    
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.insert(User).values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone
    }).returning().execute()

    const userId = user[0].userId
    console.log(userId)

    const orgName = `${firstName}'s Organisation`
    await db.insert(organisations).values({
      name: orgName,
      description: `${firstName}'s default organisation`
    }).execute()

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })

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
      statusCode: 400
    })
  }
}


export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    // existing user
    const user = await db.select(User).where(User.email.equals(email)).execute()

    if (user.length === 0) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password)

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401
      })
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: user[0].userId,
          firstName: user[0].firstName,
          lastName: user[0].lastName,
          email: user[0].email,
          phone: user[0].phone,
        }
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Authentication failed',
      statusCode: 401
    })
  }
}