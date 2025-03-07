export default async function setUpMaster(User, logger) {
  try {
    logger.info("Checking if master user already exists...");
    const exists = await User.exists();

    if (exists) {
      logger.info("Master user already exists. Skipping creation.");
      return;
    }

    logger.info("No users detected. Creating first master user...");
    const {
      INITIAL_MASTER_RUT,
      INITIAL_MASTER_NAMES,
      INITIAL_MASTER_FIRST_SURNAME,
      INITIAL_MASTER_SECOND_SURNAME,
      INITIAL_MASTER_INSTITUTIONAL_EMAIL,
      INITIAL_MASTER_PERSONAL_EMAIL,
      INITIAL_MASTER_PHONE,
    } = process.env;

    if (
      !INITIAL_MASTER_RUT ||
      !INITIAL_MASTER_NAMES ||
      !INITIAL_MASTER_FIRST_SURNAME ||
      !INITIAL_MASTER_INSTITUTIONAL_EMAIL
    ) {
      logger.error(
        "Missing required environment variables for master user creation."
      );
      return;
    }

    const master = new User({
      rut: INITIAL_MASTER_RUT,
      names: INITIAL_MASTER_NAMES,
      firstSurname: INITIAL_MASTER_FIRST_SURNAME,
      secondSurname: INITIAL_MASTER_SECOND_SURNAME,
      institutionalEmail: INITIAL_MASTER_INSTITUTIONAL_EMAIL,
      personalEmail: INITIAL_MASTER_PERSONAL_EMAIL,
      phone: INITIAL_MASTER_PHONE,
      roles: ["MASTER"],
    });

    await master.save();
    logger.info(`Master user (${INITIAL_MASTER_RUT}) created successfully.`);
  } catch (err) {
    logger.error(`Error setting up master user: ${err.message}`);
    throw err;
  }
}
