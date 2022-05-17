import {IGetUserAuthInfoRequest} from "../utils/interfaces";
import {NextFunction, Response, Router} from "express";
import {authM} from "../middlewares/auth.middleware";
import {
  accessChat,
  addUsersToGroupChat,
  createGroupChat,
  deleteGroupChat,
  getMyChats,
  removeUsersFromGroupChat,
  updateGroupChatName
} from "../services/chat.service";
import {asyncHandler} from "../utils/asyncHandler";

const router = Router();

/**
 * Access chat
 * @auth required
 * @route {POST} /chat
 * @bodyparam  title
 * @returns created chat
 */
router.post('/chat',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const chat = await accessChat(req.body, req?.user?.id)
    res.json(chat);
  })
)

/**
 * Get my chats
 * @auth required
 * @route {GET} /chat
 * @returns array of chats
 */
router.get('/chat',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const chats = await getMyChats(req.user.id)
    res.json(chats);
  })
)

/**
 * Create group chat
 * @auth required
 * @route {POST} /chat
 * @bodyparam  chat name
 * @bodyparam  users
 * @returns created group chat
 */
router.post('/chat/group',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const groupChat = await createGroupChat(req.body?.users, req.body?.chatName, req?.user?.id)
    res.json(groupChat);
  })
)

/**
 * Update group chat name
 * @auth required
 * @route {POST} /chat
 * @bodyparam  chatId
 * @bodyparam  chat name
 * @returns updated group chat
 */
router.put('/chat/group',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const {chatId, chatName} = req.body;
    const groupChat = await updateGroupChatName(chatName, chatId, req?.user?.id)
    res.json(groupChat);
  })
)

/**
 * Delete group chat
 * @auth required
 * @route {POST} /chat
 * @bodyparam  chatId
 * @bodyparam  chat name
 * @returns updated group chat
 */
router.delete('/chat/group',
  [authM.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const {chatId, usersId} = req.body;
    const groupChat = await deleteGroupChat(chatId, usersId)
    res.json(groupChat);
  })
)

/**
 * Add user to group chat
 * @auth required
 * @route {POST} /chat
 * @bodyparam  chatId
 * @bodyparam  chat name
 * @returns updated group chat
 */
router.put('/chat/group/users',
  authM.required,
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const groupChat = await addUsersToGroupChat(req.body)
    res.json(groupChat)
  })
)

/**
 * Remove users from group chat
 * @auth required
 * @route {POST} /chat
 * @bodyparam  chatId
 * @bodyparam  chat name
 * @returns updated group chat
 */
router.delete('/chat/group/users',
  authM.required,
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const groupChat = await removeUsersFromGroupChat(req.body)
    res.json(groupChat)
  })
)

export default router;
