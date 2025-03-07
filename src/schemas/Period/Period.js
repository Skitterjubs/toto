import mongoose from "mongoose";
import Logger from "../../common/Logger.js";
import upsertArgosPeriods from "./statics/upsertArgosPeriods.js";
const logger = new Logger({ source: "Period Schema" });

const periodSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    isArgosCurrent: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

periodSchema.statics.upsertArgosPeriods = async () =>
  upsertArgosPeriods(Period, logger);

const Period = mongoose.models.Period || mongoose.model("Period", periodSchema);
export default Period;
