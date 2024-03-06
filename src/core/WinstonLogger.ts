import { Logger } from "./interfaces/Logger";
import { createLogger, format, transports, Logger as WLogger } from "winston";

export class WinstonLogger implements Logger {
  #prefix: string;
  #winstonLogger: WLogger;

  constructor(prefix: string) {
    this.#prefix = prefix;
    this.#winstonLogger = createLogger({
      level: "info",
    });

    const consoleTransport = new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    });

    this.#winstonLogger.add(consoleTransport);
  }

  info(message: string): void {
    this.#winstonLogger.info(`[${this.#prefix}]: ${message}`);
  }

  debug(message: string): void {
    this.#winstonLogger.debug(`[${this.#prefix}]: ${message}`);
  }

  error(message: string): void {
    this.#winstonLogger.error(`[${this.#prefix}]: ${message}`);
  }
}