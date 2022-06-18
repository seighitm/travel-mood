import {NextFunction, Request, Response, Router} from 'express'
import {roleCheckMiddleware} from '../middlewares/auth.middleware'
import {IGetUserAuthInfoRequest} from '../types/interfaces'
import {asyncHandler} from '../utils/asyncHandler'
import {
  activateUserProfile,
  adminArticles,
  adminTrips,
  adminUsers,
  blockUserProfile,
  closeComplaint,
  deleteTags,
  getAllComplaint,
  setTagsStatus,
  switchRole,
} from '../services/admin.services'
import {ROLE} from "../services/auth.service";

const router = Router()

/**
 * Switch a user role
 * @returns User
 */
router.put(
  '/user/:id/switch-role',
  [roleCheckMiddleware([ROLE.ADMIN])],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await switchRole(req.params?.id)
    res.json(user)
  })
)

/**
 * Block user
 * @returns search users
 */
router.put(
  '/user/:id/block',
  [roleCheckMiddleware([ROLE.ADMIN])],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await blockUserProfile(req.params.id, req.body, req.user?.id, req.user?.role)
    res.json(user)
  })
)

/**
 * Activate user account
 * @returns User
 */
router.put(
  '/user/:id/activate',
  [roleCheckMiddleware([ROLE.ADMIN])],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await activateUserProfile(req.params?.id, req.user?.role)
    res.json(user)
  })
)

/**
 * Change tags status
 * @returns Tag
 */
router.put(
  '/tags/:status',
  [roleCheckMiddleware([ROLE.ADMIN])],
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const tag = await setTagsStatus(req.body?.tagsId, req?.params.status)
    res.json(tag)
  })
)

/**
 * Get users
 * @returns Users[]
 */
router.get(
  '/admin/users',
  [roleCheckMiddleware([ROLE.ADMIN])],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await adminUsers(req?.query, req.user?.id)
    res.json(user)
  })
)

/**
 * Get complaints
 * @returns Complaint[]
 */
router.get(
  '/admin/complaint/:status',
  [roleCheckMiddleware([ROLE.ADMIN])],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const complaint = await getAllComplaint(req?.params?.status)
    res.json(complaint)
  })
)

/**
 * Close complaint
 * @returns Complaint[]
 */
router.put(
  '/admin/complaint/:id',
  [roleCheckMiddleware([ROLE.ADMIN])],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const complaint = await closeComplaint(req.params.id)
    res.json(complaint)
  })
)

/**
 * Get all articles
 * @returns Article[]
 */
router.get(
  '/admin/articles',
  [roleCheckMiddleware([ROLE.ADMIN])],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const articles = await adminArticles(req.query)
    res.json(articles)
  })
)

/**
 * Get all trips
 * @returns Trip[]
 */
router.get(
  '/admin/trips',
  [roleCheckMiddleware([ROLE.ADMIN])],
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const trips = await adminTrips(req.query)
    res.json(trips)
  })
)

/**
 * Delete tags
 * @returns Tag[]
 */
router.delete(
  '/tag',
  [roleCheckMiddleware([ROLE.ADMIN])],
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const tag = await deleteTags(req.body?.tags)
    res.json(tag)
  })
)

export default router
