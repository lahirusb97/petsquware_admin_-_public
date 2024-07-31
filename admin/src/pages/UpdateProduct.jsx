import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { nanoid } from "nanoid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddImage from "../components/AddImg";
import ColorAdd from "../components/ColorAdd";
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
import { useProductContext } from "../context/ProductContext";
import { useParams } from "react-router-dom";

// Define the validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  category: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  images: yup.array().of(yup.string()).required("Images are required"),
});

export default function UpdateProduct() {
  const [loading, setLoading] = React.useState(false);
  const [colorsData, setColors] = React.useState([]);
  const { products } = useProductContext();
  const [id, setId] = React.useState({
    docId: "",
    imgID: "",
  });
  const { showToast } = useToast();
  console.log(id);
  const useParam = useParams();
  React.useEffect(() => {
    const checkProduct = products.find(
      (product) => product.id === useParam["product"]
    );

    if (checkProduct) {
      setValue("name", checkProduct.name);
      setValue("category", checkProduct.category);
      setValue("description", checkProduct.description);
      setValue("images", checkProduct.images);
      setColors(checkProduct.pricing);
      setId({
        docId: checkProduct.id,
        imgID: checkProduct.imgID,
      });
    } else {
      // Array is empty or no matching product found
      // Your logic here
    }
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      images: [],
      category: "",
      name: "",
      description: "",
    },
  });

  const handleClose = async () => {
    setLoading(false);
    reset();
    setColors([]);
  };

  const onSubmit = async (data) => {
    if (colorsData.length > 0) {
      const combinedData = { ...data, pricing: colorsData };

      setLoading(true);

      const imgData = await uploadImages(id.imgID, data.images);
      if (imgData.success) {
        const updateDoc = await updateProduct(
          {
            ...data,
            pricing: colorsData,
            images: imgData.imageUrls,
            edited: true,
          },
          id.docId
        );

        if (updateDoc.success) {
          showToast("Success", "success");
          handleClose();
        } else {
          showToast("Error", "error");
          console.log(updateDoc.error);
          setLoading(false);
        }
      } else {
        showToast("Error", "error");
        setLoading(false);
      }
      handleClose();
    }
  };

  return (
    <div className="mx-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap ">
          <div className="sm:w-96 w-full">
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
          </div>

          <div className="mt-2">
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
          </div>
        </div>
        <div>
          <ColorAdd colorsData={colorsData} setColors={setColors} />
        </div>

        <div className="text-center">
          {loading ? (
            <CircularProgress size={40} />
          ) : (
            <Button
              style={{ marginTop: "20px", padding: "10px 80px" }}
              type="submit"
              variant="contained"
            >
              Add Item
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
