const mongoose = require("mongoose");
const AppError = require("../utils/appError");

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "A state must have a name"],
    enum: ["Anambra", "Enugu", "Abuja", "Osun"],
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
  name: {
    type: String,
    required: [true, "A city must have a name"],
    unique: {
      // Create a unique index scoped to the state field
      // This allows different states to have cities with the same name
      sparse: true,
      // Create a custom error message for duplicate city names
      message: "A city with this name already exists in the state",
    },
  },
  description: String,
  state: String,
});

stateSchema.virtual("cities", {
  ref: "City",
  foreignField: "state",
  localField: "_id",
});

citySchema.pre("save", async function (next) {
  const existingCity = await mongoose.models.City.findOne({
    name: this.name,
    state: this.state,
  });

  if (existingCity) next(new AppError("City Already Exist", 500));

  next();
});

const State = mongoose.model("State", stateSchema);
const City = mongoose.model("City", citySchema);

module.exports = { State, City };
