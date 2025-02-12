import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import PrivilegesProfile from "./PrivilegesProfile";
import PrivilegesUser from "./PrivilegesUser";
import UserUseCase from "../../../../../../../DataLayer/UseCases/Aplications/Internal/User/UserUseCase";
import { IUser } from "../../../../../../../DomainLayer/Interfaces/Aplication/Internal/IUser";
import AlertComponent from "../../../../../../GenericComponents/Alerts/AlertComponent";

export default function PrivilegesConfigItems(props: any) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [rowsUser, setRowsUsers] = useState<Array<IUser.NsUserEntity>>([]);

  const handleExpandedItemsChange = (
    event: React.SyntheticEvent,
    itemIds: string[]
  ) => {
    setExpandedItems(itemIds);
  };

  const handleExpandClick = () => {
    setExpandedItems((oldExpanded) =>
      oldExpanded.length === 0 ? ["PrivilegesProfile", "PrivilegesUser"] : []
    );
  };

  const LoadUsers = async () => {
    try {
      const response = await new UserUseCase().getAllUsers();
      if (response?.success) {
        setRowsUsers(response.data ?? []);
      } else {
        AlertComponent("error", response?.message);
      }
    } catch (error: any) {
      AlertComponent("error", error.message);
    }
  };

  useEffect(() => {
    LoadUsers();
  }, []);

  return (
    <Stack spacing={2}>
      <div>
        <Button onClick={handleExpandClick}>
          {expandedItems.length === 0 ? "Expand all" : "Collapse all"}
        </Button>
      </div>
      <Box sx={{ minWidth: 250 }}>
        <SimpleTreeView
          expandedItems={expandedItems}
          onExpandedItemsChange={handleExpandedItemsChange}
        >
          <TreeItem
            itemId="PrivilegesProfile"
            label="PRIVILEGES FOR PROFILE"
            sx={{ userSelect: "none", paddingBottom: "15px" }}
          >
            <PrivilegesProfile
              name={"PrivilegesProfile"}
              items={props.items}
              setItems={props.setItems}
              Update={props.Update}
            />
          </TreeItem>
          <TreeItem
            itemId="PrivilegesUser"
            label="PRIVILEGES FOR USER"
            sx={{ userSelect: "none", paddingBottom: "15px" }}
          >
            <PrivilegesUser users={rowsUser} items={props.items} setRowsUsers={setRowsUsers}/>
          </TreeItem>
        </SimpleTreeView>
      </Box>
    </Stack>
  );
}
