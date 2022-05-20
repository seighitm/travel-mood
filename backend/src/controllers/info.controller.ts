import {NextFunction, Response, Router} from 'express';
import {authMiddleware} from "../middlewares/auth.middleware";
import {IGetUserAuthInfoRequest} from "../utils/interfaces";
import {asyncHandler} from "../utils/asyncHandler";
import {
  addNewCountry,
  addNewLanguage,
  deleteCountries,
  deleteLanguages,
  getAllCountries,
  getAllLanguages,
  getAllTransports
} from "../services/base.service";

const router = Router();

// GET ALL LANGUAGES
router.get('/info/languages',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const languages = await getAllLanguages()
    res.json(languages)
  })
)

// GET ALL Transports
router.get('/info/transports',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const transports = await getAllTransports()
    res.json(transports);
  })
)

// GET ALL LOCATIONS
router.get('/info/countries',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const countries = await getAllCountries()
    res.json(countries);
  })
)

// Create language
router.post('/info/languages',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const languages = await addNewLanguage(req.body?.languages?.languages)
    res.json(languages);
  })
);

router.delete('/info/languages',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const languages = await deleteLanguages(req.body?.languages)
    res.json(languages);
  })
);

// Create countries
router.post('/info/countries',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const countries = await addNewCountry(req.body?.countries)
    res.json(countries);
  })
);

// Delete countries
router.delete('/info/countries',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const countries = await deleteCountries(req.body?.countries)
    res.json(countries);
  })
);

export default router;
