const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRouter = require("./routes/user-routes");
const blogRouter = require("./routes/blog-routes");
require("dotenv").config();

// connect DB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);

app.get("/api", (req, res) => res.send("hello"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(` Server started at ${PORT}...`));
