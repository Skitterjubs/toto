import ArgosQuery from "../../../services/argos/ArgosQuery.js";
import LocalSetting from "../../../common/LocalSetting.js";
import User from "../../User/User.js";
import Career from "../../Career/Career.js";
import Period from "../../Period/Period.js";

export default async function upsertArgosStudents(Student, logger) {
  try {
    const roles = LocalSetting.getRoles();
    logger.info(`Getting current period and available careers`);
    const period = await Period.findOne({ isArgosCurrent: true });
    const careers = await Career.find();

    const studentsToBulk = [];
    const usersToBulk = [];

    for (const career of careers) {
      logger.info(`Pulling students list from Argos, career ${career.code}`);
      const students = await ArgosQuery.getStudentsList(
        career.code,
        period.code
      );

      logger.info(
        `Pulling PIDM and extra data for students in career ${career.code}`
      );

      const existingStudents = await Student.find({
        rut: { $in: students.map(({ rut }) => rut) },
      });
      for (const student of students) {
        const user =
          existingStudents.find(({ rut }) => rut === student.rut) ||
          (await ArgosQuery.getUserPidm(student.rut))[0];
        const studentCareers = await ArgosQuery.getStudentCareers(student.rut);

        usersToBulk.push({
          updateOne: {
            filter: { rut: student.rut },
            update: {
              ...student,
              $addToSet: { roles: roles.student },
            },
            upsert: true,
          },
        });

        studentsToBulk.push({
          updateOne: {
            filter: { rut: student.rut },
            update: {
              ...student,
              lastUpdatePeriod: period.code,
              pidm: user.pidm,
              studyPlan: studentCareers.find(({ isActive }) => isActive)
                .studyPlan,
            },
            upsert: true,
          },
        });
      }
      await User.bulkWrite(usersToBulk);
      await Student.bulkWrite(studentsToBulk);
    }

    logger.info(`${studentsToBulk.length} students upserted. `);
  } catch (err) {
    logger.error(
      `Pulling students list from Argos failed, error: ${err.message}`
    );
  }
}
