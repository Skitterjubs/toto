import mongoose from "mongoose";
import Logger from "../../common/Logger.js";
import LocalSetting from "../../common/LocalSetting.js";
import setUpMaster from "./statics/setUpMaster.js";
import { validate as validateRut, clean as cleanRut } from "rut.js";

const logger = new Logger({ source: "User Schema" });

const userSchema = new mongoose.Schema(
  {
    rut: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      set: (v) => cleanRut(v),
      validate: {
        validator: (v) => validateRut(v),
        message: (props) => `${props.value} is not a valid RUT`,
      },
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
    gender: {
      type: String,
      trim: true,
      uppercase: true,
      enum: LocalSetting.getGendersList(),
    },
    institutionalEmail: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      set: (v) => (v === null ? undefined : v),
      validate: {
        validator: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    personalEmail: {
      type: String,
      trim: true,
      set: (v) => (v === null ? undefined : v),
      validate: {
        validator: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^\d{9}$/.test(v),
        message: (props) =>
          `${props.value} is not a valid phone number. It must have 9 digits.`,
      },
    },
    roles: [
      {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        enum: LocalSetting.getRolesList(),
      },
    ],
    sessions: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre(["save", "updateOne", "updateMany"], function (next) {
  if (this.rut) {
    this.rut = cleanRut(this.rut);
  }
  next();
});

userSchema.statics.setUpMaster = async () => setUpMaster(User, logger);

const User = mongoose.model("User", userSchema);
export default User;
