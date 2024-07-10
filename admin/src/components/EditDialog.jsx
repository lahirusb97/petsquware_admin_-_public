import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import AddTag from "./AddTag";

import ColorAdd from "./ColorAdd";
import { updateProduct, uploadImages } from "../service/ProductService";
import RemoveImg from "./RemoveImg";
import { useToast } from "../context/ToastContext";

// Define the validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  category: yup.string().required("Category is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be positive"),
  qty: yup
    .number()
    .typeError("Quantity must be a number")
    .required("Quantity is required")
    .positive("Quantity must be positive"),
  texts: yup.array().of(yup.string()).required("Tags are required"),
  colors: yup.array().of(yup.string()).required("Colors are required"),
  images: yup.array().of(yup.string()).required("Images are required"),
});

export default function EditDialog({ open, handleClose, product }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: product?.name || "",
      category: product?.category || "",
      description: product?.description || "",
      price: product?.price || "",
      qty: product?.qty || "",
      texts: product?.texts || [],
      colors: product?.colors || [],
      images: product?.images || [],
    },
  });
  React.useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("category", product.category);
      setValue("description", product.description);
      setValue("price", product.price);
      setValue("qty", product.qty);
      setValue("texts", product.texts);
      setValue("colors", product.colors);
      setValue("images", product.images);
    }
  }, [product, setValue]);
  const { showToast } = useToast();

  const onSubmit = async (data) => {
    try {
      const imgData = await uploadImages(
        product.id,
        data.images.filter((url) => url.startsWith("data:"))
      );

      const oldarray = data.images.filter((url) => !url.startsWith("data:"));
      const newarray = imgData.imageUrls;
      const mergedArray = oldarray.concat(newarray);

      const response = await updateProduct(product.id, {
        ...data,
        images: mergedArray,
      });

      if (response.success) {
        handleClose();
        showToast("Success", "success");
        reset();
      } else {
        showToast("Error", "error");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Edit Product"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ""}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={
                    errors.description ? errors.description.message : ""
                  }
                />
              )}
            />
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  error={!!errors.price}
                  helperText={errors.price ? errors.price.message : ""}
                />
              )}
            />
            <Controller
              name="qty"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Quantity"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  error={!!errors.qty}
                  helperText={errors.qty ? errors.qty.message : ""}
                />
              )}
            />
            <Controller
              name="texts"
              control={control}
              render={({ field }) => (
                <AddTag
                  texts={field.value}
                  setTexts={(newTexts) => setValue("texts", newTexts)}
                />
              )}
            />
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Category
                  </InputLabel>
                  <Select {...field} label="Category">
                    <MenuItem value={"dog"}>Dog</MenuItem>
                    <MenuItem value={"cat"}>Cat</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="images"
              control={control}
              render={({ field }) => (
                <RemoveImg
                  images={field.value}
                  setImages={(newImages) => setValue("images", newImages)}
                  id={product.id}
                />
              )}
            />
            <Controller
              name="colors"
              control={control}
              render={({ field }) => (
                <ColorAdd
                  colors={field.value}
                  setColors={(newColors) => setValue("colors", newColors)}
                />
              )}
            />
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Update
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
