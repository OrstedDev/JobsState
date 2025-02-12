import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

import { AplicationEntity } from "../../../../../../../DomainLayer/Models/Aplication/Modules/Internal/Configuration/AplicationEntity";

export default function FormNewItem({
  defaultValues,
  onSubmit,
}: {
  defaultValues: AplicationEntity;
  onSubmit: (values: AplicationEntity) => void;
}) {
  const validationSchema = yup.object({
    Value: yup
      .string()
      .min(3, "El valor requiere un mínimo de 3 caracteres")
      .max(2083, "El máximo permitido es de 2083 caracteres")
      .matches(
        /^(\/[a-zA-Z0-9\-_/]*|https?:\/\/[a-zA-Z0-9.-]+(:[0-9]+)?(\/[a-zA-Z0-9\-_/]*)?)$/,
        "Debe ser un dominio válido (ejemplo: https://www.dominio.com) o una ruta interna (ejemplo: /ruta/valida)"
      )
      .required("El valor es requerido"),
    Name: yup
      .string()
      .min(3, "Requiere minimo de 3 letras")
      .max(30, "El maximo es de 30 letras")
      .matches(
        /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ\s]*$/,
        "Solo se permiten caracteres alfanuméricos, la ñ, tildes, espacios"
      )
      .required("El nombre es requerido"),
  });

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        id="Value"
        name="Value"
        label="Ruta"
        variant="standard"
        type="text"
        value={formik.values?.Value}
        onChange={formik.handleChange}
        error={formik.touched?.Value && Boolean(formik.errors?.Value)}
        helperText={formik.touched?.Value && formik.errors?.Value}
      />

      <TextField
        fullWidth
        id="Name"
        name="Name"
        label="Nombre"
        variant="standard"
        type="text"
        value={formik.values?.Name}
        onChange={formik.handleChange}
        error={formik.touched?.Name && Boolean(formik.errors?.Name)}
        helperText={formik.touched?.Name && formik.errors?.Name}
      />

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
    </form>
  );
}
