import { db } from '../config/db.js';
import { organisation } from '../models/org-model.js';
import { User } from '../models/auth-model.js';
import { eq,and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const getUserorOrgById = async (req, res) => {
  try {
    const { id: userId } = req.params
    // console.log("the id: ",id)

    const user = await db.select().from(User, 'users').where(eq(User.userId, userId)).execute()

    res.status(200).json({
      status: 'success',
      message: 'User details retrieved successfully',
      data: {
        userId: user[0].userId,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        email: user[0].email,
        phone: user[0].phone
      }
    })

  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Failed to retrieve organisation',
      statusCode: 400
    })
  }
}


export const getOrg = async (req, res) => {
  try {
    const { userId } = req.user
    const userOrgs = await db.select().from(organisation).where(eq(organisation.userId, userId)).execute()

    const responseData = userOrgs.map(org => ({
      orgId: org.orgId,
      name: org.name,
      description: org.description,
    }))

    res.status(200).json({
      status: 'success',
      message: 'Organizations retrieved successfully',
      data: {
        organisations: responseData,
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Failed to retrieve organisation',
      statusCode: 400
    })
  }
}



export const getOrgById = async (req, res) => {
  try {
    const { userId } = req.user
    const { orgId } = req.params

    const userOrg = await db.select().from(organisation).where(and(eq(organisation.orgId, orgId), eq(organisation.userId, userId))
    ).execute()

    const orgData = {
      orgId: userOrg[0].orgId,
      name: userOrg[0].name,
      description: userOrg[0].description,
    }

    res.status(200).json({
      status: 'success',
      message: 'Organization retrieved successfully',
      data: orgData,
    })
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Failed to retrieve organisation',
      statusCode: 400
    })
  }
}


export const createOrg = async (req, res) => {
  try {
    const { userId } = req.user 
    const { name, description } = req.body

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        status: 'Bad Request',
        message: 'Name is required and cannot be null or empty',
        statusCode: 400
      })
    }

    const orgId = uuidv4()
    const newOrg = await db.insert(organisation).values({
      orgId,
      name,
      description,
      userId
    }).returning().execute()

    const responseData = {
      orgId: newOrg[0].orgId,
      name: newOrg[0].name,
      description: newOrg[0].description,
    }

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: responseData,
    })
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Failed to retrieve organisation',
      statusCode: 400
    })
  }
}



export const addUserToOrg = async (req, res) => {
  try {
    const { orgId } = req.params
    const { userId } = req.body

    const org = await db.select().from(organisation).where(eq(organisation.orgId, orgId)).execute()
    if (!org || org.length === 0) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'Organisation not found',
        statusCode: 404
      })
    }

    // check if the user is already part of the organization
    const existingUserOrg = await db.select().from(organisation)
      .where(and(eq(organisation.orgId, orgId), eq(organisation.userId, userId)))
      .execute()
    if (existingUserOrg && existingUserOrg.length > 0) {
      return res.status(409).json({
        status: 'Conflict',
        message: 'User is already part of this organization',
        statusCode: 409
      })
    }

    await db.insert(organisation).values({
      orgId,
      userId
    }).execute()

    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully',
    })
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Failed to retrieve organisation',
      statusCode: 400
    })
  }
}