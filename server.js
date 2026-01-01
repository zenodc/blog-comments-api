import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

app.get("/", (req, res) => {
  res.send("Blog API is running");
});


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connesso"))
.catch(err => console.error("Errore connessione MongoDB:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server in ascolto sulla porta", ${PORT});
});
