import {NextFunction, Request, Response, Router} from 'express';
import {authMiddleware, roleCheckMiddleware} from "../middlewares/auth.middleware";
import prisma from "../../prisma/PrismaClient";
import {IGetUserAuthInfoRequest} from "../utils/interfaces";
import {asyncHandler} from "../utils/asyncHandler";
import {
  addCommentToTrip,
  addTripToFavorite,
  createTrip,
  deleteTrip,
  filtering,
  getOneTrip,
  getTrips,
  joinToTrip,
  leaveFromTrip,
  removeCommentToTrip,
  removeTripFromFavorite,
  switchTripHideStatus,
  updateTrip
} from "../services/trip.service";

const router = Router();

/**
 * Get all trips
 * @auth required
 * @route {GET} /trips
 * @returns Trips
 */
router.get('/admin/trips',
  [roleCheckMiddleware(['ADMIN'])],
  asyncHandler(async (req: Request | any, res: Response, next: NextFunction) => {
    const trips = await filtering(req.query)
    res.json(trips);
  })
)

/**
 * Favorite trip
 * @auth required
 * @route {PUT} /trips/:id/favorite
 * @param ID of trip
 * @returns Trip
 */
router.put('/trip/:id/favorite',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const trip = await addTripToFavorite(req.user.id, req.params.id)
    res.json({trip});
  })
);

/**
 * Remove a trip from favorite
 * @auth required
 * @route {DELETE} /trips/:id/favorite
 * @param ID of trip
 * @returns Trip
 */
router.delete('/trip/:id/favorite',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const trip = await removeTripFromFavorite(req.user.id, req.params.id)
    res.json({trip});
  }),
);

/**
 * Create trip comment
 * @auth required
 * @route {POST} /trips/:id/comment
 * @param ID of trip
 * @returns Trip
 */
router.post('/trip/:id/comment',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const comment = await addCommentToTrip(req.user.id, req.params.id, req.body.comment)
    res.json(comment);
  }),
);

/**
 * Delete comment to trip
 * @auth required
 * @route {DELETE} /trips/:id/comment
 * @param ID of trip
 * @returns Trip
 */
router.delete('/trip/:id/comment',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const comment = await removeCommentToTrip(req.params.id, req.user?.id)
    res.json(comment).sendStatus(204);
  }),
);

/**
 * Join to trip
 * @auth required
 * @route {POST} /trips/:id/join
 * @returns Trip
 */
router.post('/trip/:id/join',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = await joinToTrip(req?.body, req.params.id)
    res.json(user);
  })
)

/**
 * Leave from trip
 * @auth required
 * @route {DELETE} /trips/:id/join
 * @returns Trip
 */
router.delete('/trip/:id/join',
  authMiddleware.required,
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const userJoinToTrip = await leaveFromTrip(req?.user?.id, req.params.id)
    res.json(userJoinToTrip);
  })
)

/**
 * Create trip
 * @auth required
 * @route {POST} /trips
 * @returns Trip
 */
router.post('/trip',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const trip = await createTrip(req.user.id, req.body)
    res.json(trip);
  })
)

/**
 * Get all trips
 * @auth required
 * @route {GET} /trips
 * @returns Trips
 */
router.get('/trips',
  [authMiddleware.optional],
  asyncHandler(async (req: Request | any, res: Response, next: NextFunction) => {
    const trips = await getTrips(req.query, req.user?.id, req.user?.role)
    res.json(trips);
  })
)

router.put('/trip/joinRequest/:id/changeStatus',
  [authMiddleware.required],
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      // const test = await prisma.userJoinToTrip.findUnique({
      //   where: {
      //     id: Number(req.body?.tripRequestId)
      //   },
      //   select:{
      //     status: true,
      //     trip:{
      //       select:{
      //         user:{
      //           select: {
      //             id: true
      //           }
      //         }
      //       }
      //     },
      //     userId: true
      //   }
      // })
      //
      // if(test && test.status == 'RECEIVED'){
      //   await prisma.userJoinToTrip.update({
      //     where: {
      //       id: Number(req.body?.tripRequestId)
      //     },
      //     data:{
      //       user:{
      //         connect:{
      //           id: Number(test.trip.user.id)
      //         }
      //       },
      //       status: req.body.status,
      //     }
      //   })
      // }
      const userJoinning = await prisma.userJoinToTrip.update({
        where: {
          id: Number(req.body?.tripRequestId)
        },
        data: {
          status: req.body.status
        },
        include: {
          user: true,
          trip: {
            include: {
              user: true
            }
          }
        }
      })

      // const userJoinning = await prisma.userJoinToTrip.findFirst({
      //   where: {
      //     id: Number(req.body?.tripRequestId)
      //   },
      //     include: {
      //       user: true,
      //       trip: {
      //         include: {
      //           user: true
      //         }
      //       }
      //     }
      // })

      res.json({
        newStatus: req.body.status,
        status: userJoinning.status,
        receiveUserId: userJoinning.status == 'PENDING' ? userJoinning.user.id : userJoinning.trip.user.id
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  },
);


router.get('/trips/requests',
  [authMiddleware.required],
  async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    try {
      if (req.query?.status == 'ALL') {
        const userJoinning = await prisma.userJoinToTrip.groupBy({
          by: ['status', 'userId'],
          where: {
            OR: [
              {
                status: 'APPROVED',
                userId: Number(req.user.id)
              },
              {
                status: {
                  in: 'APPROVED'
                },
                trip: {
                  user: {
                    id: Number(req.user.id)
                  }
                },
              },
              {
                status: 'RECEIVED',
                userId: Number(req.user.id)
              },
              {
                status: {
                  in: 'RECEIVED'
                },
                trip: {
                  user: {
                    id: Number(req.user.id)
                  }
                },
              },
              {
                status: 'PENDING',
                userId: Number(req.user.id)
              },
              {
                status: 'PENDING',
                trip: {
                  user: {
                    id: Number(req.user.id)
                  }
                },
              }
            ]
          },
          _count: true
        })
        res.json(userJoinning);
      } else if (req.query?.status == 'PENDING') {
        console.log('PPPPPPPPPPPPPPP')
        const userJoinning = await prisma.userJoinToTrip.findMany({
          where: {
            OR: [
              // {
              //   status: {
              //     in: req.query?.status
              //   },
              //   trip: {
              //     user: {
              //       id: Number(req.user.id)
              //     }
              //   },
              //   // user:{
              //   //   id: {
              //   //     not: Number(req.user.id)
              //   //   }
              //   // }
              // },
              {
                status: {
                  in: req.query?.status
                },
                userId: Number(req.user.id)
              },
              {
                status: {
                  in: 'RECEIVED'
                },
                trip: {
                  user: {
                    id: Number(req.user.id)
                  }
                },
              },
            ]
          },
          include: {
            user: true,
            trip: {
              include: {
                user: true
              }
            }
          }
        })
        res.json(userJoinning);
      } else if (req.query?.status == 'RECEIVED') {
        console.log('cvcccccccccccccccc')
        const userJoinning = await prisma.userJoinToTrip.findMany({
          where: {
            OR: [
              {
                status: {
                  in: 'PENDING'
                },
                trip: {
                  user: {
                    id: Number(req.user.id)
                  }
                }
              },
              {
                status: {
                  in: 'RECEIVED'
                },
                user: {
                  id: Number(req.user.id)
                }
              },
              //   // user:{
              //   //   id: {
              //   //     not: Number(req.user.id)
              //   //   }
              //   // }
              // },
              // {
              //   status: {
              //     in: req.query?.status
              //   },
              //   userId: Number(req.user.id)
              // }
            ]
          },
          include: {
            user: true,
            trip: {
              include: {
                user: true
              }
            }
          }
        })
        res.json(userJoinning);
      } else if (req.query?.status == 'APPROVED') {
        console.log('cvcccccccccccccccc')
        const userJoinning = await prisma.userJoinToTrip.findMany({
          where: {
            OR: [
              {
                status: {
                  in: 'APPROVED'
                },
                trip: {
                  user: {
                    id: Number(req.user.id)
                  }
                }
              },
              {
                status: {
                  in: 'APPROVED'
                },
                user: {
                  id: Number(req.user.id)
                }
              },
              //   // user:{
              //   //   id: {
              //   //     not: Number(req.user.id)
              //   //   }
              //   // }
              // },
              // {
              //   status: {
              //     in: req.query?.status
              //   },
              //   userId: Number(req.user.id)
              // }
            ]
          },
          include: {
            user: true,
            trip: {
              include: {
                user: true
              }
            }
          }
        })
        res.json(userJoinning);
      } else res.json([]);

      // else {
      //   const userJoinning = await prisma.userJoinToTrip.findMany({
      //     where: {
      //       OR:[
      //         {
      //           status: {
      //             in: req.query?.status
      //           },
      //           trip: {
      //             user: {
      //               id: Number(req.user.id)
      //             }
      //           }
      //         },
      //         {
      //           status: {
      //             in: req.query?.status
      //           },
      //           userId: Number(req.user.id)
      //         }
      //       ]
      //     },
      //     include: {
      //       user: true,
      //       trip: {
      //         include: {
      //           user: true
      //         }
      //       }
      //     }
      //   })
      //   res.json(userJoinning);
      // }
      // console.log('%%%%%%%%%%%')
      // console.log(req.query.status)
      // console.log(req.query?.status?.filter((item: any) => item == 'RECEIVED').length != 0)
      // const array: any = []
      // if (req.query?.status && req.query.status.length != 0)
      //   for (let i = 0; i < req.query.status.length; i++) {
      //     console.log(req.query.status[i  ])
      // const userJoinning = await prisma.userJoinToTrip.findMany({
      //   where: {
      //     OR: [
      //       {
      //         status: {
      //           in: req.query?.status?.filter((item: any) => item != 'RECEIVED').map((item: any) => item.toString())
      //         },
      //         trip: {
      //           user: {
      //             id: Number(req.user.id)
      //           }
      //         },
      //       },
      //       {
      //         ...(req.user.id && req.query?.status?.filter((item: any) => item == 'RECEIVED').length != 0
      //             ? {
      //               status: 'RECEIVED',
      //               user: {
      //                 id: Number(req.user.id)
      //               }
      //             }
      //             : {}
      //         )
      //
      //       }
      //     ]
      //   },
      //   include: {
      //     user: true,
      //     trip: {
      //       include: {
      //         user: true
      //       }
      //     }
      //   }
      // })
      //   array.push(userJoinning)
      // }

    } catch (error) {
      console.log(error)
      next(error);
    }
  },
);

/**
 * Get one trip
 * @auth required
 * @route {GET} /trips/:id
 * @returns Trip
 */
router.get('/trip-one/:id',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    console.log('MIIIIIIIIIIIIIISA')
    const trip = await getOneTrip(req.params.id, req.user?.id);
    res.json(trip);
  })
);


/**
 * Update trip
 * @auth required
 * @route {PUT} /trips/:id
 * @returns Trip
 */
router.put('/trip/:id',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const trip = await updateTrip(req.user.id, req.params.id, req?.body)
    res.json(trip);
  })
)


/**
 * Delete trip
 * @auth required
 * @route {DELETE} /trips/:id
 * @returns Trip
 */
router.delete('/trip/:id',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const trip = await deleteTrip(req.params.id, req.user.id, req.user?.role)
    res.json(trip);
  })
);

/**
 * Get all trips
 * @auth required
 * @route {GET} /trips
 * @returns Trips
 */
router.put('/trip/:id/hide',
  [authMiddleware.required],
  asyncHandler(async (req: Request | any, res: Response, next: NextFunction) => {
    const trips = await switchTripHideStatus(req.params.id, req.user.id, req.user?.role);
    res.json(trips);
  })
)


export default router;
