import {NextFunction, Response, Router} from 'express'
import {authMiddleware} from '../middlewares/auth.middleware'
import {IGetUserAuthInfoRequest} from '../types/interfaces'
import {asyncHandler} from '../utils/asyncHandler'
import {getAllCountries, getAllLanguages, getAllTransports} from '../services/info.service'

const router = Router()

/**
 * Get all languages
 * @returns Language[]
 */
router.get(
  '/info/languages',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const languages = await getAllLanguages()
    res.json(languages)
  })
)

/**
 * Get all transports
 * @returns Transport[]
 */
router.get(
  '/info/transports',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const transports = await getAllTransports()
    res.json(transports)
  })
)

/**
 * Get all countries
 * @returns Country[]
 */
router.get(
  '/info/countries',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const countries = await getAllCountries()
    res.json(countries)
  })
)

export default router
