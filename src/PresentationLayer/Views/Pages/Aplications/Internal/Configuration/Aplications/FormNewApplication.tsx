import Button from "@mui/material/Button";
import {
  FormControl,
  FormHelperText,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

import { AplicationEntity } from "../../../../../../../DomainLayer/Models/Aplication/Modules/Internal/Configuration/AplicationEntity";

export default function FormNewApplication({
  defaultValues,
  onSubmit,
}: {
  defaultValues: AplicationEntity;
  onSubmit: (values: AplicationEntity) => void;
}) {
  const validationSchema = yup.object({
    Value: yup
      .string()
      .min(3, "La ruta requiere un mínimo de 3 caracteres")
      .max(2083, "El máximo permitido para una ruta es de 2083 caracteres")
      .matches(
        /^\/[a-z0-9\-_/]*$/,
        "Debe ser una ruta interna válida (ejemplo: /ruta/valida)"
      )
      .required("La ruta es requerida"),
    Name: yup
      .string()
      .min(3, "Requiere minimo de 3 letras")
      .max(30, "El maximo es de 30 letras")
      .matches(
        /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ\s]*$/,
        "Solo se permiten caracteres alfanuméricos, la ñ, tildes, espacios"
      )
      .required("El nombre es requerido"),
    Description: yup
      .string()
      .min(3, "Requiere minimo de 3 letras")
      .max(150, "El maximo es de 150 letras")
      .matches(
        /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ\s.,]*$/,
        "Solo se permiten caracteres alfanuméricos, la ñ, tildes, espacios, puntos y comas"
      )
      .required("La descripción es requerida."),
    IsVisible: yup
      .string()
      .required("Seleccione un Género")
      .min(1, "Seleccione un Género"),
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
        label="Ruta de la aplicación"
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
        label="Nombre de la aplicación"
        variant="standard"
        type="text"
        value={formik.values?.Name}
        onChange={(e) => {
          const uppercaseValue = e.target.value.toUpperCase();
          formik.setFieldValue("Name", uppercaseValue);
        }}
        error={formik.touched?.Name && Boolean(formik.errors?.Name)}
        helperText={formik.touched?.Name && formik.errors?.Name}
      />

      <TextField
        fullWidth
        id="Description"
        name="Description"
        label="Descripción"
        variant="standard"
        multiline
        rows={3}
        value={formik.values?.Description}
        onChange={formik.handleChange}
        error={
          formik.touched?.Description && Boolean(formik.errors?.Description)
        }
        helperText={formik.touched?.Description && formik.errors?.Description}
      />

      <FormControl fullWidth variant="standard">
        <FormControlLabel
          control={
            <Checkbox
              id="IsVisible"
              name="IsVisible"
              checked={formik.values?.IsVisible}
              onChange={(event) =>
                formik.setFieldValue("IsVisible", event.target.checked)
              }
              color="primary"
            />
          }
          label={<span style={{ userSelect: "none" }}>¿Visible?</span>}
        />
        {formik.touched?.IsVisible && Boolean(formik.errors?.IsVisible) && (
          <FormHelperText error>{formik.errors?.IsVisible}</FormHelperText>
        )}
      </FormControl>

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
