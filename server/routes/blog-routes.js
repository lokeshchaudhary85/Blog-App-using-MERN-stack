const express = require("express")
const authMiddleware = require("../middleware/authMiddleware");
const blogRouter = express.Router();
const { getAllBlogs , addBlog ,
     updateBlog ,getById , 
    deleteBlog , getByUserId} = require("../controller/blog-controller");

blogRouter.get("/",getAllBlogs);
blogRouter.post('/add', authMiddleware, addBlog);
blogRouter.put("/:id", authMiddleware, updateBlog);
blogRouter.get("/:id", getById);
blogRouter.delete("/:id", authMiddleware, deleteBlog);
blogRouter.get("/user/:id", authMiddleware, getByUserId)

module.exports = blogRouter;