const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const passport = require("passport");
var fileupload = require("express-fileupload");
const socketFunction = require("./socket/socket");
const clientConfig = require("./config/client.config");


const app = express();
app.use(cors(clientConfig.corsConfig));

// middlewares ============================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// passport, jwt, authenticating middlewares
require("./utils/passport.jwt");
app.use(passport.initialize());

// router
app.use(require("./routes/index").router);

const httpServer = http.createServer(app);

// SOCKET
const socketIo = require("socket.io")(httpServer, {
  cors: clientConfig.corsConfig,
});
socketFunction(socketIo)


// SERVER
let PORT = require("./config/server.config").PORT();

require("./db/conn").once("open", () => {
  httpServer.listen(PORT, () => {
    console.log("mongoose connected successfully");
    console.log(`server in ${process.env.STATUS} mode, listening on *:${PORT}`);
  });
});
