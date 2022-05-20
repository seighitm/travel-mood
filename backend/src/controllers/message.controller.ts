import {IGetUserAuthInfoRequest} from "../utils/interfaces";
import {NextFunction, Response, Router} from "express";
import {authMiddleware} from "../middlewares/auth.middleware";
import {
  createNewMessage,
  getMessageById,
  getMessagesByChatId,
  getNonReadMessages,
  other_ReadMessage,
  readMessages
} from "../services/message.service";
import {asyncHandler} from "../utils/asyncHandler";

const router = Router();

router.get('/messages/non-read',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const messages = await getNonReadMessages(req.user?.id)
    res.json(messages);
  })
)

router.get('/message/:chatId',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const messages = await getMessagesByChatId(req.params?.chatId, req.user?.id, req.query.massagesCount)
    res.json(messages);
  })
)

router.post('/message',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const {content, chatId} = req.body;
    const message = await createNewMessage(content, chatId, req.user?.id)
    res.json(message);
  })
)

router.get('/message/read/:chatId',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const messages = await other_ReadMessage(req.params?.chatId, req.user?.id)
    res.json(messages);
  })
)



export default router;



//#######################################################################
//#######################################################################
// RAU
//#######################################################################

router.get('/message/single/:id',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const message = getMessageById(req.params?.id)
    res.json(message);
  })
)


router.put('/messages/read',
  [authMiddleware.required],
  asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const messages = await readMessages(req.body?.firstMessageId, req.body?.chatId, req.user?.id)
    res.json(messages);
  })
)
