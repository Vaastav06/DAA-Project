const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());

app.get("/run", (req, res) => {
  exec("./knapsack", (err, stdout) => {
    if (err) return res.send("Error");
    res.send(stdout);
  });
});

app.listen(5000, () => console.log("Backend running on 5000"));