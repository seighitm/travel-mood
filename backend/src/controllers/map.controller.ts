import {IGetUserAuthInfoRequest} from "../utils/interfaces";
import {NextFunction, Response, Router} from "express";
import {authMiddleware} from "../middlewares/auth.middleware";
import {createMarker, getAllMarkers, getMarkerById} from "../services/map.service";
import {asyncHandler} from "../utils/asyncHandler";

const router = Router();

router.get('/info/markers',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const mapItems = await getAllMarkers()
    res.json(mapItems);
  })
)

router.get('/info/markers/:id',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const marker: any = await getMarkerById(req.params?.id)
    res.json(marker?.trip);
  })
)

router.post('/info/markers',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    const marker = await createMarker(req.body.place, req.body.description)
    res.json(marker);
  })
)

export default router;
