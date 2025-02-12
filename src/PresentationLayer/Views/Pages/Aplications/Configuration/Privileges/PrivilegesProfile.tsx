import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import { InputLabel, FormControl, FormHelperText } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import Checkbox from "@mui/material/Checkbox";
import ListObject from "../../../../../../UtilitiesLayer/Structures/ListObject";
import { IConfigApp } from "../../../../../../DomainLayer/Interfaces/Aplication/IConfig";
import AplicationUseCase from "../../../../../../DataLayer/UseCases/Configuration/AplicationUseCase";
import AlertComponent from "../../../../../GenericComponents/Alerts/AlertComponent";
import { Crypt0 } from "../../../../../../UtilitiesLayer/Library/C1p70";

import PrivilegesUseCase from "../../../../../../DataLayer/UseCases/Configuration/PrivilegesUseCase";

import TreeObject, {
  TreeNode,
} from "../../../../../../UtilitiesLayer/Structures/TreeObject";

import {
  GetGlobalCatalogName,
  GetGlobalCatalogItems,
} from "../../../../../../DataLayer/UseCases/Initialize/InitData";

interface TreeNodeProps {
  node: TreeNode<{ id: string; label: string }>;
  selectedNodes: string[];
  handleToggle: (nodeId: string, childIds: string[]) => void;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({
  node,
  selectedNodes,
  handleToggle,
}) => {
  const { value, children } = node;
  const { id, label } = value;

  const isChecked = selectedNodes.includes(id);
  const areAllChildrenSelected =
    children?.every((child) => selectedNodes.includes(child.value.id)) || false;

  const handleCheck = () => {
    let allChildrens: Array<string> = [];

    function getChilldren(children: TreeNode<{ id: string; label: string }>[]) {
      children.forEach((x) => {
        allChildrens.push(...children.map((child) => child.value.id));
        const childNodes = x.getChildren();
        if (childNodes) {
          getChilldren(childNodes);
        }
      });
    }

    getChilldren(children);

    handleToggle(id, allChildrens);
  };

  return (
    <TreeItem
      itemId={id}
      label={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {isChecked && (
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              <b>{"• " + label}</b>
            </span>
          )}
          {!isChecked && <span>{label}</span>}
          <Checkbox
            checked={isChecked || areAllChildrenSelected}
            indeterminate={!isChecked && areAllChildrenSelected}
            onClick={(e) => {
              e.stopPropagation();
              handleCheck();
            }}
          />
        </div>
      }
      sx={{ userSelect: "none" }}
    >
      {children &&
        children.map((child) => (
          <TreeNodeComponent
            key={child.value.id}
            node={child}
            selectedNodes={selectedNodes}
            handleToggle={handleToggle}
          />
        ))}
    </TreeItem>
  );
};

const PrivilegesProfile = ({
  name,
  items,
  setItems,
  Update,
}: {
  name: string;
  items: ListObject<IConfigApp.NsConfigApp>;
  setItems: any;
  Update: any;
}) => {
  const [treeViewed, setTreeViewed] = useState<
    TreeObject<{ id: string; label: string }>
  >(
    new TreeObject<{ id: string; label: string }>("0", {
      id: "0",
      label: "APLICATIONS",
    })
  );
  const [aplicationConfig, setAplicationConfig] = useState<AplicationUseCase>(
    new AplicationUseCase()
  );

  const [privilegesConfig, setPrivilegesConfig] = useState<PrivilegesUseCase>(
    new PrivilegesUseCase()
  );

  const [profileSelected, setProfileSelected] = useState<string>("0");
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  const handleToggle = (nodeId: string, childIds: string[]) => {
    setSelectedNodes((prev) => {
      if (prev.includes(nodeId)) {
        return prev.filter((id) => id !== nodeId && !childIds.includes(id));
      } else {
        return [...new Set([...prev, nodeId, ...childIds])];
      }
    });
  };

  useEffect(() => {
    setAplicationConfig(
      new AplicationUseCase(items.getBy("Id", "Aplications")?.Body)
    );

    setPrivilegesConfig(new PrivilegesUseCase(items.getBy("Id", name)?.Body));
  }, [items]);

  useEffect(() => {
    GetAplications();
  }, [aplicationConfig]);

  useEffect(() => {
    if (profileSelected !== "0") {
      privilegesConfig.add({
        Key: profileSelected,
        Value: selectedNodes.filter(x => aplicationConfig.exist(x)),
      });
    }
  }, [selectedNodes]);

  const renderTreeNodes = (node: TreeNode<{ id: string; label: string }>) => (
    <TreeNodeComponent
      key={node.value.id}
      node={node}
      selectedNodes={selectedNodes}
      handleToggle={handleToggle}
    />
  );

  const GetAplications = async () => {
    try {
      const tree = new TreeObject<{ id: string; label: string }>("0", {
        id: "0",
        label: "APLICATIONS",
      });

      const getApps = (item: string) => {
        aplicationConfig.getChilldren(item).forEach((app) => {
          tree.addNode(
            app.Ref.split(":").slice(0, -1).join(":"),
            app.Ref ?? "",
            { id: app.Ref ?? "", label: app?.Name ?? "" }
          );

          recursive(
            aplicationConfig
              .getChilldren(app.Ref)
              .find((x) => x.Value === "Routes")?.Ref ?? "",
            app.Ref ?? ""
          );
        });
      };

      const recursive = (item: string, parent: string) => {
        aplicationConfig.getChilldren(item).forEach((routes) => {
          if (routes.IsVisible) {
            tree.addNode(parent, routes.Ref ?? "", {
              id: routes.Ref ?? "",
              label: routes?.Name ?? "",
            });
          }
          recursive(routes.Ref, routes.Ref);
        });
      };

      getApps("0");
      setTreeViewed(tree);
    } catch (error: any) {
      AlertComponent("error", error?.message);
    }
  };

  const RegisterItem = async () => {
    try {
      if (items.getBy("Id", name) === null) {
        items.add({
          Id: name,
          Body: privilegesConfig?.getToStringJSON(),
          Update: true,
        });
      } else {
        items.editBy("Id", name, {
          Id: name,
          Body: privilegesConfig?.getToStringJSON(),
          Update: true,
        });
      }

      setItems(new ListObject<IConfigApp.NsConfigApp>(items.getAll()));
      Update();

      AlertComponent("success", "Satisfactorio!");
    } catch (e: any) {
      AlertComponent("error", e.message);
    }
  };

  return (
    <>
      <FormControl fullWidth variant="standard">
        <InputLabel htmlFor="Type">Metodo</InputLabel>
        <Select
          fullWidth
          id="Type"
          name="Type"
          value={profileSelected}
          onChange={(e) => {
            setProfileSelected(e.target.value);
            setSelectedNodes(privilegesConfig.get(e.target.value)?.Value ?? []);
          }}
        >
          {GetGlobalCatalogItems(GetGlobalCatalogName("PerfilUsuario")).map(
            (x) => (
              <MenuItem key={x.Key} value={x.Key}>
                {Crypt0.DC1pt0(x.Value ?? "")}
              </MenuItem>
            )
          )}
          <MenuItem value={"0"}>Ninguno</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <SimpleTreeView>{renderTreeNodes(treeViewed.getRoot())}</SimpleTreeView>
      </Box>

      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={RegisterItem}
        startIcon={<SaveIcon />}
      >
        Save
      </Button>
    </>
  );
};

export default PrivilegesProfile;
