import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import Grid from "@mui/material/Grid2";
import Compressor from "compressorjs";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import AddBoxIcon from "@mui/icons-material/AddBox";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";

import AlertComponent from "../../../../../GenericComponents/Alerts/AlertComponent";
import AplicationUseCase from "../../../../../../DataLayer/UseCases/Configuration/AplicationUseCase";
import {
  ObjetcEntity,
  AplicationEntity,
  AplicationGetEntity,
} from "../../../../../../DomainLayer/Models/Aplication/Modules/Configuration/AplicationEntity";
import { ConfigUseCase } from "../../../../../../DataLayer/UseCases/Configuration/ConfigUseCase";
import { GetGlobalCryptRoutes } from "../../../../../../DataLayer/UseCases/Initialize/InitData";
import ListObject from "../../../../../../UtilitiesLayer/Structures/ListObject";
import { IConfigApp } from "../../../../../../DomainLayer/Interfaces/Aplication/IConfig";

import FormNewItem from "./FormNewItem";
import FormNewApplication from "./FormNewApplication";
import FormImgApplication, { ImgEntity } from "./FormImgApplication";
import FormNewEndPoint, { AplicationEndPointEntity } from "./FormNewEndPoint";

export default function AplicationsConfig({
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

  const [aplicationConfig, setAplicationConfig] = useState<AplicationUseCase>(
    new AplicationUseCase()
  );

  const [itemSelected, setItemSelected] = useState<AplicationGetEntity>();

  const [formEndPoint, setFormEndPoint] = useState<AplicationEndPointEntity>({
    Value: "",
    Name: "",
    Type: "POST",
  });

  const [formApp, setFormApp] = useState<AplicationEntity>({
    Value: "",
    Name: "",
    Description: "",
    IsVisible: true,
  });

  const [formImg, setFormImg] = useState<ImgEntity>({
    Img: "",
  });

  //=======================================================================
  //DIALOG
  //=======================================================================

  const [dialogState, setDialogState] = useState<{ [key: string]: boolean }>({
    delete: false,
    aplication: false,
    imgApp: false,
    itemApp: false,
    itemEndpoint: false,
  });

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

  //=======================================================================
  //CARGAR DATA TABLE INICIAL
  //=======================================================================

  useEffect(() => {
    setAplicationConfig(new AplicationUseCase(items.getBy("Id", name)?.Body));
  }, [items]);

  //=======================================================================
  //COMPRESSOR
  //=======================================================================

  const compressImage = (image: any) => {
    return new Promise((resolve, reject) => {
      new Compressor(image, {
        quality: 0.7,
        success(result) {
          resolve(result);
        },
        error(err) {
          reject(err);
        },
      });
    });
  };

  //=======================================================================
  // REGISTER
  //=======================================================================

  const RegisterApp = async (values: AplicationEntity) => {
    try {
      const reg = aplicationConfig.add("0", {
        Value: values.Value,
        Name: values.Name,
        Description: values.Description,
        IsVisible: values.IsVisible,
        IsEnabled: values.IsEnabled,
      });

      if (reg.success) {
        aplicationConfig.add(reg.ref, {
          Value: "Routes",
          Name: "RUTAS",
          IsVisible: false,
          IsEnabled: true,
        });

        aplicationConfig.add(reg.ref, {
          Value: "Domains",
          Name: "DOMINIOS",
          IsVisible: false,
          IsEnabled: true,
        });

        closeDialog("aplication");
        if (items.getBy("Id", name) === null) {
          items.add({
            Id: name,
            Body: aplicationConfig?.getToStringJSON(),
            Update: true,
          });
        } else {
          items.editBy("Id", name, {
            Id: name,
            Body: aplicationConfig?.getToStringJSON(),
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

  const RegisterImg = async (values: ImgEntity) => {
    try {
      closeDialog("imgApp");

      const urlImg: string = await new ConfigUseCase().SetImg(
        await compressImage(values.Img),
        GetGlobalCryptRoutes("Aplications"),
        itemSelected?.Ref ?? ""
      );

      const app = aplicationConfig.get(itemSelected?.Ref ?? "");
      if (app !== null) {
        const itemApp = new ListObject<ObjetcEntity>(app.ItemValues);
        itemApp.addUnique({ Value: urlImg, Name: "PhotoURL" }, "Name");
        app.ItemValues = itemApp.getAll();
        aplicationConfig.edit(itemSelected?.Ref ?? "", app);
      }

      items.editBy("Id", name, {
        Id: name,
        Body: aplicationConfig?.getToStringJSON(),
        Update: true,
      });
      setItems(new ListObject<IConfigApp.NsConfigApp>(items.getAll()));
    } catch (e: any) {
      AlertComponent("error", e.message);
    }
  };

  const RegisterItem = async (values: AplicationEntity) => {
    try {
      const reg = aplicationConfig.add(itemSelected?.Ref ?? "", {
        Value: values.Value,
        Name: values.Name,
        IsVisible:
          aplicationConfig
            .getAllParents(itemSelected?.Ref ?? "")
            .find((x) => x.Value === "Routes") !== undefined,
        IsEnabled: true,
      });

      if (reg.success) {
        if (
          aplicationConfig
            .getAllParents(reg.ref)
            .find((x) => x.Value === "Routes")
        ) {
          aplicationConfig.add(reg.ref, {
            Value: "EndPoints",
            Name: "END-POINTS",
            IsVisible: false,
            IsEnabled: true,
          });
        }

        closeDialog("itemApp");
        if (items.getBy("Id", name) === null) {
          items.add({
            Id: name,
            Body: aplicationConfig?.getToStringJSON(),
            Update: true,
          });
        } else {
          items.editBy("Id", name, {
            Id: name,
            Body: aplicationConfig?.getToStringJSON(),
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

  const RegisterEndPoint = async (values: AplicationEndPointEntity) => {
    try {
      const reg = aplicationConfig.add(itemSelected?.Ref ?? "", {
        Value: values.Value,
        Name: values.Name,
        IsVisible: false,
        IsEnabled: true,
        ItemValues: [{ Value: values.Type ?? "", Name: "TypeMethod" }],
      });

      if (reg.success) {
        closeDialog("itemEndpoint");
        if (items.getBy("Id", name) === null) {
          items.add({
            Id: name,
            Body: aplicationConfig?.getToStringJSON(),
            Update: true,
          });
        } else {
          items.editBy("Id", name, {
            Id: name,
            Body: aplicationConfig?.getToStringJSON(),
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
  // DELETE
  //=======================================================================

  const DeleteItem = async () => {
    closeDialog("delete");
    try {
      const parents = aplicationConfig.getAllParents(itemSelected?.Ref ?? "");

      aplicationConfig?.deleteNode(itemSelected?.Ref ?? "");

      items.editBy("Id", name, {
        Id: name,
        Body: aplicationConfig?.getToStringJSON(),
        Update: true,
      });
      setItems(new ListObject<IConfigApp.NsConfigApp>(items.getAll()));

      if (parents.length === 2) {
        await new ConfigUseCase().DeleteImg(
          GetGlobalCryptRoutes("Aplications"),
          itemSelected?.Ref ?? ""
        );
      }
    } catch (error: any) {
      AlertComponent("error", error?.message);
    }
  };

  //=======================================================================
  // RENDER
  //=======================================================================

  return (
    <>
      <Typography gutterBottom variant="h6" component="div">
        <center style={{ fontWeight: "bold" }}>APLICATIONS</center>
      </Typography>

      <Button
        variant="contained"
        onClick={() => {
          openDialog("aplication");
        }}
        style={{ marginBottom: "10px" }}
        startIcon={<AddBoxIcon />}
      >
        Add
      </Button>

      <SimpleTreeView>
        {aplicationConfig
          .getChilldren("0")
          .map((itemApp: AplicationGetEntity, index: number) => (
            <TreeAplication
              key={index}
              aplicationConfig={aplicationConfig}
              itemApp={itemApp}
              index={index}
              openDialog={openDialog}
              setItemSelected={setItemSelected}
            />
          ))}
      </SimpleTreeView>

      {dialogState["aplication"] && (
        <Dialog
          open={dialogState["aplication"]}
          onClose={() => {
            closeDialog("aplication");
          }}
          maxWidth="xs"
        >
          <DialogTitle>
            <center>ADD APLICATION</center>
          </DialogTitle>
          <DialogContent>
            <FormNewApplication
              defaultValues={formApp}
              onSubmit={RegisterApp}
            />
          </DialogContent>
        </Dialog>
      )}

      {dialogState["imgApp"] && (
        <Dialog
          open={dialogState["imgApp"]}
          onClose={() => {
            closeDialog("imgApp");
          }}
          maxWidth="xs"
        >
          <DialogTitle>
            <center>ADD IMAGE</center>
          </DialogTitle>
          <DialogContent>
            <FormImgApplication
              defaultValues={formImg}
              onSubmit={RegisterImg}
            />
          </DialogContent>
        </Dialog>
      )}

      {dialogState["itemApp"] && (
        <Dialog
          open={dialogState["itemApp"]}
          onClose={() => {
            closeDialog("itemApp");
          }}
          maxWidth="xs"
        >
          <DialogTitle>
            <center>ADD ITEM</center>
          </DialogTitle>
          <DialogContent>
            <FormNewItem defaultValues={formApp} onSubmit={RegisterItem} />
          </DialogContent>
        </Dialog>
      )}

      {dialogState["itemEndpoint"] && (
        <Dialog
          open={dialogState["itemEndpoint"]}
          onClose={() => {
            closeDialog("itemEndpoint");
          }}
          maxWidth="xs"
        >
          <DialogTitle>
            <center>ADD END-POINT</center>
          </DialogTitle>
          <DialogContent>
            <FormNewEndPoint
              defaultValues={formEndPoint}
              onSubmit={RegisterEndPoint}
            />
          </DialogContent>
        </Dialog>
      )}

      {dialogState["delete"] && (
        <Dialog
          open={dialogState["delete"]}
          onClose={() => {
            closeDialog("delete");
          }}
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
              onClick={() => {
                closeDialog("delete");
              }}
              variant="contained"
              color="success"
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => DeleteItem()}
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

const TreeAplication = ({
  aplicationConfig,
  itemApp,
  index,
  openDialog,
  setItemSelected,
}: {
  aplicationConfig: AplicationUseCase;
  itemApp: AplicationGetEntity;
  index: number;
  openDialog: (dialogName: string) => void;
  setItemSelected: React.Dispatch<
    React.SetStateAction<AplicationGetEntity | undefined>
  >;
}) => {
  return (
    <TreeItem
      key={index}
      itemId={itemApp.Ref.toString()}
      label={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
            }}
          >
            {itemApp.Name}
          </span>
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
                event.stopPropagation();

                openDialog("imgApp");
                setItemSelected(itemApp);
              }}
              sx={{ marginRight: "5px" }}
            >
              <InsertPhotoIcon />
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
                event.stopPropagation();

                openDialog("delete");
                setItemSelected(itemApp);
              }}
            >
              <DeleteIcon />
            </Button>
          </Box>
        </div>
      }
      sx={{ userSelect: "none" }}
    >
      <CardBoxAplication itemApp={itemApp} />

      {aplicationConfig
        .getChilldren(itemApp.Ref)
        .map((itemAppChilldren: AplicationGetEntity, index: number) => (
          <TreeItemApp
            key={index}
            aplicationConfig={aplicationConfig}
            itemApp={itemAppChilldren}
            index={index}
            openDialog={openDialog}
            setItemSelected={setItemSelected}
          />
        ))}
    </TreeItem>
  );
};

const CardBoxAplication = ({ itemApp }: { itemApp: AplicationGetEntity }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const photoURL = itemApp.ItemValues?.find(
    (x) => x.Name === "PhotoURL"
  )?.Value;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        marginTop: 1,
        marginBottom: 1,
      }}
    >
      <Paper elevation={3} sx={{ padding: 1, width: "100%" }}>
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          <Grid size={{ xs: 5, sm: 4, md: 3, lg: 2 }}>
            <div
              style={{
                width: "100%",
                paddingBottom: "100%",
                position: "relative",
              }}
            >
              {!isLoaded && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: "absolute",
                    top: "40%",
                    left: "40%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
              <Avatar
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  borderRadius: 2,
                  opacity: isLoaded ? 1 : 0, // Oculta la imagen hasta que esté cargada
                  transition: "opacity 0.3s ease-in-out", // Transición suave
                }}
                alt="Remy Sharp"
                src={photoURL}
                onLoad={() => setIsLoaded(true)} // Marca como cargado
                onError={() => setIsLoaded(false)} // Opcional: manejar errores
              />
            </div>
          </Grid>
          <Grid size={{ xs: 7, sm: 8, md: 9, lg: 10 }}>
            <Typography
              sx={{
                fontSize: {
                  xs: "10px",
                  sm: "12px",
                  md: "14px",
                },
                margin: 0,
              }}
            >
              {itemApp.Value}
            </Typography>
            <hr style={{ margin: "4px 0", border: "1px solid #ccc" }} />
            <Typography
              sx={{
                fontSize: {
                  xs: "10px",
                  sm: "12px",
                  md: "14px",
                },
                margin: 0,
              }}
            >
              {itemApp.Description}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

const TreeItemApp = ({
  aplicationConfig,
  itemApp,
  index,
  openDialog,
  setItemSelected,
}: {
  aplicationConfig: AplicationUseCase;
  itemApp: AplicationGetEntity;
  index: number;
  openDialog: (dialogName: string) => void;
  setItemSelected: React.Dispatch<
    React.SetStateAction<AplicationGetEntity | undefined>
  >;
}) => {
  return (
    <TreeItem
      key={index}
      itemId={itemApp.Ref.toString()}
      label={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
            }}
          >
            {"• " + itemApp.Name}
          </span>
          <Box display="flex" justifyContent="flex-end">
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

                openDialog("itemApp");
                setItemSelected(itemApp);
              }}
              sx={{ marginRight: "5px" }}
            >
              <AddBoxIcon />
            </Button>
          </Box>
        </div>
      }
      sx={{ userSelect: "none" }}
    >
      {itemApp.Value === "Routes" &&
        aplicationConfig
          .getChilldren(itemApp.Ref)
          .map((itemRoute: AplicationGetEntity, index: number) => (
            <TreeItemAppRoutes
              key={index}
              aplicationConfig={aplicationConfig}
              itemApp={itemRoute}
              index={index}
              openDialog={openDialog}
              setItemSelected={setItemSelected}
            />
          ))}

      {itemApp.Value === "Domains" && (
        <TreeItemAppDomain
          key={index}
          aplicationConfig={aplicationConfig}
          itemApp={itemApp}
          openDialog={openDialog}
          setItemSelected={setItemSelected}
        />
      )}
    </TreeItem>
  );
};

const TreeItemAppDomain = ({
  aplicationConfig,
  itemApp,
  openDialog,
  setItemSelected,
}: {
  aplicationConfig: AplicationUseCase;
  itemApp: AplicationGetEntity;
  openDialog: (dialogName: string) => void;
  setItemSelected: React.Dispatch<
    React.SetStateAction<AplicationGetEntity | undefined>
  >;
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ marginBottom: "25px", marginTop: "5px" }}
    >
      <Table sx={{ minWidth: 350 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>URL</TableCell>
            <TableCell>NAME</TableCell>
            <TableCell>ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {aplicationConfig
            .getChilldren(itemApp.Ref ?? "")
            .map((rowDomain, indexItem: number) => (
              <TableRow
                key={indexItem}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell component="th" scope="row" width={150}>
                  <a href={rowDomain.Value}>{rowDomain.Value}</a>
                </TableCell>
                <TableCell align="left" width={150}>
                  {rowDomain.Name}
                </TableCell>
                <TableCell align="left" width={150}>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    style={{
                      marginLeft: "auto",
                      minWidth: "0",
                      padding: "6px",
                    }}
                    onClick={() => {
                      setItemSelected(rowDomain);

                      openDialog("delete");
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
  );
};

const TreeItemAppRoutes = ({
  aplicationConfig,
  itemApp,
  index,
  openDialog,
  setItemSelected,
}: {
  aplicationConfig: AplicationUseCase;
  itemApp: AplicationGetEntity;
  index: number;
  openDialog: (dialogName: string) => void;
  setItemSelected: React.Dispatch<
    React.SetStateAction<AplicationGetEntity | undefined>
  >;
}) => {
  return (
    <TreeItem
      key={index}
      itemId={itemApp.Ref.toString()}
      label={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {itemApp.Value !== "EndPoints" && (
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              {"❖ " + itemApp.Name}
            </span>
          )}
          {itemApp.Value === "EndPoints" && (
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              {"• " + itemApp.Name}
            </span>
          )}

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              size="small"
              color="info"
              style={{
                marginLeft: "auto",
                minWidth: "0",
                padding: "6px",
              }}
              onClick={(event) => {
                event.stopPropagation();
                if (itemApp.Value === "EndPoints") {
                  openDialog("itemEndpoint");
                } else {
                  openDialog("itemApp");
                }
                setItemSelected(itemApp);
              }}
              sx={{ marginRight: "5px" }}
            >
              <AddBoxIcon />
            </Button>
            {itemApp.Value !== "EndPoints" && (
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
                  event.stopPropagation();

                  openDialog("delete");
                  setItemSelected(itemApp);
                }}
              >
                <DeleteIcon />
              </Button>
            )}
          </Box>
        </div>
      }
      sx={{ userSelect: "none" }}
    >
      {itemApp.Value !== "EndPoints" &&
        aplicationConfig
          .getChilldren(itemApp.Ref)
          .map((itemRoute: AplicationGetEntity, index: number) => (
            <TreeItemAppRoutes
              key={index}
              aplicationConfig={aplicationConfig}
              itemApp={itemRoute}
              index={index}
              openDialog={openDialog}
              setItemSelected={setItemSelected}
            />
          ))}

      {itemApp.Value === "EndPoints" && (
        <TreeItemAppEndPoint
          key={index}
          aplicationConfig={aplicationConfig}
          itemApp={itemApp}
          openDialog={openDialog}
          setItemSelected={setItemSelected}
        />
      )}
    </TreeItem>
  );
};

const TreeItemAppEndPoint = ({
  aplicationConfig,
  itemApp,
  openDialog,
  setItemSelected,
}: {
  aplicationConfig: AplicationUseCase;
  itemApp: AplicationGetEntity;
  openDialog: (dialogName: string) => void;
  setItemSelected: React.Dispatch<
    React.SetStateAction<AplicationGetEntity | undefined>
  >;
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ marginBottom: "25px", marginTop: "5px" }}
    >
      <Table sx={{ minWidth: 350 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>METHOD</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>NAME</TableCell>
            <TableCell>ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {aplicationConfig
            .getChilldren(itemApp.Ref ?? "")
            .map((rowDomain, indexItem: number) => (
              <TableRow
                key={indexItem}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell align="left" width={60}>
                  {
                    rowDomain.ItemValues?.find((x) => x.Name === "TypeMethod")
                      ?.Value
                  }
                </TableCell>
                <TableCell component="th" scope="row" width={150}>
                  <a href={rowDomain.Value}>{rowDomain.Value}</a>
                </TableCell>
                <TableCell align="left" width={100}>
                  {rowDomain.Name}
                </TableCell>
                <TableCell align="left" width={30}>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    style={{
                      marginLeft: "auto",
                      minWidth: "0",
                      padding: "6px",
                    }}
                    onClick={() => {
                      setItemSelected(rowDomain);

                      openDialog("delete");
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
  );
};
