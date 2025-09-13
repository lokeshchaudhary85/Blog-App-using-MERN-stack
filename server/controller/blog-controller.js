const mongoose = require("mongoose");
const { findByIdAndRemove } = require("../model/Blog");
const Blog = require("../model/Blog");
const User = require("../model/User");

const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find().populate("user", "name"); // user ke name ko saath lao
  } catch (e) {
    console.log(e);
  }

  if (!blogs) {
    return res.status(404).json({ message: " No blogs found" });
  }

  return res.status(200).json({ blogs });
};



const addBlog = async(req,res,next) =>{

    const { title , desc , img , user } = req.body;

    const currentDate = new Date();

    let existingUser;
    try {
        existingUser = await User.findById(user);
    } catch (e) {
        return console.log(e);
    }
        if(!existingUser){
        return res.status(400).json({message: " Unautorized"});
    }


    const blog = new Blog({
        title ,desc , img , user, date: currentDate
    });

    try {
      await  blog.save();
    } catch (e) {
       return console.log(e);
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save(session);
        existingUser.blogs.push(blog);
        await existingUser.save(session);
        session.commitTransaction();
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err });
      }
    return res.status(200).json({blog});
}

const updateBlog = async(req,res,next) => {
  const blogId = req.params.id;
  const { title, desc, img } = req.body;

  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(blogId, { title, desc, img }, { new: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating blog" });
  }

  if (!blog) return res.status(404).json({ message: "Blog not found" });

  return res.status(200).json({ blog });
};


const getById = async (req, res, next) => {
  const id = req.params.id;
  let blog;

  try {
    blog = await Blog.findById(id).populate("user", "name"); //  yaha bhi populate
  } catch (e) {
    return console.log(e);
  }

  if (!blog) {
    return res.status(500).json({ message: "not found" });
  }

  return res.status(200).json({ blog });
};


const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Find the blog and its user
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const user = await User.findById(blog.user);

    // 2. Delete the blog first
    await Blog.findByIdAndDelete(id);

    // 3. Remove blog reference from user (optional)
    if (user) {
      user.blogs = user.blogs.filter(b => b.toString() !== id);
      await user.save();
    }

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to delete" });
  }
};



const getByUserId = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const userBlogs = await User.findById(userId).populate({
      path: "blogs",
      populate: { path: "user", select: "name" }, // populate user name
    });

    if (!userBlogs) {
      return res.status(404).json({ message: "No Blog Found" });
    }

    return res.status(200).json({ user: userBlogs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};



module.exports = { getAllBlogs ,addBlog , updateBlog , getById ,deleteBlog , getByUserId} ;