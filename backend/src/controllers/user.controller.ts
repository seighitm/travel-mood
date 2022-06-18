import {NextFunction, Request, Response, Router} from 'express'
import {authMiddleware} from '../middlewares/auth.middleware'
import {
  addImageCaption,
  checkUserProfileViews,
  createProfileView, followUser,
  fullSearchUsers,
  getAllFavoriteItems,
  getProfileViews,
  getUserById, sendComplaint, setUserRating, unfollowUser,
  updateUserGeneralInfo,
  updateUserImages,
  updateUserMap,
  updateUserPersonalInfo,
} from '../services/user.service'
import {IGetUserAuthInfoRequest} from '../types/interfaces'
import {asyncHandler} from '../utils/asyncHandler'
import upload from '../middlewares/fileUpload.middleware'

const router = Router()

/**
 * Update image caption
 * @returns UserImage
 */
router.put(
  '/users/images/:id/caption',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const userImage = await addImageCaption(req?.user.id, req.params?.id, req.body?.caption)
    res.json(userImage)
  })
)

/**
 * Get all favorite items
 * @returns User
 */
router.get(
  '/user/all-favorites/:type',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await getAllFavoriteItems(req.params?.type, req.user?.id)
    res.json(user)
  })
)

/**
 * Get user profile views
 * @returns search users
 */
router.get(
  '/user/profile-visits',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await getProfileViews(req.user.id)
    res.json(user)
  })
)

/**
 * Check profile views
 * @returns ProfileViews
 */
router.put(
  '/user/profile-visits',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const profileViews = await checkUserProfileViews(req.user?.id)
    res.json(profileViews)
  })
)

/**
 * Update user images
 * @returns User
 */
router.put(
  '/user/images',
  [authMiddleware.required, upload.array('images[]')],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await updateUserImages(req?.user.id, req.body, req.files)
    res.json(user)
  })
)

/**
 * Update user general info (language, gender, country ...)
 * @returns User
 */
router.put(
  '/user/general-info',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await updateUserGeneralInfo(req?.user.id, req.body)
    res.json(user)
  })
)

/**
 * Update user personal info (email, password)
 * @returns User
 */
router.put(
  '/user/personal-info',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await updateUserPersonalInfo(req?.user.id, req.body)
    res.json(user)
  })
)

/**
 * Update user visited or interested country
 * @returns User
 */
router.put(
  '/user/map',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await updateUserMap(req?.user.id, req.body)
    res.json(user)
  })
)

/**
 * Add a new profile visit
 * @returns User
 */
router.put(
  '/user/profile-visits/:id',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await createProfileView(req.user.id, req.params.id)
    res.json(user)
  })
)

/**
 * Get user by id
 * @returns search users
 */
router.get(
  '/user/:id',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    // if (req.user) await createProfileView(req.user.id, req.params.id)
    const user = await getUserById(req?.params?.id)
    res.json(user)
  })
)

/**
 * Get all users
 * @returns User
 */
router.get(
  '/users',
  [authMiddleware.optional],
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await fullSearchUsers(req?.query)
    res.json(user)
  })
)

/**
 * Set user rating
 * @returns User
 */
router.post(
  '/user/:userId/rating/:rating',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const profile = await setUserRating(req.params.userId, req.params.rating, req.user!.id)
    res.json(profile)
  })
)

/**
 * Unfollow a user
 * @returns User
 */
router.delete(
  '/user/:id/follow',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const profile = await unfollowUser(req.params.id, req.user!.id)
    res.json({profile})
  })
)

/**
 * Follow a user
 * @returns User
 */
router.post(
  '/user/:id/follow',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const profile = await followUser(req.params?.id, req.user!.id)
    res.json({profile})
  })
)

/**
 * Create a new complaint
 * @returns Complaint
 */
router.post(
  '/user/:id/complaint',
  [authMiddleware.required, upload.single('image')],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const complaint = await sendComplaint(req?.user.id, req.params?.id, req?.body?.reason, req.file)
    res.json(complaint)
  })
)

export default router
