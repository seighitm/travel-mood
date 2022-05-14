import {NextFunction, Request, Response, Router} from 'express';
import {authM} from "../middlewares/auth.middleware";
import {
  activateUserProfile,
  addInterestedVisitedCountries, admin_users,
  blockUserProfile,
  checkUserProfileViews,
  createProfileView,
  fullSearchUsers,
  getAllFavoriteItems,
  getProfileViews,
  getUserById,
  getUsersByNameOrEmail,
  updateUserGeneralInfo,
  updateUserImages,
  updateUserMap,
  updateUserPersonalInfo
} from "../services/user.service";
import {IGetUserAuthInfoRequest} from "../utils/interfaces";
import {asyncHandler} from "../utils/asyncHandler";
import {switchRole} from "../services/auth.service";
const upload = require("../middlewares/fileUpload.middleware");

const router = Router();

router.get('/user/all-favorites/:type',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await getAllFavoriteItems(req.params?.type, req.user?.id)
    res.json(user)
  })
)

router.get('/admin/users',
  [authM.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await admin_users(req?.query)
    res.json(user)
  })
)

/**
 * Get user profile views
 * @auth required
 * @route {GET} /users/profile-visits
 * @queryparam search
 * @returns search users
 */
router.get('/user/profile-visits',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await getProfileViews(req.user.id)
    res.json(user);
  })
);

/**
 * Block user
 * @auth required
 * @route {PUT} /user/:id/block
 * @queryparam search
 * @returns search users
 */
router.put('/user/:id/block',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await blockUserProfile(req.params.id, req.body.expiredBlockDate)
    res.json(user);
  })
);

/**
 * Check profile views
 * @auth required
 * @route {PUT} /users/profile-visits
 * @returns ProfileViews
 */
router.put('/user/profile-visits',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const profileViews = await checkUserProfileViews(req.user?.id)
    res.json(profileViews);
  })
);

/**
 * Add interested or visited countries
 * @auth required
 * @route {PUT} /user/selected-countries
 * @returns User
 */
router.put('/user/selected-countries',
  authM.required,
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await addInterestedVisitedCountries(req.user?.id, req.body)
    res.json(user);
  })
);

/**
 * Activate user account
 * @auth required
 * @route {PUT} /user/selected-countries
 * @returns User
 */
router.put('/user/:id/activate',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await activateUserProfile(req.params?.id)
    res.json(user);
  })
);

/**
 * Update user images
 * @auth required
 * @route {PUT} /user/selected-countries
 * @returns User
 */
router.put('/user/images',
  [authM.required, upload.array("images[]")],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await updateUserImages(req?.user.id, req.body, req.files)
    res.json(user);
  })
);

/**
 * Update user general info
 * @auth required
 * @route {PUT} /users/general-info
 * @returns User
 */
router.put('/user/general-info',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await updateUserGeneralInfo(req?.user.id, req.body)
    res.json(user);
  })
);

/**
 * Update user personal info
 * @auth required
 * @route {PUT} /users/personal-info
 * @returns User
 */
router.put('/user/personal-info',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await updateUserPersonalInfo(req?.user.id, req.body)
    res.json(user);
  })
);

/**
 * Update user visited or interested country
 * @auth required
 * @route {PUT} /users/map
 * @returns User
 */
router.put('/user/map',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    console.log(req.body)
    const user = await updateUserMap(req?.user.id, req.body)
    res.json(user);
  })
);

/**
 * Add new profile visit
 * @auth required
 * @route {PUT} /users/map
 * @returns User
 */
router.put('/user/profile-visits/:id',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await createProfileView(req.user.id, req.params.id)
    res.json(user);
  })
);

/**
 * Get user by id
 * @auth required
 * @route {GET} /users
 * @queryparam search
 * @returns search users
 */
router.get('/user/:id',
  [authM.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    // if (req.user)
    //   await createProfileView(req.user.id, req.params.id)
    const user = await getUserById(req?.params?.id)
    res.json(user);
  })
);

/**
 * Switch user role
 * @auth required
 * @route {PUT} /user/:id/switch-role
 * @params user ID,
 * @returns User
 */
router.put('/user/:id/switch-role',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await switchRole(req.params?.id)
    res.json(user);
  }));

/**
 * Get users
 * @auth required
 * @route {GET} /users
 * @queryparams
 * @returns User
 */
router.get('/users',
  [authM.optional],
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await fullSearchUsers(req?.query)
    res.json(user);
  })
);

export default router;


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// RAU
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

/**
 * Search users
 * @auth required
 * @route {GET} /users
 * @queryparam search
 * @returns search users
 */
router.get('/users/llllllllllllllll',
  [authM.optional],
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const users = await getUsersByNameOrEmail(req.query?.searchField)
    res.json(users);
  })
);
