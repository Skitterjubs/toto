import ArgosQuery from "../../../services/argos/ArgosQuery.js";

export default async function pullArgosCareers(Career, logger) {
  try {
    logger.info("Pulling careers list from Argos");
    const careers = await ArgosQuery.getCareers();

    logger.info("Upserting careers");
    await Career.bulkWrite(
      careers.map((career) => ({
        updateOne: {
          filter: { code: career.code },
          update: { site: career.site, name: career.name },
          upsert: true,
        },
      }))
    );

    logger.info(`${careers.length} careers upserted`);
  } catch (err) {
    logger.error(
      `Pulling careers list from Argos failed, error: ${err.message}`
    );
  }
}
