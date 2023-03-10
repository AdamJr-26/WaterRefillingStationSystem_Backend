const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const passport = require("passport");
const socketFunction = require("./socket/socket");
const clientConfig = require("./config/client.config");
const session = require("express-session");

const app = express();
app.use(cors(clientConfig.corsConfig));
// app.use(cors(clientConfig.ngrokConfig));

// initialize express-session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET_ID, // a random string used to sign the session ID cookie
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something is stored
  })
);
// middlewares ============================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// passport, jwt, authenticating middlewares
require("./utils/passport.jwt");
app.use(passport.initialize());
app.use(passport.session());

// router
app.use(require("./routes/index").router);

const httpServer = http.createServer(app);

// SOCKET
const socketIo = require("socket.io")(httpServer, {
  cors: clientConfig.corsConfig,
});
socketFunction(socketIo);

// SERVER
let PORT = require("./config/server.config").PORT();

require("./db/conn").once("open", () => {
  httpServer.listen(PORT, () => {
    console.log("mongoose connected successfully");
    console.log(`server in ${process.env.STATUS} mode, listening on *:${PORT}`);
  });
});
