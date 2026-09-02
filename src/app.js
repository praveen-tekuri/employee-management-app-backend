const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/users", (req, res) => {
    res.send("Hello from Node JS");
})

connectDB().then(() => {
    app.listen(process.env.PORT, () => console.log(`Server listening on port: ${process.env.PORT}`));
})