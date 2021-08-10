const { Schema, model } = require("mongoose");
// ********* require fileUploader in order to use it *********
const fileUploader = require('../config/cloudinary.config');

const activitySchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "A title is required."],
      unique: true,
    },
    description: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    startDate: Date,
    meetingPoint: String,
    attendants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    author: { type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true,
  }
);
const Activity = model("Activity", activitySchema);

module.exports = Activity;
