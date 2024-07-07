import express from 'express';
import { db } from '../config/db.js';
import organisations from '../models/organisation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userOrgs = await db.select(organisations).execute()
    res.status(200).json({
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: {
        organisations: userOrgs,
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Failed to retrieve organisations',
      statusCode: 400
    })
  }
})

router.get('/:orgId', authMiddleware, async (req, res) => {
  const { orgId } = req.params;
  try {
    const org = await db.select(organisations).where(organisations.orgId.equals(orgId)).execute();
    if (org.length === 0) {
      return res.status(404).json({
        status: 'Bad request',
        message: 'Organisation not found',
        statusCode: 404
      })
    }
    res.status(200).json({
      status: 'success',
      message: 'Organisation retrieved successfully',
      data: org[0],
    })
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Failed to retrieve organisation',
      statusCode: 400
    })
  }
})

export default router
