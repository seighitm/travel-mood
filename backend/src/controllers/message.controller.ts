import { IGetUserAuthInfoRequest } from '../types/interfaces'
import { NextFunction, Response, Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import {
  createNewMessage,
  getMessagesByChatId,
  getNonReadMessages,
  readMessages,
} from '../services/message.service'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

/**
 * Get all non-read messages
 * @returns Message[]
 */
router.get(
  '/messages/non-read',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const messages = await getNonReadMessages(req.user?.id)
    res.json(messages)
  })
)

/**
 * Get all messages from chat
 * @returns Message[]
 */
router.get(
  '/message/:chatId',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const messages = await getMessagesByChatId(req.params?.chatId, req.user?.id, req.query.massagesCount)
    res.json(messages)
  })
)

/**
 * Create message
 * @returns Message
 */
router.post(
  '/message',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const message = await createNewMessage(req.body?.content, req.body?.chatId, req.user?.id)
    res.json(message)
  })
)

/**
 * Read messages
 * @returns Message[]
 */
router.get(
  '/message/read/:chatId',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const messages = await readMessages(req.params?.chatId, req.user?.id)
    res.json(messages)
  })
)

export default router
