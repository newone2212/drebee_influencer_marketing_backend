const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8000;
const host = "0.0.0.0";
const path = require("path");
require("./db/conn");
const bodyparser = require("body-parser");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send("This is Dreabee Backend");
});
const routes = require("./routes/youtubeRoutes");
app.use("/youtube", routes);
const instaroutes = require("./routes/instagramDetailsRoutes");
app.use("/instagram", instaroutes);
const brandanalysisRoutes = require("./routes/brandanalysisRoutes");
app.use("/brand", brandanalysisRoutes);
app.use((err, req, res, next) => {
  err.statuCode = err.statusCode(500);
  err.message = err.message("Internal Server Error");
  res.status(err.statuCode).json({
    message: err.message,
  });
});
app.listen(PORT, host, () => {
  console.log(`listening to port at ${PORT}`);
});
