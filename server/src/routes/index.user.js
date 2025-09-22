import asyncHandler from 'express-async-handler';
import { Router } from 'express';
import {
  authMiddleware,
  oauthCallback,
  upload,
  deleteAccount,
  forgotPassword,
  getUser,
  Login,
  Logout,
  resetPassword,
  SignUp,
  updateUser,
  passport,
  uploadMaterial,
  getMaterials,
  searchMaterials,
  filterMaterials,
} from './route.handler.js';
const router = Router();
router.post('/user/signup', asyncHandler(SignUp));
router.post('/user/signin', asyncHandler(Login));
router.post('/user/forgotpassword', asyncHandler(forgotPassword));
router.post('/user/resetpassword', asyncHandler(resetPassword));
router.get('/user/signout', authMiddleware, asyncHandler(Logout));
router.get('/user/get', authMiddleware, asyncHandler(getUser));
router.put(
  '/user/update',
  authMiddleware,
  upload.single('image'),
  asyncHandler(updateUser),
);
router.delete('/user/delete', authMiddleware, asyncHandler(deleteAccount));
router.post(
  '/user/upload',
  authMiddleware,
  upload.single('file'),
  asyncHandler(uploadMaterial),
);
router.get('/user/materials', authMiddleware, asyncHandler(getMaterials));
router.get('/user/search', authMiddleware, asyncHandler(searchMaterials));
router.get('/user/filter', authMiddleware, asyncHandler(filterMaterials));
//social logins
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  oauthCallback,
);
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
);
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/' }),
  oauthCallback,
);
export default router;
