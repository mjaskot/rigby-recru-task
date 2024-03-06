import { Request, Response, NextFunction } from "express";
import chalk from "chalk";

import StatusError from "./StatusError";
import { WinstonLogger } from "../core/WinstonLogger";

const logger = new WinstonLogger("ERROR");

export const errorHandler = (
  err: StatusError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(`${req.method} ${req.url} - ${chalk.red(err.status || 500)}`);
  logger.error(err.stack ?? "");

  return res.status(err.status || 500).json({
    message: err instanceof StatusError ? err.message : "INTERNAL_ERROR",
    data: err.payload && err.payload.responseData,
  });
};
