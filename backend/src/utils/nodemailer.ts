import nodemailer from 'nodemailer'

export const sendEmail = (options) => {
  const smtpTransparent = nodemailer.createTransport({
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_PORT,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true ,
    auth: {
      // user: process.env.SMTP_USER,
      // pass: process.env.SMTP_PASS,
      user: 'avia.trans.info@gmail.com',
      pass: 'Trans.Avia_2020',
    },
  })

  const mailOptions = {
    from: `"Websom Team " <${process.env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.text,
  }

  return smtpTransparent.sendMail(mailOptions)
}
