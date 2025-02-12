import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import LoginIcon from "@mui/icons-material/Login";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  TextField,
  InputLabel,
  FormControl,
  FormHelperText,
  Box,
  Icon,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

import AlertComponent from "../../../../../GenericComponents/Alerts/AlertComponent";
import GenDataTable from "../../../../../GenericComponents/DataTable/GenDataTable";
import { CryptoConfigUseCase } from "../../../../../../DataLayer/UseCases/Configuration/CryptoConfigUseCase";
import { CryptoEntity } from "../../../../../../DomainLayer/Models/Aplication/Modules/Configuration/CryptoEntity";
import ListObject from "../../../../../../UtilitiesLayer/Structures/ListObject";
import { IConfigApp } from "../../../../../../DomainLayer/Interfaces/Aplication/IConfig";
import { Crypt0 } from "../../../../../../UtilitiesLayer/Library/C1p70";
import {
  GetGlobalCatalogName,
  GetGlobalCatalogItems,
} from "../../../../../../DataLayer/UseCases/Initialize/InitData";

type TablaCryptoEntity = {
  Actions: any;
  Name: string;
  Description: string;
  ProfileId: string;
};

export default function CryptoConfig({
  name,
  items,
  setItems,
}: {
  name: string;
  items: ListObject<IConfigApp.NsConfigApp>;
  setItems: any;
}) {
  //=======================================================================
  // STATES
  //=======================================================================
  const [lstCryptoConfig, setLstCryptoConfig] = useState<CryptoConfigUseCase>(
    new CryptoConfigUseCase()
  );

  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [rowsDataTable, setRowsDatatable] = useState<Array<TablaCryptoEntity>>(
    []
  );
  const [itemSelected, setItemSelected] = useState<CryptoEntity>();
  const [formData, setFormData] = useState<CryptoEntity>({
    Name: "",
    Description: "",
    ProfileId:
      GetGlobalCatalogItems(GetGlobalCatalogName("NivelAcceso")).find(
        (x) => x.Value === Crypt0.C1pt0("Estandar")
      )?.Key ?? "",
  });

  //=======================================================================
  // HANDLE CLICK
  //=======================================================================

  const CloseDialogDelete = () => {
    setOpenDialogConfirmDelete(false);
  };

  const OpenDialogForm = () => {
    setOpenFormDialog(true);
  };

  const CloseDialogForm = () => {
    setOpenFormDialog(false);
    setFormData({
      Name: "",
      Description: "",
      ProfileId:
        GetGlobalCatalogItems(GetGlobalCatalogName("NivelAcceso")).find(
          (x) => x.Value === Crypt0.C1pt0("Estandar")
        )?.Key ?? "",
    });
  };

  //=======================================================================
  //CARGAR DATA TABLE INICIAL
  //=======================================================================

  const LoadInDataTable = async () => {
    try {
      const rows: Array<TablaCryptoEntity> = [];
      lstCryptoConfig?.getAll().forEach((items: CryptoEntity) => {
        let role = GetGlobalCatalogItems(
          GetGlobalCatalogName("NivelAcceso")
        ).find((x) => x.Key === items?.ProfileId);
        rows.push({
          Actions: (
            <>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    color: "white",
                    background: "red",
                    borderRadius: "5px",
                    padding: "3px",
                    cursor: "pointer",
                    marginRight: "3px",
                  }}
                  onClick={() => ButtonDeleteCryptoItem(items)}
                >
                  <DeleteIcon />
                </div>
                <div
                  style={{
                    color: "white",
                    background: "green",
                    borderRadius: "5px",
                    padding: "3px",
                    cursor: "pointer",
                  }}
                  onClick={() => ButtonUpdateCryptoItem(items)}
                >
                  <EditIcon />
                </div>
              </div>
            </>
          ),
          Name: items?.Name,
          Description: items?.Description,
          ProfileId: role ? Crypt0.DC1pt0(role.Value ?? "") : "Desconocido...",
        });
      });

      setRowsDatatable(rows);
    } catch (error: any) {
      AlertComponent("error", error.message);
    }
  };

  useEffect(() => {
    setLstCryptoConfig(new CryptoConfigUseCase(items.getBy("Id", name)?.Body));
  }, [items]);

  useEffect(() => {
    LoadInDataTable();
  }, [lstCryptoConfig]);

  //=======================================================================
  // GET VALUES FORM
  //=======================================================================

  const GetValuesForm = (values: CryptoEntity) => {
    if (formData.Name === "") {
      RegisterCryptoItem(values);
    } else {
      UpdateCryptoItem(values);
    }
  };

  //=======================================================================
  // REGISTER
  //=======================================================================

  const RegisterCryptoItem = async (values: CryptoEntity) => {
    try {
      if (lstCryptoConfig?.add(values)) {
        setOpenFormDialog(false);
        if (items.getBy("Id", name) === null) {
          items.add({
            Id: name,
            Body: lstCryptoConfig?.getToStringJSON(),
            Update: true,
          });
        } else {
          items.editBy("Id", name, {
            Id: name,
            Body: lstCryptoConfig?.getToStringJSON(),
            Update: true,
          });
        }

        setItems(new ListObject<IConfigApp.NsConfigApp>(items.getAll()));
      } else {
        AlertComponent("info", "Ya existe una variable con ese nombre");
      }
    } catch (e: any) {
      AlertComponent("error", e.message);
    }
  };

  //=======================================================================
  // UPDATE
  //=======================================================================

  const ButtonUpdateCryptoItem = async (values: CryptoEntity) => {
    setOpenFormDialog(true);
    setFormData(values);
  };

  const UpdateCryptoItem = async (values: CryptoEntity) => {
    try {
      console.log("values Edit", values);
      if (lstCryptoConfig?.edit(values)) {
        setOpenFormDialog(false);
        items.editBy("Id", name, {
          Id: name,
          Body: lstCryptoConfig?.getToStringJSON(),
          Update: true,
        });

        setItems(new ListObject<IConfigApp.NsConfigApp>(items.getAll()));
      } else {
        AlertComponent("info", "Ya existe una variable con ese nombre");
      }
    } catch (e: any) {
      AlertComponent("error", e.message);
    }
  };

  //=======================================================================
  // DELETE
  //=======================================================================

  const ButtonDeleteCryptoItem = (item: CryptoEntity) => {
    setItemSelected(item);
    setOpenDialogConfirmDelete(true);
  };

  const DeleteCryptoItem = async () => {
    CloseDialogDelete();
    try {
      lstCryptoConfig.delete(itemSelected?.Key ?? "");
      items.editBy("Id", name, {
        Id: name,
        Body: lstCryptoConfig?.getToStringJSON(),
        Update: true,
      });
      setItems(new ListObject<IConfigApp.NsConfigApp>(items.getAll()));
    } catch (error: any) {
      AlertComponent("error", error?.message);
    }
  };

  //=======================================================================
  // RENDER
  //=======================================================================

  return (
    <>
      <Box display="flex" justifyContent="flex-end" paddingTop={"7px"}>
        <Button
          variant="contained"
          onClick={OpenDialogForm}
          startIcon={<AddBoxIcon />}
        >
          Add
        </Button>
      </Box>

      <TableCrypto dataRows={rowsDataTable} />

      {openFormDialog && (
        <Dialog open={openFormDialog} onClose={CloseDialogForm} maxWidth="xs">
          <DialogTitle>
            <center>
              {formData.Name == "" ? "NEW VAR" : "EDIT VAR"}
            </center>
          </DialogTitle>
          <DialogContent>
            <FormCripto defaultValues={formData} onSubmit={GetValuesForm} />
          </DialogContent>
        </Dialog>
      )}

      {openDialogConfirmDelete && (
        <Dialog
          open={openDialogConfirmDelete}
          onClose={CloseDialogDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"¿Está seguro de eliminar este registro?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Eliminar el registro puede tener consecuencias significativas,
              incluyendo posibles errores en la funcionalidad de la aplicación.
              ¿Está seguro de que desea proceder con esta acción, dada la
              importancia y posibles impactos adversos que podría tener?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={CloseDialogDelete}
              variant="contained"
              color="success"
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => DeleteCryptoItem()}
              variant="contained"
              color="error"
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

const FormCripto = ({
  defaultValues,
  onSubmit,
}: {
  defaultValues: CryptoEntity;
  onSubmit: (values: CryptoEntity) => void;
}) => {
  const validationSchema = yup.object({
    Name: yup
      .string()
      .min(3, "Requiere minimo de 3 letras")
      .max(25, "El maximo es de 25 letras")
      .matches(/^[a-zA-Z0-9]*$/, "Solo se permiten caracteres alfanuméricos")
      .required("El nombre es requerido"),
    Description: yup
      .string()
      .min(5, "Requiere minimo de 5 letras")
      .max(500, "El maximo es de 500 letras")
      .matches(
        /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ\s.,]*$/,
        "Solo se permiten caracteres alfanuméricos, la ñ, tildes, espacios, puntos y comas"
      )
      .required("La descripción es requerido"),
    ProfileId: yup
      .string()
      .required("Seleccione un perfil")
      .min(1, "Seleccione un perfil"),
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

      <FormControl
        fullWidth
        variant="standard"
        error={formik.touched.ProfileId && Boolean(formik.errors.ProfileId)}
      >
        <InputLabel htmlFor="ProfileId">Perfil Access</InputLabel>
        <Select
          fullWidth
          id="ProfileId"
          name="ProfileId"
          value={formik?.values?.ProfileId}
          onChange={formik.handleChange}
        >
          {GetGlobalCatalogItems(GetGlobalCatalogName("NivelAcceso")).map(
            (x) => (
              <MenuItem key={x.Key} value={x.Key}>
                {Crypt0.DC1pt0(x.Value ?? "")}
              </MenuItem>
            )
          )}
        </Select>
        <FormHelperText
          error={formik.touched.ProfileId && Boolean(formik.errors.ProfileId)}
        >
          {formik.touched.ProfileId && formik.errors.ProfileId}
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
        {defaultValues.Name == "" ? "REGISTER" : "SAVE"}
      </Button>
    </form>
  );
};

const TableCrypto = ({ dataRows }: { dataRows: Array<TablaCryptoEntity> }) => {
  const columns = [
    {
      name: (
        <SettingsSuggestIcon style={{ margin: "auto", textAlign: "center" }} />
      ),
      idName: "Actions",
      selector: (row: TablaCryptoEntity) => row?.Actions,
      cell: (row: TablaCryptoEntity) => (
        <div style={{ margin: "auto", textAlign: "center" }}>
          {row?.Actions}
        </div>
      ),
      width: "80px",
    },
    {
      name: "NOMBRE",
      idName: "Name",
      selector: (row: TablaCryptoEntity) => row?.Name,
      cell: (row: TablaCryptoEntity) => <>{row?.Name}</>,
      style: { fontWeight: "bold" },
      sortable: true,
      width: "150px",
    },
    {
      name: "DESCRIPCIÓN",
      idName: "Description",
      selector: (row: TablaCryptoEntity) => row?.Description,
      cell: (row: TablaCryptoEntity) => <>{row?.Description}</>,
    },
    {
      name: <p style={{ margin: "auto", textAlign: "center" }}>PRIVILEGIO</p>,
      idName: "ProfileId",
      selector: (row: TablaCryptoEntity) => row?.ProfileId,
      cell: (row: TablaCryptoEntity) => (
        <p style={{ margin: "auto", textAlign: "center" }}>{row?.ProfileId}</p>
      ),
      width: "150px",
    },
  ];

  return <GenDataTable columns={columns} data={dataRows} />;
};
