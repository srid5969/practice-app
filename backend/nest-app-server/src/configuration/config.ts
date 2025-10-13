export const config = () => ({
  // application name
  appName: process.env.APP_NAME || 'Kanban App',

  // application port
  port: parseInt(process.env.PORT ?? '3000', 10),
  // mongodb database (atlas)
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nest',
    name: process.env.MONGODB_DB_NAME || 'kanban',
  },
  // jwt access secret
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET || 'defaultSecret',
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h',
  },
  // jwt refresh secret
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET || 'defaultRefreshSecret',
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
  // bcrypt salt rounds
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10),
    pepper: process.env.BCRYPT_PEPPER || 'defaultPepper',
    salt: process.env.BCRYPT_SALT || 'defaultSalt',
  },
  // cors origin
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },

  // rate limiting
  rateLimit: {
    windowMs: parseInt(
      process.env.RATE_LIMIT_WINDOW_MS ?? String(15 * 60 * 1000),
      10,
    ), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX ?? '100', 10), // limit each IP to 100 requests per windowMs
  },

  // otp settings
  otp: {
    length: parseInt(process.env.OTP_LENGTH ?? '6', 10),
    expiresIn: parseInt(process.env.OTP_EXPIRES_IN ?? '10', 10), // in minutes
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS ?? '5', 10),
    resendCooldown: parseInt(process.env.OTP_RESEND_COOLDOWN ?? '1', 10), // in minutes
  },

  // email settings
  email: {
    smtpHost: process.env.SMTP_HOST || 'smtp.example.com',
    smtpPort: parseInt(process.env.SMTP_PORT ?? '587', 10),
    smtpUser: process.env.SMTP_USER || 'test',
    smtpPass: process.env.SMTP_PASS || 'test',
    fromAddress: process.env.EMAIL_FROM_ADDRESS || 'test@gmail.com',
    fromName: process.env.EMAIL_FROM_NAME || 'Test',
  },

  // logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },

  globalPrefix: process.env.GLOBAL_PREFIX || 'api',
});

export type ConfigType = ReturnType<typeof config>;
