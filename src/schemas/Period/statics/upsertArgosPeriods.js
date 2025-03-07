import ArgosQuery from "../../../services/argos/ArgosQuery.js";

export default async function upsertArgosPeriods(Period, logger) {
  try {
    logger.info("Pulling periods list from Argos");
    const periods = await ArgosQuery.getPeriods();
    const [currentPeriod] = await ArgosQuery.getCurrentPeriod();

    logger.info("Upserting periods");

    await Period.bulkWrite(
      periods.map((period) => ({
        updateOne: {
          filter: { code: period.code },
          update: {
            ...period,
            isArgosCurrent: currentPeriod.code === period.code,
          },
          upsert: true,
        },
      }))
    );
    logger.info(
      `${periods.length} periods upserted. Current Argos period set to: ${currentPeriod.code}`
    );
  } catch (err) {
    logger.error(
      `Pulling periods list from Argos failed, error: ${err.message}`
    );
  }
}
