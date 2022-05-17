"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
var sendEmail = function (options) {
    var smtpTransparent = nodemailer_1.default.createTransport({
        // host: process.env.SMTP_HOST,
        // port: process.env.SMTP_PORT,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            // user: process.env.SMTP_USER,
            // pass: process.env.SMTP_PASS,
            user: 'avia.trans.info@gmail.com',
            pass: 'Trans.Avia_2020',
        },
    });
    var mailOptions = {
        from: "\"Websom Team \" <".concat(process.env.SMTP_USER, ">"),
        to: options.to,
        subject: options.subject,
        html: options.text,
    };
    return smtpTransparent.sendMail(mailOptions);
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=nodemailer.js.map