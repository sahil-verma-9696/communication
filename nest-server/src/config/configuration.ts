export default () => ({
  port: Number(process.env.PORT) || 3000,

  database: {
    uri: process.env.DATABASE_URI,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  },
});
