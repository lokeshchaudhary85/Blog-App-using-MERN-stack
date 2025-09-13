import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useStyles } from "./utils";
import config from "../config";

const Blog = ({ title, desc, img, user, isUser, id, createdAt, onDelete }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  // Edit
  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/myBlogs/update/${id}`);
  };

  // Delete request
  const deleteRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${config.BASE_URL}/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error("Delete Error:", err.response?.data || err.message);
      return null;
    }
  };

  // Delete handler (calls parent onDelete after success)
  const handleDelete = async (e) => {
    e.stopPropagation(); // prevent card click navigation
    const result = await deleteRequest();
    if (result) {
      // call parent handler if provided
      if (typeof onDelete === "function") onDelete(id);
    }
  };

  // View single blog
  const handleView = () => {
    navigate(`/blogs/${id}`);
  };

  return (
    <div>
      <Card
        sx={{
          width: "100%",
          maxWidth: 350,
          margin: "auto",
          mt: 2,
          boxShadow: "5px 5px 15px rgba(0,0,0,0.2)",
          borderRadius: "12px",
          transition: "0.3s",
          ":hover": {
            boxShadow: "10px 10px 25px rgba(0,0,0,0.3)",
            transform: "translateY(-5px)",
            cursor: "pointer",
          },
        }}
        onClick={handleView}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", textAlign: "left", mb: 1, ml: 1 }}
        >
          {user ? `Posted by: ${user}` : "Posted by: Unknown"}
        </Typography>

        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "primary.main", fontWeight: "bold" }}>
              {user ? user.charAt(0).toUpperCase() : "?"}
            </Avatar>
          }
          title={
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
          }
          subheader={
            createdAt ? `Created At: ${new Date(createdAt).toLocaleDateString()}` : ""
          }
          action={
            isUser && (
              <Box>
                <IconButton
                  onClick={handleEdit} // stopPropagation inside handleEdit
                >
                  <ModeEditOutlineIcon color="warning" />
                </IconButton>
                <IconButton
                  onClick={handleDelete} // stopPropagation inside handleDelete
                >
                  <DeleteForeverIcon color="error" />
                </IconButton>
              </Box>
            )
          }
        />

        <CardMedia
          component="img"
          height="150"
          image={img}
          alt={title}
          sx={{ borderRadius: "8px" }}
        />

        <CardContent>
          <hr />
          <br />
          <Typography
            className={classes.font}
            variant="body2"
            color="text.secondary"
          >
            <b>Description</b> {": "} {desc}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Blog;
