"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var routes_1 = __importDefault(require("./routes/routes"));
var morgan_1 = __importDefault(require("morgan"));
var path = __importStar(require("path"));
var helmet_1 = __importDefault(require("helmet"));
var cors_1 = __importDefault(require("cors"));
require("dotenv/config");
var http_1 = __importDefault(require("http"));
var init_1 = require("./db/init");
var errorHandler = require('./middlewares/errorHandling.middleware');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var PORT = process.env.PORT || 5000;
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(function (req, res, next) {
    res.setHeader('Cross-Origin-Resource-Policy', '*');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.urlencoded({ extended: true }));
// app.use('/uploads', express.static(path.join(__dirname, 'build', 'src', 'uploads')));  // GRESIT
app.use('/uploads', express_1.default.static(path.resolve(__dirname, 'uploads')));
console.log('------------------------------------');
console.log(path.join(__dirname, 'build', 'src', 'uploads'));
console.log(path.resolve(__dirname, 'uploads'));
console.log('------------------------------------');
app.use(routes_1.default);
// app.use(express.static(path.join(path.resolve(), 'build', "dist")));
// app.get("*", (req, res) => res.sendFile(path.join(path.resolve(), 'build', "dist", "index.html")));
app.use(errorHandler);
(0, init_1.initDatabaseScript)();
var server = http_1.default.createServer(app);
module.exports = { server: server };
require('./new_socket');
server.listen(PORT, function () {
    console.info("server up on port ".concat(PORT));
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
//# sourceMappingURL=server.js.map