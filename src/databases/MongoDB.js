import mongoose from "mongoose";
import Logger from "../common/Logger.js";

class MongoDB {
  static #connection = null;
  static #logger = new Logger({ source: "MongoDB" });

  static async init() {
    const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME, DB_OPTIONS } =
      process.env;

    if (!DB_USERNAME || !DB_PASSWORD || !DB_HOST || !DB_NAME) {
      MongoDB.#logger.error("Missing required database environment variables.");
      return;
    }

    const url = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?${DB_OPTIONS}`;

    try {
      if (MongoDB.#connection) {
        MongoDB.#logger.info(
          "Database connection already established. Reusing existing connection."
        );
        return MongoDB;
      }

      MongoDB.#logger.info(`Attempting to connect to MongoDB at ${DB_HOST}...`);
      MongoDB.#connection = await mongoose.connect(url);
      MongoDB.#logger.info(
        `Successfully connected to MongoDB database: ${DB_NAME} on host: ${DB_HOST}`
      );
    } catch (err) {
      MongoDB.#logger.error(
        `Failed to connect to MongoDB: ${DB_NAME} on host: ${DB_HOST}`
      );
      MongoDB.#logger.error(`Error details: ${err.message}`);
      throw err;
    }
  }
}

export default MongoDB;
