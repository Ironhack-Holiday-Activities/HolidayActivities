const { Schema, model } = require("mongoose");

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
    image: {
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
