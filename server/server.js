// import express from "express";
//
// const app = express();
//
// app.get("/", (req, res) => {
//
//    console.log("Request Received");
//
//    res.send("Backend Running");
// });
//
// const PORT = 5000;
//
// app.listen(PORT, () => {
//
//    console.log(`Server running on port ${PORT}`);
// });

import app from "./src/app.js";

const PORT = 5000;

app.listen(PORT, () => {

   console.log(`Server running on port ${PORT}`);
});