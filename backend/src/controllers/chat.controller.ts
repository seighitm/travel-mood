import {IGetUserAuthInfoRequest} from '../types/interfaces'
import {NextFunction, Response, Router} from 'express'
import {authMiddleware} from '../middlewares/auth.middleware'
import {
  accessChat,
  addUsersToGroupChat,
  createGroupChat,
  deleteGroupChat,
  getMyChats,
  removeUsersFromGroupChat,
  updateGroupChatName,
} from '../services/chat.service'
import {asyncHandler} from '../utils/asyncHandler'

const router = Router()

/**
 * Create chat
 * @returns Chat
 */
router.post(
  '/chat',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const chat = await accessChat(req.body, req?.user?.id)
    res.json(chat)
  })
)

/**
 * Get my chats
 * @returns Chat[]
 */
router.get(
  '/chat',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const chats = await getMyChats(req.user.id)
    res.json(chats)
  })
)

/**
 * Create group chat
 * @returns Chat
 */
router.post(
  '/chat/group',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const groupChat = await createGroupChat(req.body?.users, req.body?.chatName, req?.user?.id)
    res.json(groupChat)
  })
)

/**
 * Update name of group chat
 * @returns Chat
 */
router.put(
  '/chat/group',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const groupChat = await updateGroupChatName(req.body?.chatName, req.body?.chatId, req?.user?.id)
    res.json(groupChat)
  })
)

/**
 * Delete group chat
 * @returns Chat
 */
router.delete(
  '/chat/group',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const groupChat = await deleteGroupChat(req.body?.chatId, req.body?.usersId)
    res.json(groupChat)
  })
)

/**
 * Add users to group chat
 * @returns Chat
 */
router.put(
  '/chat/group/users',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const groupChat = await addUsersToGroupChat(req.body)
    res.json(groupChat)
  })
)

/**
 * Remove users from group chat
 * @returns Chat
 */
router.delete(
  '/chat/group/users',
  authMiddleware.required,
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const groupChat = await removeUsersFromGroupChat(req.body)
    res.json(groupChat)
  })
)

export default router
