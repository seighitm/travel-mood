import express from 'express';
import routes from './routes/routes';
import morgan from "morgan";
import * as path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config'
import http from 'http'
import errorHandlingMiddleware from './middlewares/errorHandling.middleware'
import { initDatabaseScript } from './db/init';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const PORT = process.env.PORT || 5000
const app = express()
app.use(cors())
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
)

app.use(function (req, res, next) {
  res.setHeader('Cross-Origin-Resource-Policy', '*')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(express.json())
app.use(morgan('dev'))
app.use(express.urlencoded({extended: true}))

app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))
app.use(routes)

app.use(express.static(path.join(path.resolve(), 'build', 'build_frontend')))
app.get("*", (req, res) => res.sendFile(path.join(path.resolve(), 'build', "build_frontend", "index.html")));

app.use(errorHandlingMiddleware)
// initDatabaseScript()

const server = http.createServer(app)
export default server
import './socket'

server.listen(PORT, () => {
  console.info(`server up on port ${PORT}`)
})
