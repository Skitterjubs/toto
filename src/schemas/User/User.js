import mongoose from "mongoose";
import Logger from "../../common/Logger.js";
import setUpMaster from "./statics/setUpMaster.js";

const logger = new Logger({ source: "User Schema" });

const userSchema = new mongoose.Schema({
  rut: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    unique: true,
  },
  password: {
    type: String,
  },
  names: {
    type: String,
    required: true,
    trim: true,
  },
  firstSurname: {
    type: String,
    required: true,
    trim: true,
  },
  secondSurname: {
    type: String,
    trim: true,
  },
  institutionalEmail: {
    type: String,
    trim: true,
    unique: true,
  },
  personalEmail: {
    type: String,
    trim: true,
    unique: true,
  },
  phone: {
    type: String,
    trim: true,
    unique: true,
  },
  roles: [
    {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
  ],
  sessions: [
    {
      type: String,
      required: true,
    },
  ],
});

userSchema.statics.setUpMaster = async () => setUpMaster(User, logger);

const User = mongoose.model("User", userSchema);
export default User;
