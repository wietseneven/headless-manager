module.exports = ({ env }) => ({
  "apiToken.salt": env("API_TOKEN_SALT", "4c4j6fay2x0mn0mtio1iyvqw0"),
  auth: {
    secret: env('ADMIN_JWT_SECRET', '1b8db7b4d6378f1700643b70715c474a'),
  },
});
