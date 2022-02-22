const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const zoneSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    coordinates: {
      type: [[Number, Number]],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Zone", zoneSchema);
