import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  IconButton,
  CardContent,
  TextField,
  Typography,
  Divider,
  InputLabel,
  Input,
  InputAdornment,
  FormControl,
  FormHelperText,
} from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import LoginIcon from "@mui/icons-material/Login";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useFormik } from "formik";
import * as yup from "yup";

import AlertComponent from "../../../../../../GenericComponents/Alerts/AlertComponent";
import UserUseCase from "../../../../../../../DataLayer/UseCases/Aplications/Internal/User/UserUseCase";
import { AuthUseCase } from "../../../../../../../DataLayer/UseCases/Aplications/Internal/Authorization/AuthUseCase";
import { UpdateUserEntity } from "../../../../../../../DomainLayer/Models/Aplication/Modules/Internal/User/UserEntity";
import { UserInfoBasic } from "../../../../../../../DomainLayer/Models/Fragment/FragmentEntity";

const style = {
  div: { display: "block", marginBottom: "5px" },
  span: {
    fontWeight: "bold",
    display: "inline-flex",
    alignItems: "center",
  },
};

export default function CardInformation({
  userInfoBasic,
  setUserInfoBasic,
}: {
  userInfoBasic: UserInfoBasic;
  setUserInfoBasic: any;
}) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [pin, setPin] = useState<string>("••••");

  const [dialogState, setDialogState] = useState<{ [key: string]: boolean }>({
    information: false,
    confirmPass: false,
  });

  const [items, setItems] = useState<Array<{ label: string; value: string }>>(
    []
  );

  const [defaultValues, setDefaultValues] = useState<UpdateUserEntity>({
    Email: "",
  });

  //=======================================
  // DIALOG
  //=======================================

  const openDialog = (dialogName: string) => {
    setDialogState((prevState) => ({
      ...prevState,
      [dialogName]: true,
    }));
  };

  const closeDialog = (dialogName: string) => {
    setDialogState((prevState) => ({
      ...prevState,
      [dialogName]: false,
    }));
  };

  //=======================================
  // SUBMIT
  //=======================================

  const UpdateInformation = async (values: UpdateUserEntity) => {
    closeDialog("information");

    setUserInfoBasic((prevState: UserInfoBasic) => ({
      ...prevState,
      Doc: values.Doc ?? "",
      NickName: values.NickName ?? "",
      FirstName: values.FirstName ?? "",
      LastName: values.LastName ?? "",
      PhoneNumber: values.PhoneNumber ?? "",
      Address: values.Address ?? "",
      Gender: values.Gender ?? "",
    }));

    try {
      if (await new UserUseCase().validatePin(values.Pin ?? "")) {
        await new UserUseCase().updateUserInfo({
          Doc: values.Doc ?? "",
          NickName: values.NickName ?? "",
          FirstName: values.FirstName ?? "",
          LastName: values.LastName ?? "",
          Address: values.Address ?? "",
          PhoneNumber: values.PhoneNumber ?? "",
          Gender: values.Gender ?? "",
          NewPin: values.NewPin ?? undefined,
        });
      } else {
        AlertComponent("error", "Pin Incorrecto.");
      }
    } catch (e: any) {
      AlertComponent("error", e.message);
    }
  };

  //=======================================
  // LOAD
  //=======================================

  useEffect(() => {
    setItems([
      { label: "E-mail", value: userInfoBasic?.Email ?? "" },
      { label: "Document", value: userInfoBasic?.Doc ?? "" },
      { label: "First Name", value: userInfoBasic?.FirstName ?? "" },
      { label: "Last Name", value: userInfoBasic?.LastName ?? "" },
      { label: "Address", value: userInfoBasic?.Address ?? "" },
      { label: "Phone", value: "+51 " + userInfoBasic?.PhoneNumber },
      { label: "Gender", value: userInfoBasic?.Gender ?? "" },
    ]);

    setDefaultValues({
      Pin: "",
      Email: userInfoBasic?.Email ?? "",
      Doc: userInfoBasic?.Doc ?? "",
      NickName: userInfoBasic?.NickName ?? "",
      FirstName: userInfoBasic?.FirstName ?? "",
      LastName: userInfoBasic?.LastName ?? "",
      PhoneNumber: userInfoBasic?.PhoneNumber ?? "",
      Address: userInfoBasic?.Address ?? "",
      Gender: userInfoBasic?.Gender ?? "Male",
      NewPin: "",
    });
  }, [userInfoBasic]);

  //=======================================
  // VIEW PIN
  //=======================================

  const ViewPin = async (e: any) => {
    e.preventDefault();
    try {
      if (
        await new AuthUseCase().ReAuthenticate({
          Email: userInfoBasic?.Email,
          Password: password,
        })
      ) {
        setPassword("");
        setPin((await new UserUseCase().getPin()) ?? "");
      } else {
        setPassword("");
        setPin("••••");
        AlertComponent("error", "Password Incorrecto.");
      }
    } catch (e: any) {
      console.log(e.message);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          INFORMATION
        </Typography>
        <Divider />
        <Box sx={{ padding: 1 }}>
          {items.map((item, index) => (
            <div key={index} style={style.div}>
              <span style={style.span}>
                {item.label}:
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ marginLeft: "8px" }}
                >
                  {item.value}
                </Typography>
              </span>
            </div>
          ))}

          <div style={style.div}>
            <span style={style.span}>
              <Typography variant="body2" fontWeight="bold" sx={{ mr: 1 }}>
                PIN:
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {pin}
              </Typography>

              <IconButton
                onClick={() => {
                  if (pin === "••••") {
                    openDialog("confirmPass");
                  } else {
                    setPin("••••");
                  }
                }}
                size="small"
                sx={{ marginLeft: "auto" }}
              >
                {pin !== "••••" ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </span>
          </div>
        </Box>
        <Button
          variant="text"
          sx={{
            mt: 2,
          }}
          fullWidth
          onClick={() => {
            openDialog("information");
          }}
        >
          EDIT INFORMATION
        </Button>

        {dialogState["information"] && (
          <Dialog
            open={dialogState["information"]}
            onClose={() => {
              closeDialog("information");
            }}
            maxWidth="xs"
          >
            <DialogTitle>
              <center>EDIT INFORMATION</center>
            </DialogTitle>
            <DialogContent>
              <FormUpdate
                defaultValues={defaultValues}
                onSubmit={UpdateInformation}
              />
            </DialogContent>
          </Dialog>
        )}

        {
          <Dialog
            open={dialogState["confirmPass"]}
            onClose={() => {
              closeDialog("confirmPass");
            }}
            maxWidth="xs"
          >
            <DialogTitle>
              <center>CONFIRM PASSWORD</center>
            </DialogTitle>
            <DialogContent>
              <form
                onSubmit={(e: any) => {
                  ViewPin(e);
                  closeDialog("confirmPass");
                }}
              >
                <FormControl fullWidth variant="standard">
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    autoFocus={true}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                  fullWidth
                >
                  Validate
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      </CardContent>
    </Card>
  );
}

const FormUpdate = ({
  defaultValues,
  onSubmit,
}: {
  defaultValues: UpdateUserEntity;
  onSubmit: (values: UpdateUserEntity) => void;
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const ShowPassword = () => setShowPassword((show) => !show);

  const validationSchema = yup.object({
    Pin: yup
      .string()
      .min(4, "Pin Invalido, 4 digitos")
      .max(4, "Pin Invalido, 4 digitos")
      .matches(/^[0-9]*$/, "Solo se permiten caracteres numéricos")
      .required("El Password es requerido"),
    Doc: yup
      .string()
      .required("El Documento es requerido")
      .min(8, "Documento Invalido")
      .max(8, "Llego al limite de caracteres"),
    NickName: yup
      .string()
      .min(3, "Requiere minimo de 3 letras")
      .max(13, "El maximo es de 13 letras")
      .matches(
        /^[a-z0-9A-ZñÑ\s]*$/,
        "Solo se permiten caracteres alfanuméricos, la ñ y espacios"
      )
      .required("El Alias es requerido"),
    FirstName: yup
      .string()
      .min(3, "Requiere minimo de 3 letras")
      .max(50, "El maximo es de 50 letras")
      .matches(
        /^[a-zA-ZñÑ\s]*$/,
        "Solo se permiten caracteres alfanuméricos, la ñ y espacios"
      )
      .required("El Nombre es requerido"),
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
      .required("La Dirección es requerida"),
    Gender: yup
      .string()
      .required("Seleccione un Género")
      .min(1, "Seleccione un Género"),
    NewPin: yup
      .string()
      .min(4, "Pin Invalido, 4 digitos")
      .max(4, "Pin Invalido, 4 digitos")
      .matches(/^[0-9]*$/, "Solo se permiten caracteres numéricos"),
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
        id="Pin"
        name="Pin"
        label="* Confirm Pin (default 1111)"
        variant="standard"
        type="text"
        value={formik.values?.Pin}
        onChange={formik.handleChange}
        error={formik.touched?.Pin && Boolean(formik.errors?.Pin)}
        helperText={formik.touched?.Pin && formik.errors?.Pin}
      />

      <Divider sx={{ borderWidth: "1.5px", marginTop: "15px" }} />

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
        id="NickName"
        name="NickName"
        label="Alias"
        variant="standard"
        type="text"
        value={formik.values?.NickName}
        onChange={formik.handleChange}
        error={formik.touched?.NickName && Boolean(formik.errors?.NickName)}
        helperText={formik.touched?.NickName && formik.errors?.NickName}
      />

      <TextField
        fullWidth
        id="FirstName"
        name="FirstName"
        label="Nombres"
        variant="standard"
        type="text"
        value={formik.values?.FirstName}
        onChange={formik.handleChange}
        error={formik.touched?.FirstName && Boolean(formik.errors?.FirstName)}
        helperText={formik.touched?.FirstName && formik.errors?.FirstName}
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

      <TextField
        fullWidth
        id="NewPin"
        name="NewPin"
        label="New Pin (Opcional)"
        variant="standard"
        type="text"
        value={formik.values?.NewPin}
        onChange={formik.handleChange}
        error={formik.touched?.NewPin && Boolean(formik.errors?.NewPin)}
        helperText={formik.touched?.NewPin && formik.errors?.NewPin}
      />

      <Button
        fullWidth
        sx={{ marginBottom: "10px", marginTop: "15px" }}
        color="primary"
        variant="contained"
        type="submit"
        endIcon={<LoginIcon />}
      >
        SAVE
      </Button>
    </form>
  );
};
