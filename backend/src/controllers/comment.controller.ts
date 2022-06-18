import { authMiddleware } from '../middlewares/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'
import { IGetUserAuthInfoRequest } from '../types/interfaces'
import { NextFunction, Response, Router } from 'express'
import { addComment, deleteComment, updateComment } from '../services/common.services'

const router = Router()

/**
 * Create comment
 * @returns PostComment
 */
router.post(
  '/:postType/comment/:id',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const comment = await addComment(req.user.id, req.params.id, req.params?.postType, req.body.comment)
    res.json(comment)
  })
)

/**
 * Update comment
 * @returns PostComment
 */
router.put(
  '/comment/:id/edit',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const comment = await updateComment(req.params.id, req.body.comment, req.user!.id)
    res.json(comment)
  })
)

/**
 * Delete comment
 * @returns PostComment
 */
router.delete(
  '/:postType/comment/:id',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const comment = await deleteComment(req.params?.id, req.user?.id, req.user?.role)
    res.json(comment)
  })
)

export default router
