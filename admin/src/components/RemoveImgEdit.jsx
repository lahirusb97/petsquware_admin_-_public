import React, { useState } from "react";
import {
  TextField,
  Button,
  Chip,
  Stack,
  ImageList,
  ImageListItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteObject, getStorage, ref } from "firebase/storage";

const RemoveImgEdit = ({ images, setImages, id }) => {
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

  const handleRemoveImage = async (url, index) => {
    const fileRef = ref(getStorage(), url);

    try {
      // Delete the file
      await deleteObject(fileRef);
      console.log("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
    }
    // await deleteObject(ref(getStorage(), `product/${id}/${index}`));
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <TextField
        id="file-input"
        type="file"
        variant="outlined"
        size="small"
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
        inputProps={{ accept: "image/*" }}
      />

      {/* Add Image Button */}
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={handleAddImage}
        disabled={!selectedFile}
      >
        Add
      </Button>

      <ImageList
        sx={{ width: 500, marginTop: "20px" }}
        cols={3}
        rowHeight={164}
      >
        {images.map((url, index) => (
          <ImageListItem key={index}>
            <img
              src={url}
              alt={`img-${index}`}
              style={{ width: "100%", height: "100%" }}
            />
            <IconButton
              size="small"
              onClick={() => handleRemoveImage(url, index)}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                background: "rgba(255,255,255,0.8)",
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
};

export default RemoveImgEdit;
