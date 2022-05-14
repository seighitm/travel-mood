import {NextFunction, Response, Router} from 'express';
import {followUser, getProfile, setUserRating, unfollowUser} from '../services/profile.service';
import {IGetUserAuthInfoRequest} from "../utils/interfaces";
import {authM} from "../middlewares/auth.middleware";
import {asyncHandler} from "../utils/asyncHandler";

const router = Router();

/**
 * Get profile
 * @auth optional
 * @route {GET} /profiles/:username
 * @param username string
 * @returns Profile profile of an user
 */
router.get(
  '/profiles/:id',
  authM.required,
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
 * Follow user
 * @auth required
 * @route {POST} /profiles/:id/follow
 * @param username string
 * @returns Profile profile of an user
 */
router.post(
  '/users/:id/follow',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const profile = await followUser(req.params?.id, req.user!.id);
    res.json({profile});
  })
);

/**
 * Unfollow user
 * @auth required
 * @route {DELETE} /profiles/:id/follow
 * @param ID
 * @returns profiles
 */
router.delete(
  '/users/:id/follow',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const profile = await unfollowUser(req.params.id, req.user!.id);
    res.json({profile});
  }),
);

/**
 * Set user rating
 * @auth required
 * @route {POST} /users/:userId/rating/:rating
 * @returns profiles
 */
router.post(
  '/users/:userId/rating/:rating',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const profile = await setUserRating(req.params.userId, req.params.rating, req.user!.id);
    res.json(profile);
  }),
);

export default router;
