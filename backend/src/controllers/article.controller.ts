import {NextFunction, Response, Router} from 'express'
import {
  createArticle,
  deleteArticle,
  favoriteArticle,
  getArticleById,
  getArticles,
  getTags,
  unFavoriteArticle,
  updateArticle,
} from '../services/article.service'
import {IGetUserAuthInfoRequest} from '../types/interfaces'
import {authMiddleware} from '../middlewares/auth.middleware'
import {asyncHandler} from '../utils/asyncHandler'
import upload from '../middlewares/fileUpload.middleware'

const router = Router()

/**
 * Get all tags
 * @returns Tag[]
 */
router.get(
  '/tags',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const tags = await getTags(req.query, req?.user.role)
    res.json(tags)
  })
)

/**
 * Get all articles
 * @returns Article[]
 */
router.get(
  '/articles',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const articles = await getArticles(req.query, req.user?.id)
    res.json(articles)
  })
)

/**
 * Create article
 * @returns Article
 */
router.post(
  '/article',
  [authMiddleware.required, upload.array('images[]')],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const article = await createArticle(req.body, req.files, req.user?.id)
    res.json(article)
  })
)

/**
 * Get article by ID
 * @returns Article
 */
router.get(
  '/article/:id',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const article = await getArticleById(req.params?.id, req.user?.id)
    res.json(article)
  })
)

/**
 * Update article
 * @returns Article
 */
router.put(
  '/article/:id',
  [authMiddleware.required, upload.array('images[]')],
  asyncHandler(async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    const article = await updateArticle(req.body, req.params.id, req.user!.id, req.user?.role, req.files)
    res.json(article)
  })
)

/**
 * Delete article
 * @returns Article
 */
router.delete(
  '/article/:id',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const data = await deleteArticle(req.params?.id, req.user?.id, req.user?.role)
    res.json(data)
  })
)

/**
 * Favorite article
 * @returns Article
 */
router.post(
  '/article/:id/favorite',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const article = await favoriteArticle(req.params?.id, req.user?.id)
    res.json(article)
  })
)

/**
 * UnFavorite article
 * @returns Article
 */
router.delete(
  '/article/:id/favorite',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const article = await unFavoriteArticle(req.params.id, req.user?.id)
    res.json(article)
  })
)

export default router
