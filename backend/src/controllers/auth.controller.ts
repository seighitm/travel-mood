import {NextFunction, Request, Response, Router} from 'express';
import {createUser, forgotPassword, getCurrentUser, login, resetPassword,} from '../services/auth.service';
import {IGetUserAuthInfoRequest} from "../utils/interfaces";
import {authM} from "../middlewares/auth.middleware";
import {asyncHandler} from "../utils/asyncHandler";
import {refreshTokenService} from "../services/token.service";

const router = Router();
const upload = require("../middlewares/fileUpload.middleware");

/**
 * @desc Register a new user and return its data
 * @route POST /api/auth/register
 * @access Public
 * @param {*} req.body
 * @param {*} req.file
 * @returns {Promise} Promise
 */
router.post('/auth/register',
  [authM.optional, upload.single("image")],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await createUser(req.body, req.file);
    res.json(user);
  }));

/**
 * @desc Login user and return its data.
 * @route POST /api/auth/login
 * @access Public
 * @param {*} req.body
 * @returns {Promise} Promise
 */
router.post('/auth/login',
  [authM.optional],
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await login(req.body.user);
    res.json(user);
  }));

/**
 * @desc Create new refresh token
 * @access PRIVATE
 * @route {POST} api/refresh
 * @body-param localRefreshToken
 * @returns {accessToken, refreshToken, user}
 */
router.post('/refresh-token',
  [authM.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const userData = await refreshTokenService(req?.body?.localRefreshToken);
    return res.json(userData);
  }));

/**
 * @desc Decode and send user info from token
 * @access PRIVATE
 * @route {POST} api/auth/me
 * @returns {Promise} Promise
 */
router.get('/auth/me',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await getCurrentUser(req.user?.id)
    res.json(user);
  }));


/**
 * @desc Logout user from account
 * @access PUBLIC
 * @route {GET} api/auth/logout
 * @returns {Promise} Promise
 */
router.get('/auth/logout',
  [authM.optional],
  asyncHandler((req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    res.json(req.user);
  }));

/**
 * @desc Forgot user password
 * @access PUBLIC
 * @route {POST} api/auth/forgot-password
 * @param {*} req.body
 * @returns {Promise} Promise
 */
router.post('/auth/forgot-password',
  [authM.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await forgotPassword(req.body?.email)
    res.json(user)
  })
);

/**
 * @desc Reset user password
 * @access PUBLIC
 * @route {POST} api/auth/reset-password
 * @param {*} req.body
 * @returns {Promise} Promise
 */
router.post('/auth/reset-password',
  [authM.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await resetPassword(req.body?.password, req.body?.resetToken)
    res.status(200).json({
      message: `An email has been sent to ${user.email} with further instructions.`,
    })
  })
);

export default router;
