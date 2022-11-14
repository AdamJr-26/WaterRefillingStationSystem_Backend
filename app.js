const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const cookieParser =require('cookie-parser')
const  passport  = require('passport');

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())



// passport, jwt, authenticating middlewares
require('./utils/passport.admin.jwt');
require('./utils/passport.personel.jwt');
app.use(passport.initialize());


// router
app.use(require("./routes/index").router);

const httpServer = http.createServer(app);

let PORT =require("./config/server.config").PORT();

require("./db/conn").once("open", () => {
  httpServer.listen(PORT, () => {
    console.log("mongoose connected successfully");
    console.log(`server in ${process.env.STATUS} mode, listening on *:${PORT}`);
  });
});
