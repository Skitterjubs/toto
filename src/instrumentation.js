import MongoDB from "./databases/MongoDB.js";
import User from "./schemas/User/User.js";
import Career from "./schemas/Career/Career.js";

export async function register() {
  //Initiates DB
  await MongoDB.init();
  //Setup master user
  await User.setUpMaster();
  //Pulls careers
  await Career.upsertArgosCareers();
}
