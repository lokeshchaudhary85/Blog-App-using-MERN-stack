import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import config from "../config";

const UpdateBlog = () => {
  const { id } = useParams(); // blog id from URL
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: "",
    desc: "",
    img: ""
  });

  // Fetch blog details on mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${config.BASE_URL}/api/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
        setBlog(res.data.blog);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting blog:", blog); // 🔹 add this

  try {
    const res = await axios.put(`${config.BASE_URL}/api/blogs/${id}`, blog);
    console.log("Response from API:", res); // 🔹 add this
    alert("Blog updated successfully!");
    navigate("/myBlogs"); 
  } catch (err) {
    console.log("Error updating blog:", err); // 🔹 add this
  }
};


  return (
    <div style={{ width: "50%", margin: "auto", marginTop: "20px" }}>
      <h2>Update Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={blog.title}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="desc"
            value={blog.desc}
            onChange={handleChange}
            rows={5}
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            required
          />
        </div>
        <div>
          <label>Image URL</label>
          <input
            type="text"
            name="img"
            value={blog.img}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", marginTop: "10px" }}>
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default UpdateBlog;
