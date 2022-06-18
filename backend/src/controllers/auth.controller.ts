import { NextFunction, Request, Response, Router } from 'express'
import { createUser, forgotPassword, getCurrentUser, login, resetPassword } from '../services/auth.service'
import { IGetUserAuthInfoRequest } from '../types/interfaces'
import { authMiddleware } from '../middlewares/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'
import { refreshTokenService } from '../services/token.service'
import upload from '../middlewares/fileUpload.middleware'

const router = Router()

/**
 * Register
 * @returns User
 */
router.post(
  '/auth/register',
  [authMiddleware.optional, upload.single('image')],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await createUser(req.body, req.file)
    res.json(user)
  })
)

/**
 * Login
 * @returns User
 */
router.post(
  '/auth/login',
  [authMiddleware.optional],
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await login(req.body.user)
    res.json(user)
  })
)

/**
 * Update refresh token
 * @returns User
 */
router.post(
  '/refresh-token',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const userData = await refreshTokenService(req?.body?.localRefreshToken)
    return res.json(userData)
  })
)

/**
 * Get current users info
 * @returns User
 */
router.get(
  '/auth/me',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await getCurrentUser(req.user?.id)
    res.json(user)
  })
)

/**
 * Logout
 * @returns User
 */
router.get(
  '/auth/logout',
  [authMiddleware.optional],
  asyncHandler((req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    res.json(req.user)
  })
)

/**
 * Forgot password
 * @returns User
 */
router.post(
  '/auth/forgot-password',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await forgotPassword(req.body?.email)
    res.json(user)
  })
)

/**
 * Reset password
 * @returns User
 */
router.post(
  '/auth/reset-password',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await resetPassword(req.body?.password, req.body?.resetToken)
    res.status(200).json({ message: `An email has been sent to ${user.email} with further instructions.` })
  })
)

export default router
