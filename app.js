const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const passport = require("passport");
const jwtConfig = require("./config/jwt.config");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// router
app.use(require("./routes/index").router);


// public host
app.get("/redirect-verify", (req, res) => {
  console.log("paramsh hahah", req.query, req.hostname, req.url);
  res.sendFile(__dirname + "/public/verify.html");
});

// passport, jwt, authenticating middlewares
app.use(passport.initialize());

const httpServer = http.createServer(app);

let PORT =require("./config/server.config").PORT();

require("./db/conn").once("open", () => {
  httpServer.listen(PORT, () => {
    console.log("mongoose connected successfully");
    console.log(`server in ${process.env.STATUS} mode, listening on *:${PORT}`);
  });
});
