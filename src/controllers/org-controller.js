import express from 'express';
import { db } from '../config/db.js';
import { organisation } from '../models/org-model.js';



export const getOrg = async (req, res) => {
  try {
    const userOrgs = await db.select(organisation).execute()
    res.status(200).json({
      status: 'success',
      message: 'organisation retrieved successfully',
      data: {
        organisation: userOrgs,
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
  const { orgId } = req.params
  try {
    const org = await db.select(organisation).where(organisation.orgId.equals(orgId)).execute()
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
}
