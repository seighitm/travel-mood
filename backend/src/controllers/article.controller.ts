import {NextFunction, Response, Router} from 'express';
import {
  addComment,
  createArticle,
  deleteArticle,
  deleteComment,
  favoriteArticle,
  getArticleById,
  getArticles,
  getArticlesForAdmin,
  getCommentsByArticle,
  unFavoriteArticle,
  updateArticle,
} from '../services/article.service';
import {IGetUserAuthInfoRequest} from "../utils/interfaces";
import {authM} from "../middlewares/auth.middleware";
import {asyncHandler} from "../utils/asyncHandler";

const upload = require("../middlewares/fileUpload.middleware");
// import {upload} from '../middlewares/aws-multer'

const router = Router();

/**
 * @desc Get articles
 * @access PUBLIC
 * @route {GET} api/articles
 * @param {*} req.query
 * @returns {Promise} Promise
 */
router.get('/admin/articles',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const articles = await getArticlesForAdmin(req.query);
    res.json(articles);
  }));

/**
 * @desc Get articles
 * @access PUBLIC
 * @route {GET} api/articles
 * @param {*} req.query
 * @returns {Promise} Promise
 */
router.get('/articles',
  [authM.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const articles = await getArticles(req.query, req.user?.id);
    res.json(articles);
  }));

/**
 * @desc Create new article
 * @access PUBLIC
 * @route {POST} api/articles
 * @param {*} req.body
 * @returns {Promise} Promise
 */
router.post('/article',
  [authM.required, upload.array("images[]")],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    console.log(req.body)
    const article = await createArticle(req.body, req.files, req.user?.id);
    res.json(article);
  }));

/**
 * @desc Get one article
 * @access PUBLIC
 * @route {GET} api/article/:id
 * @param {id} req.params
 * @returns {Promise} Promise
 */
router.get('/article/:id',
  [authM.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const article = await getArticleById(req.params?.id, req.user?.id);
    res.json(article);
  })
);

/**
 * @desc Update article
 * @access PRIVATE
 * @route {PUT} api/article/:id
 * @param {*} req.body
 * @param {id} req.params
 * @returns {Promise} Promise
 */
router.put('/article/:id',
  [authM.required, upload.array("images[]")],
  asyncHandler(async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    const article = await updateArticle(req.body, req.params.id, req.user!.id, req.user?.role, req.files);
    res.json(article);
  })
);

/**
 * @desc Delete article
 * @access PRIVATE
 * @route {DELETE} api/article/:id
 * @param {id} req.params
 * @returns {Promise} Promise
 */
router.delete('/article/:id',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const data = await deleteArticle(req.params?.id, req.user?.id, req.user?.role);
    res.json(data)
  }),
);

/**
 * @desc Add article to favorite
 * @access PRIVATE
 * @route {POST} api/article/:id/favorite
 * @param {id} req.params
 * @returns {Promise} Promise
 */
router.post('/article/:id/favorite',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const article = await favoriteArticle(req.params?.id, req.user?.id);
    res.json(article);
  }),
);

/**
 * @desc Remove article from favorite
 * @access PRIVATE
 * @route {DELETE} api/article/:id/favorite
 * @param {id} req.params
 * @returns {Promise} Promise
 */
router.delete('/article/:id/favorite',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const article = await unFavoriteArticle(req.params.id, req.user?.id);
    res.json(article);
  }),
);

/**
 * @desc Create new comment
 * @access PRIVATE
 * @route {POST} api/article/:id/comments
 * @param {*} req.body
 * @param {id} req.params
 * @returns {Promise} Promise
 */
router.post('/article/:id/comment',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const comment = await addComment(req.body.comment, req.params.id, req.user!.id);
    res.json(comment);
  }),
);

/**
 * @desc Delete comment
 * @access PRIVATE
 * @route {DELETE} api/article/comment/:id
 * @param {id} req.params
 * @returns {Promise} Promise
 */
router.delete('/article/comment/:id',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const comment = await deleteComment(req.params?.id, req.user?.id, req.user?.role);
    res.json(comment);
  }),
);


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// RAU
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

export default router;


/**
 * @desc Get all article comments
 * @access PUBLIC
 * @route {GET} api/article/:id/comments
 * @param {id} req.params
 * @returns {Promise} Promise
 */
router.get('/article/:id/comments',
  [authM.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const comments = await getCommentsByArticle(req.params?.id);
    res.json(comments);
  }),
);

