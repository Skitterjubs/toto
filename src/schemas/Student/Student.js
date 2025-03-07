import mongoose from "mongoose";
import User from "../User/User.js";
import Period from "../Period/Period.js";
import Career from "../Career/Career.js";
import Logger from "../../common/Logger.js";
import upsertArgosStudents from "./statics/upsertArgosStudents.js";

const logger = new Logger({ source: "Student Schema" });

const studentSchema = new mongoose.Schema(
  {
    rut: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      validate: {
        validator: async (v) => await User.exists({ rut: v }),
        message: (props) => `User ${props.value} doesn't exist`,
      },
    },
    pidm: {
      type: Number,
      required: true,
      unique: true,
    },
    lastUpdatePeriod: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      validate: {
        validator: async (v) => await Period.exists({ code: v }),
        message: (props) => `Period ${props.value} doesn't exist`,
      },
    },
    admissionPeriod: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      validate: {
        validator: async (v) => await Period.exists({ code: v }),
        message: (props) => `Period ${props.value} doesn't exist`,
      },
    },
    //Should be enum
    admissionType: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    careerCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      validate: {
        validator: async (v) => await Career.exists({ code: v }),
        message: (props) => `Career ${props.value} doesn't exist`,
      },
    },
    catalog: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    //Should be enum
    curricularLevel: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    studyPlan: {
      type: Number,
      required: true,
    },
    //Should be enum
    status: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    //Should be enum
    register: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    affected: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
  },
  { timestamps: true }
);

studentSchema.statics.upsertArgosStudents = async () =>
  upsertArgosStudents(Student, logger);

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);
export default Student;
