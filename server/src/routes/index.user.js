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
  zanlyAiController,
  addBookmark,
  getMyBookmarks,
  removeBookmark,
  getNotifications,
  changePassword,
} from './route.handler.js';
const router = Router();
/**
 * @swagger
 * /api/v1/user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Faizan Hameed
 *               email:
 *                 type: string
 *                 example: faizanhameed690@gmail.com
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: Signup successful
 *       400:
 *         description: User already exists
 */
router.post('/user/signup', asyncHandler(SignUp));

/**
 * @swagger
 * /api/v1/user/signin:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: faizanhameed690@gmail.com
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description:
 *                  Possible errors:
 *                  - All fields are required
 *                  - Invalid email or password / user doesn't exist
 *                  - Incorrect password
 */
router.post('/user/signin', asyncHandler(Login));
router.post('/user/forgotpassword', asyncHandler(forgotPassword));
router.post('/user/resetpassword', asyncHandler(resetPassword));
router.put(
  '/user/changepassword',
  authMiddleware,
  asyncHandler(changePassword),
);
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

//Zanly-AI
router.post('/zanlyai', authMiddleware, zanlyAiController);

//booksmarks
router.post('/bookmark/add', authMiddleware, asyncHandler(addBookmark));
router.get('/bookmark/get', authMiddleware, asyncHandler(getMyBookmarks));
router.delete(
  '/bookmark/:materialId',
  authMiddleware,
  asyncHandler(removeBookmark),
);

//get-app-notifications
router.get(
  '/app/notifications',
  authMiddleware,
  asyncHandler(getNotifications),
);

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
