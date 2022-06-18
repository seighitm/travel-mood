import { NextFunction, Response, Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { IGetUserAuthInfoRequest } from '../types/interfaces'
import { asyncHandler } from '../utils/asyncHandler'
import {
  addTripToFavorite,
  changeJoiningTripStatus,
  createTrip,
  deleteTrip,
  getOneTrip,
  getTripRequests,
  getTrips,
  joinToTrip,
  leaveFromTrip,
  removeTripFromFavorite,
  switchTripHideStatus,
  updateTrip,
} from '../services/trip.service'

const router = Router()

/**
 * Favorite trip
 * @returns Trip
 */
router.put(
  '/trip/:id/favorite',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const trip = await addTripToFavorite(req.user.id, req.params.id)
    res.json({ trip })
  })
)

/**
 * UnFavorite trip
 * @returns Trip
 */
router.delete(
  '/trip/:id/favorite',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const trip = await removeTripFromFavorite(req.user.id, req.params.id)
    res.json({ trip })
  })
)

/**
 * Join to a trip
 * @returns Trip
 */
router.post(
  '/trip/:id/join',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await joinToTrip(req?.body, req.params.id)
    res.json(user)
  })
)

/**
 * Delete trip
 * @returns Trip
 */
router.delete(
  '/trip/:id/join',
  authMiddleware.required,
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const userJoinToTrip = await leaveFromTrip(req?.user?.id, req.params.id)
    res.json(userJoinToTrip)
  })
)

/**
 * Create trip
 * @returns Trip
 */
router.post(
  '/trip',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const trip = await createTrip(req.user.id, req.body)
    res.json(trip)
  })
)

/**
 * Get all trips
 * @returns Trips
 */
router.get(
  '/trips',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const trips = await getTrips(req.query, req.user?.id, req.user?.role)
    res.json(trips)
  })
)

/**
 * Change join-trip-request status
 * @returns UserJoiningTrip
 */
router.put(
  '/trip/request/:id/changeStatus',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const trips = await changeJoiningTripStatus(req.body?.tripRequestId, req.body.status)
    res.json(trips)
  })
)

/**
 * Get trips requests
 * @returns UserJoiningTrip
 */
router.get(
  '/trips/requests',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const userJoinToTrip = await getTripRequests(req.query?.status, req.user?.id)
    res.json(userJoinToTrip)
  })
)

/**
 * Get one trip
 * @returns Trip
 */
router.get(
  '/trip-one/:id',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const trip = await getOneTrip(req.params.id, req.user?.id)
    res.json(trip)
  })
)

/**
 * Update trip
 * @returns Trip
 */
router.put(
  '/trip/:id',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const trip = await updateTrip(req.user.id, req.params.id, req?.body)
    res.json(trip)
  })
)

/**
 * Delete trip
 * @returns Trip
 */
router.delete(
  '/trip/:id',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const trip = await deleteTrip(req.params.id, req.user.id, req.user?.role)
    res.json(trip)
  })
)

/**
 * Hide trip
 * @returns Trips
 */
router.put(
  '/trip/:id/hide',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const trip = await switchTripHideStatus(req.params.id, req.user.id, req.user?.role)
    res.json(trip)
  })
)

export default router
