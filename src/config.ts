export const config = () => ({
  node_env: process.env.NODE_ENV,
  node_port: process.env.NODE_PORT,
  postgres_client: process.env.POSTGRES_CLIENT,
  postgres_host: process.env.POSTGRES_HOST,
  postgres_port: process.env.POSTGRES_PORT,
  postgres_db: process.env.POSTGRES_DB,
  postgres_user: process.env.POSTGRES_USER,
  postgres_password: process.env.POSTGRES_PASSWORD,
  jwt_secret: process.env.JWT_SECRET,
  salt_rounds: process.env.SALT_ROUNDS,
  token_expiration: process.env.TOKEN_EXPIRATION,
});
