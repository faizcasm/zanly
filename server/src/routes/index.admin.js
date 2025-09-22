import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {
  approveMaterial,
  authMiddleware,
  changeUserRole,
  deleteUserByAdmin,
  getAllMaterials,
  getAllUsers,
  getMaterialById,
  getUserById,
  rejectMaterial,
  roleBaseAuth,
  updateUserByAdmin,
} from './route.handler.js';
const router = Router();

router.use(authMiddleware, roleBaseAuth(['ADMIN']));

// Admin routes
router.get('/users', asyncHandler(getAllUsers));
router.get('/user/:id', asyncHandler(getUserById));
router.put('/user/:id', asyncHandler(updateUserByAdmin));
router.delete('/user/:id', asyncHandler(deleteUserByAdmin));
router.patch('/user/:id/role', asyncHandler(changeUserRole));
router.patch('/material/:materialId/approve', asyncHandler(approveMaterial));
router.patch('/material/:materialId/reject', asyncHandler(rejectMaterial));
router.get('/materials', asyncHandler(getAllMaterials));
router.get('/material/:materialId', asyncHandler(getMaterialById));
export default router;
