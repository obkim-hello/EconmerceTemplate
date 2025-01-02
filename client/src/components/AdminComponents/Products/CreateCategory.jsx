import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import productApi from "../../../service/product_api";

export default function CreateCategory() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    productApi
      .createCategory({ name, description })
      .then((res) => {
        console.log("Category created:", res);
        //   clear
        setName("");
        setDescription("");
        handleClose();
      })
      .catch((err) => console.error("Error creating category:", err));
  };

  return (
    <div>
      {" "}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Category
      </Button>
      <Dialog open={open} onClose={handleClose} closeAfterTransition={false}>
        <DialogTitle>Create Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
