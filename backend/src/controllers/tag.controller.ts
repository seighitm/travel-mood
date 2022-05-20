import {NextFunction, Request, Response, Router} from 'express';
import {authMiddleware} from "../middlewares/auth.middleware";
import {asyncHandler} from "../utils/asyncHandler";
import {deleteTag, getTags} from "../services/tag.service";

const router = Router();

/**
 * Get tags
 * @authM optional
 * @route {GET} /tags
 * @returns tags list of tag names
 */
router.get('/tags',
  [authMiddleware.optional],
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const tags = await getTags(req.query);
    res.json(tags);
  })
);

/**
 * Delete one tag
 * @auth optional
 * @route {DELETE} /tags
 * @returns Tag
 */
router.delete('/tag',
  [authMiddleware.required],
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const tag = await deleteTag(req.body?.tags);
    res.json(tag);
  })
);

export default router;
