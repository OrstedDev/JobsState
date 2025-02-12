import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import JsonView from "@uiw/react-json-view";
import { lightTheme } from "@uiw/react-json-view/light";
import { nordTheme } from "@uiw/react-json-view/nord";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

import AlertComponent from "../../../../GenericComponents/Alerts/AlertComponent";
import { useGlobalContext } from "../../../../../Global";
import { IConfigApp } from "../../../../../DomainLayer/Interfaces/Aplication/IConfig";
import ListObject from "../../../../../UtilitiesLayer/Structures/ListObject";
import FileHandler from "../../../../../UtilitiesLayer/Library/FileHandler";

export default function SyncConfig({
  items,
  setItems,
}: {
  items: ListObject<IConfigApp.NsConfigApp>;
  setItems: any;
}) {
  const { state } = useGlobalContext();

  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  //=======================================================================
  // EXPAND
  //=======================================================================

  const handleExpandedItemsChange = (
    event: React.SyntheticEvent,
    itemIds: string[]
  ) => {
    setExpandedItems(itemIds);
  };

  const ExpandClick = () => {
    setExpandedItems((oldExpanded) =>
      oldExpanded.length === 0 ? ["Backup", "Restore"] : []
    );
  };

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

  return (
    <Stack spacing={2}>
      <div>
        <Button onClick={ExpandClick}>
          {expandedItems.length === 0 ? "Expand all" : "Collapse all"}
        </Button>
      </div>
      <SimpleTreeView
        expandedItems={expandedItems}
        onExpandedItemsChange={handleExpandedItemsChange}
      >
        <TreeItem
          itemId="Backup"
          label="BACKUP"
          sx={{ userSelect: "none", mb: 1 }}
        >
          <div style={{ marginTop: 5 }}>
            <JsonView
              value={
                items.getAll().map((item: IConfigApp.NsConfigApp) => ({
                  ...item,
                  Update: true,
                })) ?? []
              }
              style={state.mode === "light" ? lightTheme : nordTheme}
            />
            <Button
              fullWidth
              sx={{ mt: 1 }}
              color="error"
              variant="contained"
              onClick={() => {
                FileHandler.exportFile(
                  JSON.stringify(
                    items.getAll().map((item: IConfigApp.NsConfigApp) => ({
                      ...item,
                      Update: true,
                    })) ?? []
                  ),
                  "AppConfig" +
                    format(new Date(), "_yyyy-MM-dd_HHmmss") +
                    ".json",
                  "application/json"
                );
              }}
              endIcon={<CloudDownloadIcon />}
            >
              DOWNLOAD
            </Button>
          </div>
        </TreeItem>
        <TreeItem
          itemId="Restore"
          label="RESTORE"
          sx={{ userSelect: "none", paddingBottom: "15px" }}
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
        </TreeItem>
      </SimpleTreeView>
    </Stack>
  );
}
