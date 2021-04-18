const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const cookieParser = require("cookie-parser");
const { userCheck, requireAuth } = require("./middleware/auth.middleware");

require("dotenv").config({ path: "./config/.env" });

require("./config/db");

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cookieParser());

app.get("*", userCheck);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200);
  res.send(res.locals.user._id);
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen(8800, () => {
  console.log("Backend server is running on 8800");
});
