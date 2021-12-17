module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '1b8db7b4d6378f1700643b70715c474a'),
  },
});
