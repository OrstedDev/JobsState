import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import JsonView from "@uiw/react-json-view";
import { lightTheme } from "@uiw/react-json-view/light";
import { nordTheme } from "@uiw/react-json-view/nord";

import AlertComponent from "../../../../GenericComponents/Alerts/AlertComponent";
import { ConfigUseCase } from "../../../../../DataLayer/UseCases/Configuration/ConfigUseCase";
import { useGlobalContext } from "../../../../../Global";
import { IConfigApp } from "../../../../../DomainLayer/Interfaces/Aplication/IConfig";
import ListObject from "../../../../../UtilitiesLayer/Structures/ListObject";
import FileHandler from "../../../../../UtilitiesLayer/Library/FileHandler";

export default function RestoreConfig() {
  const { state } = useGlobalContext();

  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const [items, setItems] = useState<ListObject<IConfigApp.NsConfigApp>>(
    new ListObject<IConfigApp.NsConfigApp>()
  );

  //=======================================================================
  // IMPORT
  //=======================================================================

  const ImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setFileName(file.name);
      FileHandler.importFile(file, (content: string) => {
        setFileContent(content);
      });
    }
  };

  //=======================================================================
  // LOAD
  //=======================================================================

  const Load = async () => {
    try {
      setItems(
        new ListObject<IConfigApp.NsConfigApp>(JSON.parse(fileContent ?? ""))
      );
    } catch (e: any) {
      AlertComponent("error", e.message);
    }
  };

  //=======================================================================
  // ACTUALIZAR CONFIG
  //=======================================================================

  const Update = async () => {
    try {
      const response = await new ConfigUseCase().Set(items.getAll());

      if (!response?.success) {
        AlertComponent("error", "Sin privilegios.");
      } else {
        AlertComponent(
          "success",
          "Actualizado. Por favor, inicie sesión nuevamente."
        );
      }
    } catch (error: any) {
      AlertComponent("error", error.message);
    }
  };

  useEffect(() => {
    if (
      items.getAll().length !== 0 &&
      items.getAll().filter((x) => x.Update === true).length !== 0
    ) {
      Update();
    }
  }, [items]);

  return (
    <Container sx={{ mt: 4, mb: 4 }} maxWidth="md">
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          width: "100%",
          minHeight: "200px",
        }}
      >
        <Button
          fullWidth
          sx={{ mt: 1 }}
          color="primary"
          variant="contained"
          endIcon={<SystemUpdateAltIcon />}
        >
          IMPORT
          <input
            type="file"
            onChange={ImportFile}
            style={{
              opacity: 0,
              position: "absolute",
              zIndex: 2,
              width: "100%",
              height: "100%",
            }}
          />
        </Button>
        {fileName && (
          <p style={{ marginLeft: 10 }}>Archivo seleccionado: {fileName}</p>
        )}

        {fileContent && (
          <>
            <JsonView
              value={JSON.parse(fileContent)}
              style={state.mode === "light" ? lightTheme : nordTheme}
            />
            <Button
              fullWidth
              sx={{ mt: 1 }}
              color="error"
              variant="contained"
              onClick={Load}
              endIcon={<CloudUploadIcon />}
            >
              LOAD IN DATA BASE
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
}
