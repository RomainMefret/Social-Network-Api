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
const multer = require("multer");
const path = require("path");

require("dotenv").config({ path: "./config/.env" });

require("./config/db");

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

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
