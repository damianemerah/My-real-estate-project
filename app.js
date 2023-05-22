const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");
const userRouter = require("./routes/userRoutes");
const propertyRouter = require("./routes/propertyRoutes");
const viewRouter = require("./routes/viewRoutes");
const stateRouter = require("./routes/stateRoutes");
const blogRouter = require("./routes/blogRoutes");
const cityRouter = require("./routes/cityRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/states", stateRouter);
app.use("/api/v1/cities", cityRouter);
app.use("/api/v1/blog", blogRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;

//location - state- city- description for each
// Blog
// Reviews-blog-property-services
// properties
