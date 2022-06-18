export const emailTemplateBlockAccount = (userName, message) => {
  return `
          <body
            style="
              color: rgb(68, 68, 68);
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            "
          >
            <h3 class="title" style="text-align: center">Hello ${userName}, your account is blocked!</h3>
            <p>${message}</p>
            <p class="footer" style="font-size: small; font-style: italic">
              <span>Thank you,</span> <br />
              <span>TravelMood Team</span>
            </p>
          </body>
      `
}
