const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
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
  next();
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "1000kb" }));
app.use(cookieParser());

app.use("/api/v1/property", propertyRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/state", stateRouter);
app.use("/api/v1/city", cityRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/", viewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
