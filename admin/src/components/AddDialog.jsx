import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { nanoid } from "nanoid";
import {
  collection,
  addDoc,
  getFirestore,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import AddTag from "./AddTag";
import AddImage from "./AddImg";
import "../firebaseConfig"; // Import your firebase configurations
import ColorAdd from "./ColorAdd";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import {
  addProduct,
  updateProduct,
  uploadImages,
} from "../service/ProductService";
import { useToast } from "../context/ToastContext";

// Define the validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  category: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  qty: yup
    .number()
    .typeError("Quantity must be a number")
    .required("Quantity is required")
    .positive("Quantity must be positive"),

  colors: yup.array().of(yup.string()).required("Tags are required"),
  images: yup.array().of(yup.string()).required("Images are required"),
  pricing: yup.array().of(yup.string()).required("pricing Informations"),
});

export default function AddDialog() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      texts: [],
      images: [],
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data) => {
    const ID = nanoid();

    // const addData = await addProduct(data);

    setLoading(true);

    const imgData = await uploadImages(ID, data.images);
    console.log(imgData);
    if (imgData.success) {
      const updateDoc = await addProduct({
        ...data,
        images: imgData.imageUrls,
        imgID: ID,
      });

      if (updateDoc.success) {
        showToast("Success", "success");
        handleClose();
        reset();
        setLoading(false);
      } else {
        showToast("Error", "error");
        setLoading(false);
      }
    } else {
      showToast("Error", "error");
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen}>
        Add Item
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Add New Product"}</DialogTitle>
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
                  error={!!errors.price}
                  helperText={errors.price ? errors.price.message : ""}
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
                <AddImage
                  images={field.value}
                  setImages={(newImages) => setValue("images", newImages)}
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
            {loading ? (
              <CircularProgress size={40} />
            ) : (
              <Button type="submit" variant="contained">
                Submit
              </Button>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
