import React, { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const AddImage = ({ images, setImages }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = () => {
    if (selectedFile) {
      setImages([...images, selectedFile]);
      setSelectedFile(null);
      // Clear the file input
      document.getElementById("file-input").value = "";
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  return (
    <div className="border mx-2 my-2 p-2">
      <Typography variant="h6">Product Images</Typography>
      <TextField
        id="file-input"
        type="file"
        variant="outlined"
        size="small"
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
        inputProps={{ accept: "image/*" }}
      />

      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={handleAddImage}
        disabled={!selectedFile}
      >
        Add
      </Button>

      <div className="flex flex-wrap mt-4">
        {images.map((url, index) => (
          <div key={index} className="sm:w-40 w-36 p-2">
            <div className="relative">
              <IconButton
                size="small"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 left-2 bg-white bg-opacity-50"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
              <img
                src={url}
                alt={`img-${index}`}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <Skeleton variant="rectangular" width={210} height={118} />
        )}
      </div>
    </div>
  );
};

export default AddImage;
