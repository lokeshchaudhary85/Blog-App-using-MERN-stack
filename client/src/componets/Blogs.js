import React, { useEffect, useState } from "react";
import axios from "axios";
import Blog from "./Blog";
import { Box } from "@mui/material";
import config from "../config";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${config.BASE_URL}/api/blogs`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBlogs(res.data.blogs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlogs();
  }, []);

  const handleDeleteFromList = (id) => {
    setBlogs((prevBlogs) => prevBlogs.filter((b) => b._id !== id));
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
      gap={3}
      sx={{ p: 3 }}
    >
      {blogs &&
        blogs.map((blog, index) => (
          <Blog
            key={index}
            id={blog._id}
            title={blog.title}
            desc={blog.desc}
            img={blog.img}
            user={blog.user?.name}
            createdAt={blog.date}
            isUser={localStorage.getItem("userId") === blog.user?._id}
            onDelete={handleDeleteFromList}
          />
        ))}
    </Box>
  );
};

export default Blogs;
