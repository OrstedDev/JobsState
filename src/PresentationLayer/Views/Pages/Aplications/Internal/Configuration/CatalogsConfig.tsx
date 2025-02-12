import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import LoginIcon from "@mui/icons-material/Login";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import { TextField, Box } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useFormik } from "formik";
import * as yup from "yup";

import AlertComponent from "../../../../../GenericComponents/Alerts/AlertComponent";
import { CatalogosUseCase } from "../../../../../../DataLayer/UseCases/Aplications/Internal/Configuration/CatalogsUseCase";
import { CatalogEntity } from "../../../../../../DomainLayer/Models/Aplication/Modules/Internal/Configuration/CatalogEntity";
import ListObject from "../../../../../../UtilitiesLayer/Structures/ListObject";
import { IConfigApp } from "../../../../../../DomainLayer/Interfaces/Aplication/Internal/IConfig";

export default function CatalogsConfig({
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

  const [objCatalogConfig, setObjCatalogConfig] = useState<CatalogosUseCase>(
    new CatalogosUseCase()
  );

  const [openDialogConfirmDelete, setOpenDialogConfirmDelete] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [modeAction, setModeAction] = useState<number>(0);
  const [itemSelected, setItemSelected] = useState<CatalogEntity>();
  const [formData, setFormData] = useState<CatalogEntity>({ Value: "" });

  //=======================================================================
  // HANDLE CLICK
  //=======================================================================

  const CloseDialogDelete = () => {
    setOpenDialogConfirmDelete(false);
  };

  const OpenDialogForm = (mode: number, selected?: CatalogEntity) => {
    setOpenFormDialog(true);
    setModeAction(mode);
    setItemSelected(selected);
    if (mode === 1 || mode === 3) {
      setFormData(selected ?? { Value: "" });
    }
  };

  const CloseDialogForm = () => {
    setOpenFormDialog(false);
    setFormData({ Value: "" });
  };

  //=======================================================================
  //CARGAR DATA TABLE INICIAL
  //=======================================================================

  useEffect(() => {
    setObjCatalogConfig(new CatalogosUseCase(items.getBy("Id", name)?.Body));
  }, [items]);

  //=======================================================================
  // GET VALUES FORM
  //=======================================================================

  const GetValuesForm = (values: CatalogEntity) => {
    switch (modeAction) {
      case 0: // Edit
        RegisterCatalog(values);
        break;
      case 1: // Edit
        UpdateCatalog(values);
        break;
      case 2: // Add Row Item
        RegisterCatalog(values);
        break;
      case 3: // Edit Row Item
        UpdateCatalog(values);
        break;
      default:
        break;
    }
  };

  //=======================================================================
  // REGISTER
  //=======================================================================

  const RegisterCatalog = async (values: CatalogEntity) => {
    let valido: boolean = false;
    try {
      if (modeAction === 0) {
        valido = objCatalogConfig?.add(values?.Value ?? "");
      } else {
        valido = objCatalogConfig?.addItem(
          itemSelected?.Key ?? "",
          values?.Value ?? ""
        );
      }

      if (valido) {
        setOpenFormDialog(false);
        if (items.getBy("Id", name) === null) {
          items.add({
            Id: name,
            Body: objCatalogConfig?.getToStringJSON(),
            Update: true,
          });
        } else {
          items.editBy("Id", name, {
            Id: name,
            Body: objCatalogConfig?.getToStringJSON(),
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

  const UpdateCatalog = async (values: CatalogEntity) => {
    try {
      console.log("Edit ", values);
      let valido: boolean = false;
      if (modeAction === 1) {
        valido = objCatalogConfig?.edit(values);
      } else {
        valido = objCatalogConfig?.editItem(values);
      }

      if (valido) {
        setOpenFormDialog(false);
        items.editBy("Id", name, {
          Id: name,
          Body: objCatalogConfig?.getToStringJSON(),
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

  const ButtonDelete = (mode: number, item: CatalogEntity) => {
    setItemSelected(item);
    setModeAction(mode);
    setOpenDialogConfirmDelete(true);
  };

  const Delete = async () => {
    CloseDialogDelete();
    try {
      console.log("Delet ", itemSelected);
      let valido: boolean = false;
      if (modeAction === 4) {
        valido = objCatalogConfig?.delete(itemSelected?.Key ?? "");
      } else {
        valido = objCatalogConfig?.deleteItem(
          itemSelected?.KeyParent ?? "",
          itemSelected?.Key ?? ""
        );
      }

      items.editBy("Id", name, {
        Id: name,
        Body: objCatalogConfig?.getToStringJSON(),
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

  const getLabel = () => {
    switch (modeAction) {
      case 0:
        return "NEW CATALOG";
      case 1:
        return "EDIT CATALOG";
      case 2:
        return "ADD NEW ITEM TO CATALOG";
      case 3:
        return "EDIT ITEM";
      default:
        return "-";
    }
  };

  return (
    <>
      <Typography gutterBottom variant="h6" component="div">
        <center style={{ fontWeight: "bold" }}>CATALOGS</center>
      </Typography>

      <Button
        variant="contained"
        onClick={() => OpenDialogForm(0)}
        style={{ marginBottom: "10px" }}
        startIcon={<AddBoxIcon />}
      >
        Add
      </Button>

      <SimpleTreeView>
        {objCatalogConfig.get().map((item: CatalogEntity, index: number) => (
          <TreeItem
            key={index}
            itemId={index.toString()}
            label={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{item.Value}</span>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    size="small"
                    style={{
                      marginLeft: "auto",
                      minWidth: "0",
                      padding: "6px",
                    }}
                    onClick={(event) => {
                      event.stopPropagation(); // Detiene la propagación
                      OpenDialogForm(2, item);
                    }}
                    sx={{ marginRight: "5px" }}
                  >
                    <AddBoxIcon />
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    style={{
                      marginLeft: "auto",
                      minWidth: "0",
                      padding: "6px",
                    }}
                    onClick={(event) => {
                      event.stopPropagation(); // Detiene la propagación
                      OpenDialogForm(1, item);
                    }}
                    sx={{ marginRight: "5px" }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    style={{
                      marginLeft: "auto",
                      minWidth: "0",
                      padding: "6px",
                    }}
                    onClick={(event) => {
                      event.stopPropagation(); // Detiene la propagación
                      ButtonDelete(4, item);
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              </div>
            }
            sx={{ userSelect: "none" }}
          >
            <TableContainer component={Paper} sx={{ marginBottom: "25px" }}>
              <Table sx={{ minWidth: 350 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Key</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {objCatalogConfig
                    .getItems(item.Key ?? "")
                    .map((row, indexItem: number) => (
                      <TableRow
                        key={indexItem}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row" width={150}>
                          {row.Key}
                        </TableCell>
                        <TableCell align="left" width={150}>
                          {row.Value}
                        </TableCell>
                        <TableCell align="left" width={150}>
                          <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            style={{
                              marginLeft: "auto",
                              minWidth: "0",
                              padding: "6px",
                            }}
                            onClick={(event) => {
                              event.stopPropagation();
                              OpenDialogForm(3, row);
                            }}
                            sx={{ marginRight: "5px" }}
                          >
                            <EditIcon />
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            style={{
                              marginLeft: "auto",
                              minWidth: "0",
                              padding: "6px",
                            }}
                            onClick={(event) => {
                              event.stopPropagation(); // Detiene la propagación
                              ButtonDelete(5, row);
                            }}
                          >
                            <DeleteIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TreeItem>
        ))}
      </SimpleTreeView>

      {openFormDialog && (
        <Dialog open={openFormDialog} onClose={CloseDialogForm} maxWidth="xs">
          <DialogTitle>
            <center>{getLabel()}</center>
          </DialogTitle>
          <DialogContent>
            <FormCatalog defaultValues={formData} onSubmit={GetValuesForm} />
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
              onClick={async () => Delete()}
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

const FormCatalog = ({
  defaultValues,
  onSubmit,
}: {
  defaultValues: CatalogEntity;
  onSubmit: (values: CatalogEntity) => void;
}) => {
  const validationSchema = yup.object({
    Value: yup
      .string()
      .min(3, "Requiere minimo de 3 letras")
      .max(25, "El maximo es de 25 letras")
      .matches(
        /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ\s.,]*$/,
        "Solo se permiten caracteres alfanuméricos, la ñ, tildes, espacios, puntos y comas"
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
        label="Nombre de Catálogo"
        variant="standard"
        type="text"
        value={formik.values?.Value}
        onChange={formik.handleChange}
        error={formik.touched?.Value && Boolean(formik.errors?.Value)}
        helperText={formik.touched?.Value && formik.errors?.Value}
      />

      <Button
        fullWidth
        sx={{ marginBottom: "10px", marginTop: "15px" }}
        color="primary"
        variant="contained"
        type="submit"
        endIcon={<LoginIcon />}
      >
        {defaultValues.Value == "" ? "REGISTER" : "SAVE"}
      </Button>
    </form>
  );
};
