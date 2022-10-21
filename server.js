require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const { errorHandler } = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const rootRouter =  require("./routes/root");
const registerRouter = require("./routes/register");
const authRouter = require("./routes/auth");
const refreshRouter = require("./routes/refresh");
const logoutRouter = require("./routes/logout");
const employeesRouter = require('./routes/api/employees')

const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;

// connect to DB
connectDB();

// custom middleware logger
app.use(logger);

// Handle credentials check before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// cors middleware
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
app.use(express.urlencoded({ extended: false }));

//built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files middleware
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", rootRouter);
app.use("/register", registerRouter);
app.use("/auth", authRouter);
app.use("/refresh", refreshRouter);
app.use("/logout", logoutRouter);

// Employees route protected by JWT
app.use(verifyJWT);
app.use("/employees", employeesRouter);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to mongodb");
  app.listen(PORT, () => console.log(`Server running at ${PORT}`));
});