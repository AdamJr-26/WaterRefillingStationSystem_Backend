const mongoose = require("mongoose");

const connectionLink = `mongodb+srv://admin:${process.env.PASSWORD}@cluster0.8jghjix.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(connectionLink, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // autoIndex: false  set to false if in production to prevent significant performance impact.
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"))

module.exports = db;
 