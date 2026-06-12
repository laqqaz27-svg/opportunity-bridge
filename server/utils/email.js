const nodemailer = require('nodemailer')

const hasSmtpConfig =
  Boolean(process.env.SMTP_HOST) &&
  Boolean(process.env.SMTP_PORT) &&
  Boolean(process.env.SMTP_USER) &&
  Boolean(process.env.SMTP_PASS)

let transporter = null

if (hasSmtpConfig) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

const resolveSenderEmail = () => {
  const emailFrom = process.env.EMAIL_FROM
  if (emailFrom) {
    return emailFrom
  }

  const senderName = process.env.EMAIL_SENDER_NAME || 'Opportunity Bridge'
  const smtpUser = process.env.SMTP_USER || 'noreply@opportunitybridge.org'

  return `${senderName} <${smtpUser}>`
}

const sendEmail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    return false
  }

  await transporter.sendMail({
    from: resolveSenderEmail(),
    to,
    subject,
    html,
    text,
    replyTo: process.env.REPLY_TO_EMAIL || 'laqqaz27@gmail.com',
  })

  return true
}

module.exports = {
  sendEmail,
}
