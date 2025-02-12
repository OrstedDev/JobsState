import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

import CryptoConfig from "./CryptoConfig";

export default function CryptoConfigItems(props: any) {
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const handleExpandedItemsChange = (
    event: React.SyntheticEvent,
    itemIds: string[]
  ) => {
    setExpandedItems(itemIds);
  };

  const handleExpandClick = () => {
    setExpandedItems((oldExpanded) =>
      oldExpanded.length === 0
        ? ["CryptCollect", "CryptKeys", "CryptRoutes", "CryptStoragName"]
        : []
    );
  };

  return (
    <Stack spacing={2}>
      <div>
        <Button onClick={handleExpandClick}>
          {expandedItems.length === 0 ? "Expand all" : "Collapse all"}
        </Button>
      </div>
      <SimpleTreeView
        expandedItems={expandedItems}
        onExpandedItemsChange={handleExpandedItemsChange}
      >
        <TreeItem
          itemId="CryptCollect"
          label="COLLECTIONS DATABASE"
          sx={{ userSelect: "none" }}
        >
          <CryptoConfig
            name={"CryptCollect"}
            items={props.items}
            setItems={props.setItems}
          />
        </TreeItem>
        <TreeItem
          itemId="CryptKeys"
          label="KEYS APLICATION"
          sx={{ userSelect: "none" }}
        >
          <CryptoConfig
            name={"CryptKeys"}
            items={props.items}
            setItems={props.setItems}
          />
        </TreeItem>
        <TreeItem
          itemId="CryptRoutes"
          label="ROUTES STORAGE"
          sx={{ userSelect: "none" }}
        >
          <CryptoConfig
            name={"CryptRoutes"}
            items={props.items}
            setItems={props.setItems}
          />
        </TreeItem>
        <TreeItem
          itemId="CryptStoragName"
          label="ROUTES NAMES"
          sx={{ userSelect: "none" }}
        >
          <CryptoConfig
            name={"CryptStoragName"}
            items={props.items}
            setItems={props.setItems}
          />
        </TreeItem>
      </SimpleTreeView>
    </Stack>
  );
}
