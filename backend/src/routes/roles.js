// src/routes/roles.js
import express from 'express'
import { listarRoles } from '../controllers/rolesController.js'

const router = express.Router()

router.get('/', listarRoles)

export default router
