const mongoose = require("mongoose");
const slugify = require("slugify");
// const validator = require("validator");

const alphanumericValidator = (value) => /^[a-zA-Z0-9\s/.()-]+$/.test(value);

const propertyTypeCheck = function () {
  return this.type !== "land";
};

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A property must have a name"],
    trim: true,
    maxLength: [200, "A property must have less or equal than 200 characters"],
    validate: {
      validator: alphanumericValidator,
      message: "Property name must contain only alphanumeric characters",
    },
  },
  slug: String,
  price: {
    type: Number,
    required: [true, "A property must have price"],
    validate: {
      validator: function (val) {
        return val >= 0;
      },
      message: "Price ({VALUE}) must be greater than or equal to zero",
    },
  },
  priceDiscount: Number,
  description: {
    type: String,
    trim: true,
    required: [true, "A property must have a description"],
    maxLength: 5000,
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
    street: String,
    city: String,
    state: String,
  },
  area: {
    type: Number,
    required: [
      function () {
        return this.type === "land";
      },
      "Area required for type (Land)",
    ],
  },
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
          enum: ["bed", "bath", "toilet", "beds", "baths", "toilets"],
          required: function () {
            return this.type !== "land";
          },
        },
        quantity: {
          type: Number,
          required: function () {
            return this.type !== "land";
          },
          validate: {
            validator: function (val) {
              return val >= 0;
            },
            message: "Quantity must be greater than or equal to zero",
          },
        },
      },
    ],
    required: function () {
      return this.type !== "land";
    },
  },
  agent: { type: mongoose.Schema.ObjectId, ref: "User" },
  featured: { type: Boolean, default: false },
  tags: [String],
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
  if (this.priceDiscount && this.priceDiscount > this.price) {
    const error = new Error("Discount price should be below the regular price");
    return next(error);
  }
  next();
});

propertySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Property = mongoose.model("Property", propertySchema, "Property");

module.exports = Property;
