import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import GoogleIcon from "@mui/icons-material/Google";
import { useFormik } from "formik";
import * as yup from "yup";

import LoadingOverlay from "../../../GenericComponents/Loader/LoadingOverlay";
import AlertComponent from "../../../GenericComponents/Alerts/AlertComponent";
import { setFullscreen } from "../../DashBoard/RightNavDashBoard/FullPageButton";
import { AuthUseCase } from "../../../../DataLayer/UseCases/Aplications/Internal/Authorization/AuthUseCase";
import { useGlobalContext } from "../../../../Global";
import { AuthUserEntity } from "../../../../DomainLayer/Models/Aplication/Modules/Internal/Authorization/AuthUserEntity";

export const LoginPage = ({ handleSwitch }: any) => {
  const navigate = useNavigate();
  const { dispatch } = useGlobalContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<AuthUserEntity>({
    Email: "",
    Password: "",
  });

  //=======================================
  // SUBMIT
  //=======================================

  const FormSubmitResponse = async (
    values: AuthUserEntity,
    typeSubmit: string
  ) => {
    setIsLoading(true);
    try {
      if (typeSubmit === "Login") {
        const objData = await new AuthUseCase().LoginAuth({
          Email: values.Email,
          Password: values.Password,
        });

        if (objData.success) {
          setFullscreen(true);

          dispatch({
            type: "UPDATE_STATE",
            payload: { loginDate: new Date().toISOString() },
          });

          navigate("/");

          AlertComponent("success", objData.message);
        } else {
          AlertComponent("info", objData.message);
        }
      } else if (typeSubmit === "ResetPassword") {
        const objData = await new AuthUseCase().ResetPass({
          Email: values?.Email,
        });
        if (objData.success) {
          AlertComponent("success", objData.message);
        } else {
          AlertComponent("info", objData.message);
        }
      }
    } catch (e: any) {
      AlertComponent("error", e.message);
    }
    setIsLoading(false);
  };

  const LoginForGoogle = async () => {
    setIsLoading(true);
    try {
      const objData = await new AuthUseCase().LoginGoogleAuth();
      if (objData.success) {
        dispatch({
          type: "UPDATE_STATE",
          payload: { loginDate: new Date().toISOString() },
        });

        navigate("/");

        setFullscreen(true);

        AlertComponent("success", objData.message);
      } else {
        AlertComponent("info", objData.message);
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
          Plataforma integral para impulsar la innovación con eficiencia y un
          diseño técnico distintivo
        </Typography>

        <FormLogin
          handleSwitch={handleSwitch}
          defaultValues={formData}
          onSubmit={FormSubmitResponse}
        />
      </CardContent>
      <Divider />
      <CardContent>
        Don't have an Account
        <Button
          fullWidth
          variant="outlined"
          size="small"
          endIcon={<GoogleIcon />}
          onClick={LoginForGoogle}
        >
          Google Login
        </Button>
      </CardContent>
    </>
  );
};

const FormLogin = ({
  handleSwitch,
  defaultValues,
  onSubmit,
}: {
  handleSwitch: any;
  defaultValues: AuthUserEntity;
  onSubmit: (values: AuthUserEntity, typeSubmit: string) => void;
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [typeSubmit, setTypeSubmit] = useState<string>("Login");
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
  });

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values, typeSubmit);
      resetForm();
    },
  });

  const SubmitResetPassword = async (e: any) => {
    e.preventDefault();
    setTypeSubmit("ResetPassword");
    formik.handleSubmit();
  };

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

      <Button
        fullWidth
        sx={{ marginBottom: "10px", marginTop: "15px" }}
        color="primary"
        variant="contained"
        type="submit"
        endIcon={<LoginIcon />}
      >
        Login
      </Button>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "-20px",
        }}
      >
        <Link
          sx={{ cursor: "pointer", paddingBottom: "10px" }}
          onClick={SubmitResetPassword}
          underline="none"
        >
          Forgot Password?
        </Link>
        <Link
          sx={{ cursor: "pointer", paddingBottom: "10px" }}
          onClick={() => handleSwitch(1)}
          underline="none"
        >
          Registrar
        </Link>
      </div>
    </form>
  );
};
