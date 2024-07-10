import React, { useState } from "react";
import { TextField, Button, Chip, Stack } from "@mui/material";

const AddTag = ({ texts, setTexts }) => {
  const [inputText, setInputText] = useState("");

  const handleInputChange = (e) => {
    setInputText(e.target.value.toLowerCase());
  };

  const handleAddText = () => {
    if (inputText.trim()) {
      setTexts([...texts, inputText.toLowerCase()]);
      setInputText("");
    }
  };

  const handleRemoveText = (index) => {
    const newTexts = texts.filter((_, i) => i !== index);
    setTexts(newTexts);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <TextField
        label="Enter text"
        variant="outlined"
        size="small"
        value={inputText}
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
      />

      {/* Add Text Button */}
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={handleAddText}
      >
        Add
      </Button>

      <Stack
        direction="row"
        spacing={1}
        style={{
          marginTop: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {texts.map((text, index) => (
          <Chip
            key={index}
            label={text}
            onDelete={() => handleRemoveText(index)}
            style={{ margin: "5px" }}
          />
        ))}
      </Stack>
    </div>
  );
};

export default AddTag;
