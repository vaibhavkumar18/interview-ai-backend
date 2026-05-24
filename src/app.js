const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const config = require("./config/config");
const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(
  "/images",
  express.static(path.join(__dirname, "..", "public", "Images"), {
    maxAge: "30d",
    etag: true,
    immutable: true,
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=2592000, immutable");
      res.setHeader("Access-Control-Allow-Origin", config.FRONTEND_URL);
      res.setHeader("Vary", "Origin");
    },
  }),
);


/* require all the routes here */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

/* using all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;
