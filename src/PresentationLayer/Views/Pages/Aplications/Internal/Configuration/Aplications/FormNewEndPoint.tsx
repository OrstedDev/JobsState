import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { InputLabel, FormControl, FormHelperText } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

export type AplicationEndPointEntity = {
  Value: string;
  Name?: string;
  Type?: string;
};

const httpMethods = [
  "GET", // Recuperar información
  "POST", // Crear recursos o ejecutar procesos
  "PUT", // Actualizar o reemplazar recursos
  "DELETE", // Eliminar recursos
  "PATCH", // Actualización parcial de recursos
  "OPTIONS", // Obtener opciones de comunicación soportadas por el servidor
  "HEAD", // Similar a GET, pero sin cuerpo de respuesta
  "TRACE", // Diagnóstico para rastrear una solicitud hasta su origen
  "CONNECT", // Establecer un túnel para comunicación bidireccional
  "LINK", // Vincular un recurso con otro (propuesta, no ampliamente soportado)
  "UNLINK", // Eliminar un vínculo entre recursos (propuesta, no ampliamente soportado)
  "PURGE", // Eliminar caché en algunos proxies (no estándar)
  "PROPFIND", // Recuperar propiedades de un recurso (usado en WebDAV)
  "PROPPATCH", // Actualizar propiedades de un recurso (usado en WebDAV)
  "MKCOL", // Crear una colección (usado en WebDAV)
  "COPY", // Copiar un recurso (usado en WebDAV)
  "MOVE", // Mover un recurso (usado en WebDAV)
  "LOCK", // Bloquear un recurso (usado en WebDAV)
  "UNLOCK", // Desbloquear un recurso (usado en WebDAV)
  "SEARCH", // Realizar una búsqueda sobre recursos
];

export default function FormNewEndPoint({
  defaultValues,
  onSubmit,
}: {
  defaultValues: AplicationEndPointEntity;
  onSubmit: (values: AplicationEndPointEntity) => void;
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
    Type: yup
      .string()
      .required("Seleccione un tipo")
      .min(1, "Seleccione un tipo"),
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

      <FormControl
        fullWidth
        variant="standard"
        error={formik.touched.Type && Boolean(formik.errors.Type)}
      >
        <InputLabel htmlFor="Type">Metodo</InputLabel>
        <Select
          fullWidth
          id="Type"
          name="Type"
          value={formik?.values?.Type}
          onChange={formik.handleChange}
        >
          {httpMethods.map((method) => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText
          error={formik.touched.Type && Boolean(formik.errors.Type)}
        >
          {formik.touched.Type && formik.errors.Type}
        </FormHelperText>
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
