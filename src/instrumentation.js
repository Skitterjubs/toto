import MongoDB from "./databases/MongoDB.js";
import User from "./schemas/User/User.js";
import Career from "./schemas/Career/Career.js";
import Period from "./schemas/Period/Period.js";
import Student from "./schemas/Student/Student.js";

export async function register() {
  //Initiates DB
  await MongoDB.init();
  //Setup master user
  await User.setUpMaster();
  //Pulls careers
  await Career.upsertArgosCareers();
  //Pulls periods
  await Period.upsertArgosPeriods();
  //Pulls students
  await Student.upsertArgosStudents();
}
