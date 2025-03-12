// Default configuration values (fallback if env variables are not set)
module.exports = {
    jwt: {
      secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    },
    passwordReset: {
      tokenExpiresIn: 3600000, // 1 hour in milliseconds
    },
    roles: {
      INTERVIEWER: 'interviewer',
      APPLICANT: 'applicant',
    },
    passwordPolicy: {
      minLength: 8,
      requireCapital: true,
    }
  };