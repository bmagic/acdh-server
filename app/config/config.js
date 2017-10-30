module.exports = Object.freeze({
  port: process.env.PORT ? process.env.PORT : 4000,
  session_secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : 'justbetweenyouandme',
  database: process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://localhost/acdh',
  log_level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info',
  mailjet: {
    key: process.env.MAILJET_KEY ? process.env.MAILJET_KEY : 'Your Mailjet Key',
    secret: process.env.MAILJET_SECRET ? process.env.MAILJET_SECRET : 'Your Mailjet Secret'
  }
})
