import MongoDB from "./databases/MongoDB.js";
import User from "./models/User/User.js";

export async function register() {
  //Initiates DB
  await MongoDB.init();
  //Setup master user
  await User.setUpMaster();
}
