export const {
  NODE_ENV,
  PORT = 4000,
  JWT_SECRET = "jwt secret",
  ORIGIN = "*",
} = process.env;

export const isProduction = NODE_ENV === "production";
