import express from 'express';
import routes from './routes/routes';
import morgan from "morgan";
import * as path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config'
import http from 'http'
import {initDatabaseScript} from "./db/init";

const errorHandler = require('./middlewares/errorHandling.middleware');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(function (req, res, next) {
  res.setHeader('Cross-Origin-Resource-Policy', '*');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use(morgan('dev'))
app.use(express.urlencoded({extended: true}));

// app.use('/uploads', express.static(path.join(__dirname, 'build', 'src', 'uploads')));  // GRESIT


app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));
  console.log('------------------------------------')
  console.log(path.join(__dirname, 'build', 'src', 'uploads'))
  console.log(path.resolve(__dirname, 'uploads'))
  console.log('------------------------------------')
app.use(routes);

// app.use(express.static(path.join(path.resolve(), 'build', "dist")));
// app.get("*", (req, res) => res.sendFile(path.join(path.resolve(), 'build', "dist", "index.html")));

app.use(errorHandler);
initDatabaseScript()

const server = http.createServer(app);
module.exports = {server};
require('./new_socket')

server.listen(PORT, () => {
  console.info(`server up on port ${PORT}`);
});


// fs.readdir('./', (err, files) => {
//   files.forEach(file => {
//     //   console.log(file);
//   })});
// console.log(path.resolve(__dirname, '..', 'src'))
// let files: any = fs.readdirSync(path.resolve(__dirname, '..', 'src', 'svg'));
// fs.readdir(path.resolve(__dirname, '..', 'src', 'svg'), (err, files) => {
//   files.forEach(file => {
//     // console.log(file);
//     files = [...files, file.toString()];
//   })
//   for (let i = 0; i < files.length; i++) {
//     fs.writeFileSync(path.resolve(__dirname, '..', 'src', 'misa.ts'), `import ${files[i].toUpperCase()} from "${files[i]}"
//   `)
//   }
//   console.log(files)
// });
// path.resolve(__dirname, '..', 'uploads', files[i])
//   let content: any = ''
//   console.log(files)
//   for (let i = 0; i < files.length; i++) {
//     content += `${files[i].split('.')[0].toUpperCase()},
// `
//   }
//   console.log(content)
//   fs.writeFileSync(path.resolve(__dirname, '..', 'src', 'misa.ts'), content)


