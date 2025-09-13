import React, { useEffect, useState } from "react";
import axios from "axios";
import Blog from "./Blog"; 
import { makeStyles } from "@mui/styles";
import config from "../config";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "grid", //  Grid layout
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", // multiple cards per row
    gap: "20px", // spacing between cards
    margin: "20px auto",
    width: "90%",
  },
}));

const UserBlogs = () => {
  const classes = useStyles();
  const [blogs, setBlogs] = useState([]);
  const id = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const res = await axios.get(`${config.BASE_URL}/api/blogs/user/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
        setBlogs(res.data.user.blogs);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserBlogs();
  }, [id]);

  const handleDeleteFromUserBlogs = (id) => {
  setBlogs((prevBlogs) => prevBlogs.filter((b) => b._id !== id));
};


  return (
    <div className={classes.container}>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <Blog
            key={blog._id}
            id={blog._id}
            title={blog.title}
            desc={blog.desc}
            img={blog.img}
            user={blog.user?.name || "Unknown"}
            createdAt={blog.date} 
            isUser={true}
            onDelete={handleDeleteFromUserBlogs}
          />
        ))
      ) : (
        <p>No blogs found</p>
      )}
    </div>
  );
};

export default UserBlogs;
