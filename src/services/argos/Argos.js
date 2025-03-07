import axios from "axios";
import Logger from "../../common/Logger.js";

class Argos {
  static #instance = null;
  static #requestCounter = 0;
  static #retryCount = 0;
  static #logger = new Logger({ source: "Argos" });

  constructor() {
    if (Argos.#instance) return Argos;

    Argos.#instance = axios.create({
      baseURL: process.env.ARGOS_BASE_URL,
      withCredentials: true,
      timeout: 900000,
      validateStatus: (status) => status >= 200 && status < 500,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    });

    Argos.#logger.info("Argos axios instance created successfully.");

    Argos.#instance.interceptors.request.use(this.#interceptRequest.bind(this));
    Argos.#instance.interceptors.response.use(
      this.#interceptResponseSuccess.bind(this),
      this.#interceptResponseError.bind(this)
    );
  }

  async runQuery(connection, datablock, variables) {
    const params = new URLSearchParams({
      Connection: connection,
      Product: "Argos",
      UniqueId: `{
                  "DataBlock": ${datablock}
              }`,
      JSONData: `{
                  "Variables": ${variables}
              }`,
    });

    Argos.#logger.info(
      `Executing Argos query. Request number: ${Argos.#requestCounter}`
    );

    try {
      const res = await Argos.#instance.post(
        process.env.ARGOS_QUERY_URL,
        params
      );

      const transformedData = this.#transformResponse(res);
      Argos.#logger.info(`Query executed successfully`);

      return transformedData;
    } catch (err) {
      Argos.#logger.error(`An Argos query execution failed: ${err.message}`);
      throw err;
    }
  }

  #transformResponse(res) {
    try {
      const { Fields, Records } = res.data.data;

      const records = Records.map((record) => {
        const transformedRecord = {};
        Fields.forEach((field, index) => {
          transformedRecord[field.Name] = record[index];
        });

        return transformedRecord;
      });

      if (records.length === 0) {
        Argos.#logger.warn("No records found in the response.");
        return [];
      }
      Argos.#logger.info(`Transformation completed successfully`);
      return records;
    } catch (err) {
      Argos.#logger.error(
        `Failed to transform data received from Argos: ${err.message}`
      );
      throw err;
    }
  }

  async #authenticate() {
    const params = new URLSearchParams({
      username: process.env.ARGOS_USER,
      password: process.env.ARGOS_PASSWORD,
      Application: process.env.ARGOS_APPLICATION,
    });

    Argos.#logger.info("Attempting to authenticate user into Argos...");

    try {
      const res = await Argos.#instance.post(
        process.env.ARGOS_AUTHENTICATE_URL,
        params
      );

      const cookies = res.headers["set-cookie"];
      const sessionCookie = cookies.find((cookie) =>
        cookie.startsWith(process.env.ARGOS_SESSION_COOKIE)
      );

      if (!sessionCookie) {
        Argos.#logger.error(
          `No session cookie received after authentication attempt`
        );
        throw err;
      }

      const cookie = sessionCookie.split(";")[0];
      Argos.#instance.defaults.headers.common.Cookie = cookie;

      Argos.#logger.info("Authentication successful. Session cookie set.");
      return cookie;
    } catch (err) {
      Argos.#logger.error(
        `Error when executing authenticate function in Argos class: ${err.message}`
      );
    }
  }

  async #interceptRequest(config) {
    const { ARGOS_AUTHENTICATE_URL } = process.env;
    if (
      !Argos.#instance.defaults.headers.common.Cookie &&
      config.url !== ARGOS_AUTHENTICATE_URL
    ) {
      Argos.#logger.info("No valid cookie found. Initiating authentication...");

      const cookie = await this.#authenticate();
      config.headers.Cookie = cookie;
      Argos.#logger.info(
        "Authentication completed, cookie attached to the request."
      );
    } else if (config.url === ARGOS_AUTHENTICATE_URL) {
      config.timeout = 5000;
    }

    Argos.#requestCounter++;
    return config;
  }

  #interceptResponseSuccess(response) {
    if (response.status === 200 && response.data.valid) {
      Argos.#retryCount = 0;
      Argos.#logger.info(
        "Successful response received. Resetting retry count."
      );
      return response;
    }

    if (Argos.#retryCount < 3 && response.status === 401) {
      Argos.#retryCount++;
      Argos.#logger.warn(
        `Unauthorized (401) response received. Retrying request... Attempt ${
          Argos.#retryCount
        }`
      );
      delete Argos.#instance.defaults.headers.common.Cookie;
      return Argos.#instance(response.config);
    }

    Argos.#logger.error(
      `Response error: Status: ${response.status}, Data: ${JSON.stringify(
        response.data
      )}`
    );

    return Promise.reject(response);
  }

  #interceptResponseError(error) {
    Argos.#logger.error(
      `Error occurred during response processing: ${error.message}`
    );
    if (error.stack) {
    }
    return Promise.reject(error);
  }
}

export default Argos;
