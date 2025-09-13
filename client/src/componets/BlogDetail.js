import { Typography, Box, Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../config";

const BlogDetail = () => {
  const { id } = useParams(); // URL se blog id
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();

  // Logged-in user ID (maan lo login ke time localStorage me store kiya tha)
  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${config.BASE_URL}/api/blogs/${id}`);
        setBlog(res.data.blog);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

  // Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`${config.BASE_URL}/api/blogs/${id}`);
      navigate("/blogs"); // delete ke baad blogs page pe bhej do
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  // Handle edit
  const handleEdit = () => {
    navigate(`/myBlogs/update/${id}`);
  };

  if (!blog) {
    return (
      <Typography variant="h5" textAlign="center" mt={5}>
        Loading Blog...
      </Typography>
    );
  }

  return (
    <Box
      margin="auto"
      marginTop={5}
      padding={3}
      width="70%"
      border="1px solid #ddd"
      borderRadius={5}
      boxShadow="2px 2px 10px #ccc"
    >
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        {blog.title}
      </Typography>
      <Typography variant="body1" paragraph>
        {blog.desc}
      </Typography>

      {blog.img && (
        <img
          src={blog.img}
          alt={blog.title}
          style={{ width: "100%", borderRadius: "10px", marginTop: "20px" }}
        />
      )}

      {/* User info */}
      <Typography variant="caption" display="block" mt={2} color="gray">
        Posted by:{" "}
        {blog.user ? (blog.user.name || blog.user) : "Unknown"}
      </Typography>

      {/* Edit & Delete buttons (sirf owner ke liye) */}
      {blog.user && blog.user._id === loggedInUserId && (
        <Box mt={3} display="flex" gap={2}>
          <Button
            variant="contained"
            color="warning"
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BlogDetail;
