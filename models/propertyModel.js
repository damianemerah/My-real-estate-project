const mongoose = require("mongoose");
const slugify = require("slugify");
// const validator = require("validator");

const alphanumericValidator = (value) => {
  return /^[a-zA-Z0-9\s]+$/.test(value);
};

const propertyTypeCheck = function () {
  return this.type !== "land";
};

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A property must have a name"],
    trim: true,
    maxLength: [40, "A property must have less or equal than 50 characters"],
    validate: {
      validator: alphanumericValidator,
      message: "Property name must contain only alphanumeric characters",
    },
  },
  slug: String,
  price: {
    type: Number,
    required: [true, "A property must have price"],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: "Discount price ({VALUE}) should be below this regular price",
    },
  },
  description: {
    type: String,
    trim: true,
    required: [true, "A property must have a description"],
  },
  imageCover: {
    type: String,
    required: [true, "A property must have a cover image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  locations: {
    city: {
      type: mongoose.Schema.ObjectId,
      ref: "City",
    },
    state: {
      type: mongoose.Schema.ObjectId,
      ref: "State",
    },
  },
  area: Number,
  type: {
    type: String,
    enum: ["sell", "shortlet", "rent", "land"],
    required: [true, "Select listing type"],
  },
  amenities: [
    {
      amenity: {
        type: String,
        trim: true,
        enum: ["bed", "bath", "toilet"],
        required: [propertyTypeCheck, "Select amenities"],
      },
      quantity: Number,
    },
  ],
  agents: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  brand: [String],
  featured: { type: Boolean, default: false },
  tags: [{ type: String, enum: ["new", "furnished"] }],
});

propertySchema.pre("save", function (next) {
  if (propertyTypeCheck()) {
    this.amenities.forEach((el) => {
      if (+el.quantity > 1) el.amenity += "s";
    });
  }
  next();
});

propertySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
