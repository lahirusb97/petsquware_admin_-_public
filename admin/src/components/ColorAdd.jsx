import React, { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Typography,
  CardActions,
  Skeleton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const ColorAdd = ({ colorsData, setColors }) => {
  const [inputText, setInputText] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [inputQuantity, setInputQuantity] = useState("");

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handlePriceChange = (e) => {
    setInputPrice(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setInputQuantity(parseInt(e.target.value));
  };

  const handleAddColor = () => {
    if (inputText && inputPrice && inputQuantity) {
      setColors([
        ...colorsData,
        {
          color: inputText,
          price: parseFloat(inputPrice),
          quantity: parseInt(inputQuantity),
        },
      ]);
      setInputText("");
      setInputPrice("");
      setInputQuantity("");
    }
  };

  const handleRemoveColor = (index) => {
    const newColorsData = colorsData.filter((_, i) => i !== index);
    setColors(newColorsData);
  };

  return (
    <div className=" w-full border m-2 p-2 flex sm:flex-row flex-col">
      <div className="sm:w-96 w-full">
        <Typography>Add Pricing Variations</Typography>
        <TextField
          label="Enter color"
          variant="outlined"
          size="small"
          value={inputText}
          onChange={handleInputChange}
          style={{ marginBottom: "10px", width: "100%" }}
        />

        <TextField
          label="Price"
          variant="outlined"
          size="small"
          type="number"
          value={inputPrice}
          onChange={handlePriceChange}
          style={{ marginBottom: "10px", width: "100%" }}
        />

        <TextField
          label="Quantity"
          variant="outlined"
          size="small"
          type="number"
          value={inputQuantity}
          onChange={handleQuantityChange}
          style={{ marginBottom: "10px", width: "100%" }}
        />

        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={handleAddColor}
          style={{ marginBottom: "10px" }}
        >
          Add Color
        </Button>
      </div>

      {/* Color Chips */}
      <div className="w-full flex flex-wrap items-baseline">
        {colorsData.map((item, index) => (
          <Card
            key={index}
            style={{ margin: "10px", width: "150px", position: "relative" }}
          >
            <Tooltip title={`Remove ${item.color}`}>
              <IconButton
                size="small"
                onClick={() => handleRemoveColor(index)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "#fff",
                  zIndex: 1,
                }}
              >
                <Delete color="error" fontSize="small" />
              </IconButton>
            </Tooltip>
            <CardContent>
              <div
                style={{
                  backgroundColor: item.color,
                  height: "100px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  marginBottom: "10px",
                }}
              />
              <Typography textAlign={"center"} variant="h6">
                {item.color}
              </Typography>

              <Typography textAlign={"center"} variant="subtitle1">
                Aud${item.price}
              </Typography>

              <Typography textAlign={"center"} variant="body2">
                Quantitiy:{item.quantity}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ColorAdd;
