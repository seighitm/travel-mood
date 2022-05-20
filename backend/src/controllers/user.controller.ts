import {NextFunction, Request, Response, Router} from 'express';
import {authMiddleware, roleCheckMiddleware} from "../middlewares/auth.middleware";
import {
  activateUserProfile,
  admin_users,
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
import {
  followUser,
  getAllComplaint,
  getProfile,
  sendComplaint,
  setUserRating,
  unfollowUser
} from "../services/profile.service";

const upload = require("../middlewares/fileUpload.middleware");
// import {upload}  from "../middlewares/aws-multer"

const router = Router();

router.get('/user/all-favorites/:type',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await getAllFavoriteItems(req.params?.type, req.user?.id)
    res.json(user)
  })
)

router.get('/admin/users',
  [roleCheckMiddleware(['ADMIN'])],
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
  [authMiddleware.required],
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
  [authMiddleware.required],
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
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const profileViews = await checkUserProfileViews(req.user?.id)
    res.json(profileViews);
  })
);

// /**
//  * Add interested or visited countries
//  * @auth required
//  * @route {PUT} /user/selected-countries
//  * @returns User
//  */
// router.put('/user/selected-countries',
//   [authM.required],
//   asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
//     const user = await addInterestedVisitedCountries(req.user?.id, req.body)
//     res.json(user);
//   })
// );

/**
 * Activate user account
 * @auth required
 * @route {PUT} /user/selected-countries
 * @returns User
 */
router.put('/user/:id/activate',
  [authMiddleware.required],
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
  [authMiddleware.required, upload.array("images[]")],
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
  [authMiddleware.required],
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
  [authMiddleware.required],
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
  [authMiddleware.required],
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
  [authMiddleware.required],
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
  [authMiddleware.optional],
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
  [authMiddleware.required],
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
  [authMiddleware.optional],
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await fullSearchUsers(req?.query)
    res.json(user);
  })
);

/**
 * Set user rating
 * @auth required
 * @route {POST} /users/:userId/rating/:rating
 * @returns profiles
 */
router.post('/user/:userId/rating/:rating',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const profile = await setUserRating(req.params.userId, req.params.rating, req.user!.id);
    res.json(profile);
  }),
);

/**
 * Unfollow user
 * @auth required
 * @route {DELETE} /profiles/:id/follow
 * @param ID
 * @returns profiles
 */
router.delete('/user/:id/follow',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const profile = await unfollowUser(req.params.id, req.user!.id);
    res.json({profile});
  }),
);

/**
 * Follow user
 * @auth required
 * @route {POST} /profiles/:id/follow
 * @param username string
 * @returns Profile profile of an user
 */
router.post('/user/:id/follow',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const profile = await followUser(req.params?.id, req.user!.id);
    res.json({profile});
  })
);

/**
 * Follow user
 * @auth required
 * @route {POST} /profiles/:id/follow
 * @param username string
 * @returns Profile profile of an user
 */
router.post('/user/:id/complaint',
  [authMiddleware.required, upload.single("image")],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    console.log(req?.user.id, req.params?.id, req?.body?.reason, req.file)
    console.log(req?.body)
    const complaint = await sendComplaint(req?.user.id, req.params?.id, req?.body?.reason, req.file);
    res.json(complaint);
  })
);

/**
 * Follow user
 * @auth required
 * @route {POST} /profiles/:id/follow
 * @param username string
 * @returns Profile profile of an user
 */
router.get('/users/complaint',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const complaint = await getAllComplaint();
    res.json(complaint);
  })
);

export default router;


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// RAU
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


/**
 * Get profile
 * @auth optional
 * @route {GET} /profiles/:username
 * @param username string
 * @returns Profile profile of an user
 */
router.get(
  '/profiles/:id',
  authMiddleware.required,
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await getProfile(req.params.id, req.user?.id);
      res.json({profile});
    } catch (error) {
      next(error);
    }
  },
);


/**
 * Search users
 * @auth required
 * @route {GET} /users
 * @queryparam search
 * @returns search users
 */
router.get('/users/llllllllllllllll',
  [authMiddleware.optional],
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const users = await getUsersByNameOrEmail(req.query?.searchField)
    res.json(users);
  })
);
