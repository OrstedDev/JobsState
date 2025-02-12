import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Paper from "@mui/material/Paper";
import UnfoldMoreDoubleIcon from "@mui/icons-material/UnfoldMoreDouble";
import UnfoldLessDoubleIcon from "@mui/icons-material/UnfoldLessDouble";
import { Crypt0 } from "../../../UtilitiesLayer/Library/C1p70";
import { useTheme } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

import Routers from "../Routes";
import { AplicationGetEntity } from "../../../DomainLayer/Models/Aplication/Modules/Internal/Configuration/AplicationEntity";
import AplicationUseCase from "../../../DataLayer/UseCases/Aplications/Internal/Configuration/AplicationUseCase";
import { MenuUser } from "../../../DataLayer/UseCases/Aplications/Internal/Initialize/InitData";
import { useGlobalContext } from "../../../Global";

const FireNav = styled(List)({
  "& .MuiListItemButton-root": {
    paddingLeft: 24,
    paddingRight: 24,
  },
  "& .MuiListItemIcon-root": {
    minWidth: 0,
    marginRight: 16,
  },
  "& .MuiSvgIcon-root": {
    fontSize: 20,
  },
});

export const AssideDashBoard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { state } = useGlobalContext();
  const [aplicationConfig, setAplicationConfig] = useState<AplicationUseCase>(
    new AplicationUseCase()
  );

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [allItems, setAllItems] = useState<Array<string>>([]);
  const [assideState, setAssideState] = useState({
    left: false,
  });

  const toggleDrawer = (anchor: any, openApp: any) => (event: any) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setAssideState({ ...assideState, [anchor]: openApp });
  };

  const handleExpandedItemsChange = (
    event: React.SyntheticEvent,
    itemIds: string[]
  ) => {
    setExpandedItems(itemIds);
  };

  const handleExpandClick = () => {
    setExpandedItems((oldExpanded) =>
      oldExpanded.length === 0 ? allItems : []
    );
  };

  useEffect(() => {
    setAplicationConfig(MenuUser);
    setAllItems(MenuUser.getAllMapNodes().map((x): string => x.key));
    setExpandedItems(MenuUser.getAllMapNodes().map((x): string => x.key));
  }, [state?.initDate]);

  return (
    <>
      <IconButton
        onClick={toggleDrawer("left", true)}
        size="large"
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor={"left"}
        open={assideState["left"]}
        onClose={toggleDrawer("left", false)}
      >
        <Box
          sx={{
            display: "flex",
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? blueGrey[100] : "#022830",
            flexGrow: 1,
            height: "100%",
            overflow: "auto",
          }}
        >
          <Paper elevation={0} sx={{ maxWidth: 256 }}>
            <FireNav disablePadding>
              <ListItemButton component="a" sx={{ fontWeight: "bold" }}>
                <ListItemIcon
                  sx={{ fontSize: 21 }}
                  onClick={(e) => {
                    navigate("/");
                    toggleDrawer("left", false)(e);
                  }}
                >
                  🔥 ORSTED DEV
                </ListItemIcon>
              </ListItemButton>

              <Divider sx={{ borderWidth: "1px" }} />

              <ListItem component="div" disablePadding>
                <ListItemButton
                  sx={{
                    height: 40,
                    fontWeight: "bold",
                    color:
                      theme.palette.mode === "light" ? "grey.700" : "white",
                  }}
                  onClick={handleExpandClick}
                >
                  <ListItemIcon>
                    {expandedItems.length === 0 ? (
                      <UnfoldMoreDoubleIcon />
                    ) : (
                      <UnfoldLessDoubleIcon />
                    )}
                  </ListItemIcon>
                  {expandedItems.length === 0 ? "EXPAND ALL" : "COLLAPSE ALL"}
                </ListItemButton>
              </ListItem>

              <Divider sx={{ borderWidth: "1px", marginBottom: "10px" }} />

              <Box
                sx={{
                  minHeight: 352,
                  minWidth: 250,
                  color: theme.palette.mode === "light" ? "grey.700" : "white",
                }}
              >
                <SimpleTreeView
                  expandedItems={expandedItems}
                  onExpandedItemsChange={handleExpandedItemsChange}
                >
                  {aplicationConfig
                    .getChilldren("0")
                    .map((item: AplicationGetEntity) => (
                      <TreeItem
                        key={item.Ref}
                        itemId={item.Ref}
                        label={
                          <span style={{ fontWeight: "bold" }}>
                            {item.Name}
                          </span>
                        }
                        sx={{ userSelect: "none" }}
                      >
                        <RoutesTree
                          aplicationConfig={aplicationConfig}
                          ref={
                            aplicationConfig
                              .getChilldren(item.Ref)
                              .find((x) => x.Value === "Routes")?.Ref ?? ""
                          }
                          toggleDrawer={toggleDrawer}
                        />
                      </TreeItem>
                    ))}
                </SimpleTreeView>
              </Box>
            </FireNav>
          </Paper>
        </Box>
      </Drawer>
    </>
  );
};

const RoutesTree = ({
  aplicationConfig,
  ref,
  toggleDrawer,
}: {
  aplicationConfig: AplicationUseCase;
  ref: string;
  toggleDrawer: (anchor: any, openApp: any) => (event: any) => void;
}) => {
  return (
    <>
      {aplicationConfig.getChilldren(ref).map((item: AplicationGetEntity) => (
        <TreeItem
          key={item.Ref}
          itemId={item.Ref}
          label={
            aplicationConfig.getChilldren(item.Ref).length === 0 ? (
              <Link
                to={aplicationConfig
                  .getAllParents(item.Ref)
                  .filter((x) => x.Key !== "0" && x.Value !== "Routes")
                  .map((item): any => item.Value)
                  .join("")}
                onClick={toggleDrawer("left", false)}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "3px",
                    marginLeft: "-20px",
                  }}
                >
                  {
                    Routers.getBy(
                      "Key",
                      Crypt0.C1pt0(
                        aplicationConfig
                          .getAllParents(item.Ref)
                          .filter((x) => x.Key !== "0" && x.Value !== "Routes")
                          .map((item): any => item.Value)
                          .join("")
                      )
                    )?.Icon
                  }
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {item.Name}
                  </span>
                </div>
              </Link>
            ) : (
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                {item.Name}
              </span>
            )
          }
          sx={{ userSelect: "none" }}
        >
          {aplicationConfig.getChilldren(item.Ref).length !== 0 && (
            <RoutesTree
              aplicationConfig={aplicationConfig}
              ref={item.Ref}
              toggleDrawer={toggleDrawer}
            />
          )}
        </TreeItem>
      ))}
    </>
  );
};
