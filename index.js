const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const cookieParser = require("cookie-parser");
const { userCheck, requireAuth } = require("./middleware/auth.middleware");
const cors = require("cors");

require("dotenv").config({ path: "./config/.env" });

require("./config/db");

//middleware
app.use(cors());
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

const port = 5000;
app.listen(port, () => {
  console.log(`Backend server is running on port : ${port}`);
});
