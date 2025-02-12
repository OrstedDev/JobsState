import React, { useState } from "react";
import {
  Button,
  CardContent,
  TextField,
  Typography,
  Divider,
  Link,
  IconButton,
  Input,
  InputLabel,
  InputAdornment,
  FormControl,
  FormHelperText,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useFormik } from "formik";
import * as yup from "yup";

import LoadingOverlay from "../../../GenericComponents/Loader/LoadingOverlay";
import AlertComponent from "../../../GenericComponents/Alerts/AlertComponent";
import { AuthUseCase } from "../../../../DataLayer/UseCases/Aplications/Internal/Authorization/AuthUseCase";
import { AuthUserEntity } from "../../../../DomainLayer/Models/Aplication/Modules/Internal/Authorization/AuthUserEntity";

export const RegisterPage = ({ handleSwitch }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<AuthUserEntity>({
    Email: "",
    Password: "",
    Doc: "",
    Name: "",
    LastName: "",
    PhoneNumber: "",
    Address: "",
    Gender: "Male",
  });

  //=======================================
  // SUBMIT
  //=======================================

  const FormSubmitResponse = async (values: AuthUserEntity) => {
    setIsLoading(true);
    try {
      const objData = await new AuthUseCase().SetUserAuth({
        Email: values.Email,
        Password: values.Password,
        Doc: values.Doc,
        Name: values.Name,
        LastName: values.LastName,
        PhoneNumber: values.PhoneNumber,
        Address: values.Address,
        Gender: values.Gender,
      });

      if (objData.success) {
        AlertComponent("success", objData.message);
        handleSwitch(0);
      } else {
        AlertComponent("error", objData.message);
      }
    } catch (e: any) {
      AlertComponent("error", e.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <CardContent>
        <Typography
          variant="h4"
          noWrap
          align="center"
          sx={{
            mr: 2,
            fontFamily: "monospace",
            fontWeight: 1000,
            letterSpacing: ".2rem",
            color: "inherit",
            textDecoration: "none",
            userSelect: "none",
            paddingBottom: "10px",
          }}
        >
          ORSTED DEV
        </Typography>

        <Divider />

        <Typography
          align="center"
          sx={{
            mr: 2,
            fontFamily: "monospace",
            fontWeight: 1000,
            letterSpacing: ".1rem",
            color: "inherit",
            textDecoration: "none",
            userSelect: "none",
          }}
        >
          REGISTRO DE USUARIO
        </Typography>

        <FormRegister
          handleSwitch={handleSwitch}
          defaultValues={formData}
          onSubmit={FormSubmitResponse}
        />
      </CardContent>
    </>
  );
};

const FormRegister = ({
  handleSwitch,
  defaultValues,
  onSubmit,
}: {
  handleSwitch: any;
  defaultValues: AuthUserEntity;
  onSubmit: (values: AuthUserEntity) => void;
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const ShowPassword = () => setShowPassword((show) => !show);

  const validationSchema = yup.object({
    Email: yup
      .string()
      .email("Ingresa un Email Valido")
      .required("El E-mail es requerido"),
    Password: yup
      .string()
      .min(5, "Requiere minimo de 5 letras")
      .max(100, "El maximo es de 100 letras")
      .matches(
        /^[a-zA-Z0-9ñÑ@_-]+$/,
        "La contraseña solo puede contener letras, números, @, guiones y guiones bajos"
      )
      .required("El password es requerido"),
    Doc: yup
      .string()
      .required("El Documento es requerido")
      .min(8, "Documento Invalido")
      .max(8, "Llego al limite de caracteres"),
    Name: yup
      .string()
      .min(3, "Requiere minimo de 3 letras")
      .max(50, "El maximo es de 50 letras")
      .matches(
        /^[a-zA-ZñÑ\s]*$/,
        "Solo se permiten caracteres alfanuméricos, la ñ y espacios"
      )
      .required("El nombre es requerido"),
    LastName: yup
      .string()
      .min(3, "Requiere minimo de 3 letras")
      .max(50, "El maximo es de 50 letras")
      .matches(
        /^[a-zA-ZñÑ\s]*$/,
        "Solo se permiten caracteres alfanuméricos, la ñ y espacios"
      )
      .required("El Apellido es requerido"),
    PhoneNumber: yup
      .string()
      .min(9, "Numero Invalido")
      .max(9, "Llego al limite de caracteres")
      .matches(/^[0-9]*$/, "Solo se permiten caracteres numéricos")
      .required("El Numero es requerido"),
    Address: yup
      .string()
      .min(5, "Requiere minimo de 5 letras")
      .max(100, "Requiere minimo de 100 letras")
      .matches(
        /^[a-zA-Z0-9ñÑ.º@_-\s]+$/,
        "La Dirección solo puede contener letras, números, @, guiones y guiones bajos"
      )
      .required("La Dirección es requerido"),
    Gender: yup
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
        id="Email"
        name="Email"
        label="E-mail"
        variant="standard"
        type="text"
        value={formik.values?.Email}
        onChange={formik.handleChange}
        error={formik.touched?.Email && Boolean(formik.errors?.Email)}
        helperText={formik.touched?.Email && formik.errors?.Email}
      />

      <FormControl
        fullWidth
        variant="standard"
        error={formik.touched?.Password && Boolean(formik.errors?.Password)}
      >
        <InputLabel htmlFor="Password">Password</InputLabel>
        <Input
          id="Password"
          name="Password"
          type={showPassword ? "text" : "password"}
          value={formik.values?.Password}
          onChange={formik.handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={ShowPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText>
          {formik.touched?.Password && formik.errors?.Password}
        </FormHelperText>
      </FormControl>

      <TextField
        fullWidth
        id="Doc"
        name="Doc"
        label="Número de Documento"
        variant="standard"
        type="text"
        value={formik.values?.Doc}
        onChange={formik.handleChange}
        error={formik.touched?.Doc && Boolean(formik.errors?.Doc)}
        helperText={formik.touched?.Doc && formik.errors?.Doc}
      />
      
      <TextField
        fullWidth
        id="Name"
        name="Name"
        label="Nombres"
        variant="standard"
        type="text"
        value={formik.values?.Name}
        onChange={formik.handleChange}
        error={formik.touched?.Name && Boolean(formik.errors?.Name)}
        helperText={formik.touched?.Name && formik.errors?.Name}
      />

      <TextField
        fullWidth
        id="LastName"
        name="LastName"
        label="Apellidos"
        variant="standard"
        type="text"
        value={formik.values?.LastName}
        onChange={formik.handleChange}
        error={formik.touched?.LastName && Boolean(formik.errors?.LastName)}
        helperText={formik.touched?.LastName && formik.errors?.LastName}
      />

      <TextField
        fullWidth
        id="PhoneNumber"
        name="PhoneNumber"
        label="Celular"
        variant="standard"
        type="text"
        value={formik.values?.PhoneNumber}
        onChange={formik.handleChange}
        error={
          formik.touched?.PhoneNumber && Boolean(formik.errors?.PhoneNumber)
        }
        helperText={formik.touched?.PhoneNumber && formik.errors?.PhoneNumber}
      />

      <TextField
        fullWidth
        id="Address"
        name="Address"
        label="Dirección"
        variant="standard"
        type="text"
        value={formik.values?.Address}
        onChange={formik.handleChange}
        error={formik.touched?.Address && Boolean(formik.errors?.Address)}
        helperText={formik.touched?.Address && formik.errors?.Address}
      />

      <FormControl
        fullWidth
        variant="standard"
        error={formik.touched?.Gender && Boolean(formik.errors?.Gender)}
      >
        <InputLabel htmlFor="Gender">Género</InputLabel>
        <Select
          fullWidth
          id="Gender"
          name="Gender"
          value={formik.values?.Gender}
          onChange={formik.handleChange}
        >
          <MenuItem value={"Male"}>Male</MenuItem>
          <MenuItem value={"Female"}>Female</MenuItem>
        </Select>
        <FormHelperText
          error={formik.touched?.Gender && Boolean(formik.errors?.Gender)}
        >
          {formik.touched?.Gender && formik.errors?.Gender}
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
        REGISTRAR
      </Button>

      <Link
        sx={{ cursor: "pointer", paddingBottom: "10px" }}
        onClick={() => handleSwitch(0)}
        underline="none"
      >
        {"Regresar al Login"}
      </Link>
    </form>
  );
};
