import { Context } from "koa";
import { sign, verify } from "jsonwebtoken";
import { config } from "dotenv";

config();

const jwtSecret = `${process.env.JWT_SECRET}`;

export const generateToken = (data: any): string => {
  return sign({ ...data }, jwtSecret, { expiresIn: "1h" });
};

const verifyToken = (token: string) => {
  try {
    return verify(token, jwtSecret);
  } catch (err) {
    return null;
  }
};

export const getSessionMiddleware = async (ctx: Context, next: () => Promise<void>) => {
  const token = ctx.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
    return;
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    ctx.status = 401;
    ctx.body = { message: "Invalid token" };
    return;
  }

  ctx.state.user = decodedToken;
  await next();
};
