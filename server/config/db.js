const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    console.log(" Trying to connect with:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected!");
  } catch (err) {
    console.error(" MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
