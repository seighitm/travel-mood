import nodemailer from 'nodemailer'
import { google } from 'googleapis'

require('dotenv').config()

export const sendEmail = async (options: any) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  )
  oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN_OAUTH })

  const accessToken = await oauth2Client.getAccessToken()
  const myEmail = process.env.SMTP_USER

  const smtpTransparent = nodemailer.createTransport({
    // @ts-ignore
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: myEmail,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN_OAUTH,
      accessToken,
    },
  })

  const mailOptions = {
    from: `"travel mood " <${process.env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.text,
  }

  return smtpTransparent.sendMail(mailOptions)
}
