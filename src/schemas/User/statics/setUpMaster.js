export default async function setUpMaster(User, logger) {
  try {
    logger.info("Checking if master user already exists...");
    const exists = await User.exists({ roles: "MASTER" });

    if (exists) {
      logger.info("Master user already exists. Skipping creation.");
      return;
    }

    logger.info("No users detected. Creating first master user...");
    const {
      MASTER_RUT,
      MASTER_NAMES,
      MASTER_FIRST_SURNAME,
      MASTER_SECOND_SURNAME,
      MASTER_INSTITUTIONAL_EMAIL,
      MASTER_PERSONAL_EMAIL,
      MASTER_PHONE,
    } = process.env;

    if (
      !MASTER_RUT ||
      !MASTER_NAMES ||
      !MASTER_FIRST_SURNAME ||
      !MASTER_INSTITUTIONAL_EMAIL
    ) {
      logger.error(
        "Missing required environment variables for master user creation."
      );
      return;
    }

    const master = new User({
      rut: MASTER_RUT,
      names: MASTER_NAMES,
      firstSurname: MASTER_FIRST_SURNAME,
      secondSurname: MASTER_SECOND_SURNAME,
      institutionalEmail: MASTER_INSTITUTIONAL_EMAIL,
      personalEmail: MASTER_PERSONAL_EMAIL,
      phone: MASTER_PHONE,
      roles: ["MASTER"],
    });

    await master.save();
    logger.info(`Master user (${MASTER_RUT}) created successfully.`);
  } catch (err) {
    logger.error(`Error setting up master user: ${err.message}`);
    throw err;
  }
}
