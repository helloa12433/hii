// Build Role-Based Access Control with Admin, User, and Moderator Roles



const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");

const app = express();
app.use(bodyParser.json());

app.use("/", authRoutes);
app.use("/", protectedRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running successfully at http://localhost:${PORT}`);
});
