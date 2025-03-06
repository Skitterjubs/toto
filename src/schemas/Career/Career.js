import mongoose from "mongoose";
import Logger from "../../common/Logger.js";
import upsertArgosCareers from "./statics/upsertArgosCareers.js";

const logger = new Logger({ source: "Career Schema" });

const careerSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    unique: true,
  },
  site: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

careerSchema.statics.upsertArgosCareers = async () =>
  upsertArgosCareers(Career, logger);

const Career = mongoose.models.Career || mongoose.model("Career", careerSchema);
export default Career;
