const mongoose = require("mongoose");
const { findOneAndReplace } = require("./propertyModel");

const stateSchema = new mongoose.Schema({
  state: {
    type: String,
    unique: true,
    required: [true, "A state must have a name"],
    enum: ["Anambra", "Enugu", "Abuja"],
  },
  description: String,
  location: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
  },
});

const citySchema = new mongoose.Schema({
  city: { type: String, required: [true, "A city must have a name"] },
  description: String,
  location: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
  },
  state: {
    type: mongoose.Schema.ObjectId,
    ref: "State",
    required: [true, "A city must have a state"],
  },
});

stateSchema.virtual("cities", {
  ref: "City",
  foreignField: "state",
  localField: "_id",
});

const State = mongoose.model("State", stateSchema);
const City = mongoose.model("City", citySchema);

module.exports = { State, City };
