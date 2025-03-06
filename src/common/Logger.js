import { createLogger, transports, format } from "winston";
import chalk from "chalk";

class Logger {
  #logger;

  constructor(metadata = { source: "System" }) {
    this.#logger = createLogger({
      transports: [
        new transports.Console({
          level: "debug",
          format: format.combine(
            format.colorize(),
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            format.printf((info) => {
              const level = info.level;
              const message = info.message;
              const timestamp = chalk.blue(`[${info.timestamp}]`);
              const sourcePrefix = chalk.gray(`[${metadata.source}]`);
              return `${timestamp} ${sourcePrefix} ${level}: ${message}`;
            })
          ),
        }),
      ],
    });
  }

  info(message, args) {
    this.#logger.info(message, args);
  }

  error(message, args) {
    this.#logger.error(message, args);
  }

  warn(message, args) {
    this.#logger.warn(message, args);
  }
}

export default Logger;
