const mongoose = require("mongoose");
const slugify = require("slugify");
// const validator = require("validator");

const alphanumericValidator = (value) => /^[a-zA-Z0-9\s]+$/.test(value);

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
  location: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
    address: String,
    city: String,
    state: String,
  },
  area: Number,
  type: {
    type: String,
    enum: ["sell", "shortlet", "rent", "land"],
    required: [true, "Select listing type"],
  },
  amenities: {
    type: [
      {
        amenity: {
          type: String,
          trim: true,
          enum: ["bed", "bath", "toilet"],
          required: [true, "Select amenities"],
        },
        quantity: Number,
      },
    ],
    required: [true, "A property must have amenities"],
    validate: {
      validator: function (value) {
        if (this.type === "land") {
          // If type is "land", allow an empty array for amenities
          return value.length === 0;
        }
        // For other types, make sure amenities have at least one element
        return value.length > 0;
      },
      message: "Select amenities",
    },
  },
  agent: { type: mongoose.Schema.ObjectId, ref: "User" },
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
