import React from "react";
import axios from "axios";
import config from "../config";

// DeleteButton
const DeleteButton = ({ blogId, onDelete }) => {
  const handleDelete = async () => {
    if (!blogId) return;
    try {
      await axios.delete(`${config.BASE_URL}/api/blogs/${blogId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
      onDelete(); // just refresh UI
    } catch (err) {
      console.error(err);
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
};



export default DeleteButton;
