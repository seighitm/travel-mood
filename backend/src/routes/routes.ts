import { Router } from 'express'
import articlesController from '../controllers/article.controller'
import authController from '../controllers/auth.controller'
import chatController from '../controllers/chat.controller'
import messageController from '../controllers/message.controller'
import userController from '../controllers/user.controller'
import fileUploadController from '../controllers/static'
import tripController from '../controllers/trip.controller'
import mapController from '../controllers/map.controller'
import infoController from '../controllers/info.controller'
import adminController from '../controllers/admin.controller'
import commonController from '../controllers/comment.controller'

const api = Router()
  .use(adminController)
  .use(commonController)
  .use(articlesController)
  .use(authController)
  .use(chatController)
  .use(infoController)
  .use(messageController)
  .use(userController)
  .use(fileUploadController)
  .use(tripController)
  .use(mapController)

export default Router().use('/api', api)
