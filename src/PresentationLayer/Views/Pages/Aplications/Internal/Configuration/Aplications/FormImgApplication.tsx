import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FormHelperText } from "@mui/material";
import Cropper from "react-cropper";
import LoginIcon from "@mui/icons-material/Login";
import { dataURLToBlob } from "blob-util";

import { useFormik } from "formik";
import * as yup from "yup";

import AlertComponent from "../../../../../../GenericComponents/Alerts/AlertComponent";

export type ImgEntity = {
  Img?: any;
};

export default function FormImgApplication({
  defaultValues,
  onSubmit,
}: {
  defaultValues: ImgEntity;
  onSubmit: (values: ImgEntity) => void;
}) {
  const cropperRef = useRef<any>(null);
  const [lRecorte, setLRecorte] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [baseImage, setBaseImage] = useState<any>(null);

  const handleImageChange = (event: any) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setBaseImage(reader.result);
      };
      reader.readAsDataURL(file);
      formik.setFieldValue("Img", file);
    }
  };
  
  const handleCrop = () => {
    const cropper = cropperRef.current.cropper;
    const croppedImageBase64 = cropper.getCroppedCanvas().toDataURL();
    
    const croppedImageBlob = dataURLToBlob(croppedImageBase64);
    
    formik.setFieldValue("Img", croppedImageBlob);
    setImage(croppedImageBase64);
    setLRecorte(true);
  };

  const restoreCrop = () => {
    setImage(baseImage);
    setLRecorte(false);
  };

  const validationSchema = yup.object({
    Img: yup
      .mixed()
      .required("La imagen es requerida")
      .test("fileFormat", "Formato no soportado", (value: any) =>
        ["image/jpeg", "image/png", "image/gif"].includes(value?.type)
      ),
  });

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (lRecorte) {
        onSubmit(values);
        resetForm();
      } else {
        AlertComponent("info", "Recorte la Imagen...");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Button
        variant="contained"
        component="label"
        sx={{ mb: 1, background: "red", width: "100%" }}
      >
        Select image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageChange}
        />
      </Button>
      {formik.touched.Img && formik.errors.Img ? (
        <FormHelperText error>{formik.errors.Img.toString()}</FormHelperText>
      ) : null}

      {image && (
        <div>
          <Cropper
            src={image}
            initialAspectRatio={1}
            aspectRatio={1}
            guides={true}
            cropBoxResizable={true}
            cropBoxMovable={true}
            dragMode="move"
            viewMode={2}
            responsive={true}
            background={true}
            autoCropArea={1}
            ref={cropperRef}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={handleCrop}
              sx={{ background: "green", width: "48%" }}
            >
              Recortar
            </Button>
            <Button
              variant="contained"
              onClick={restoreCrop}
              sx={{ background: "red", width: "48%" }}
            >
              Restaurar
            </Button>
          </Box>
        </div>
      )}

      {image && (
        <Button
          fullWidth
          sx={{ marginBottom: "10px", marginTop: "15px" }}
          color="primary"
          variant="contained"
          type="submit"
          endIcon={<LoginIcon />}
        >
          REGISTER
        </Button>
      )}
    </form>
  );
}
