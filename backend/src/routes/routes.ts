import { Router } from 'express';
import tagsController from '../controllers/tag.controller';
import articlesController from '../controllers/article.controller';
import authController from '../controllers/auth.controller';
import chatController from '../controllers/chat.controller';
import messageController from '../controllers/message.controller';
import userController from '../controllers/user.controller';
import fileUploadController from '../controllers/file-upload.controller';
import tripController from '../controllers/trip.controller';
import mapController from '../controllers/map.controller';
import baseController from '../controllers/info.controller';

const api = Router()
  .use(tagsController)
  .use(articlesController)
  .use(authController)
  .use(chatController)
  .use(baseController)
  .use(messageController)
  .use(userController)
  .use(fileUploadController)
  .use(tripController)
  .use(mapController)

export default Router().use('/api', api);
