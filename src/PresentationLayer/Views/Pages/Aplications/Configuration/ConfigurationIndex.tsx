import React, { useEffect, useState, lazy } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import { ConfigUseCase } from "../../../../../DataLayer/UseCases/Configuration/ConfigUseCase";
import AlertComponent from "../../../../GenericComponents/Alerts/AlertComponent";
import CryptoConfigItems from "./Crypto/CryptoConfigItems";
import PrivilegesConfigItems from "./Privileges/PrivilegesConfigItems";
import SyncConfig from "./SyncConfig";
import CatalogsConfig from "./CatalogsConfig";
import AplicationsConfig from "./Aplications/AplicationsConfig";
import ListObject from "../../../../../UtilitiesLayer/Structures/ListObject";
import { IConfigApp } from "../../../../../DomainLayer/Interfaces/Aplication/IConfig";

export default function ConfigurationIndex() {
  const [idTab, setIdTab] = useState(0);
  const [items, setItems] = useState<ListObject<IConfigApp.NsConfigApp>>(
    new ListObject<IConfigApp.NsConfigApp>()
  );

  const ChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setIdTab(newValue);
  };

  //=======================================================================
  // CARGAR DATA TABLE INICIAL
  //=======================================================================

  const Load = async () => {
    try {
      const response = await new ConfigUseCase().Get();
      if (response?.success) {
        setItems(new ListObject<IConfigApp.NsConfigApp>(response?.data ?? []));
      } else {
        AlertComponent("error", response?.message);
      }
    } catch (error: any) {
      AlertComponent("error", error.message);
    }
  };

  useEffect(() => {
    if (items.getAll().length === 0) {
      Load();
    }
  }, []);

  //=======================================================================
  // ACTUALIZAR CONFIG
  //=======================================================================

  const Update = async () => {
    try {
      const response = await new ConfigUseCase().Set(items.getAll());

      setItems(
        new ListObject<IConfigApp.NsConfigApp>(
          items.getAll().map((item) => ({
            ...item,
            Update: false,
          }))
        )
      );

      if (!response?.success) {
        AlertComponent("error", response?.message);
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

  //=======================================================================
  // RENDER
  //=======================================================================

  return (
    <>
      <Container sx={{ mt: 4, mb: 4 }} maxWidth="md">
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            width: "100%",
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={idTab}
              onChange={ChangeTab}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              aria-label="scrollable auto tabs example"
            >
              <Tab label="CRYPTO" {...a11yProps(0)} />
              <Tab label="CATALOGS" {...a11yProps(1)} />
              <Tab label="APLICATIONS" {...a11yProps(2)} />
              <Tab label="PRIVILEGES" {...a11yProps(3)} />
              <Tab label="BACKUP & RESTORE" {...a11yProps(4)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={idTab} index={0}>
            <CryptoConfigItems
              items={items}
              setItems={setItems}
              // Update={Update}
            ></CryptoConfigItems>
          </CustomTabPanel>
          <CustomTabPanel value={idTab} index={1}>
            <CatalogsConfig
              name={"Catalogs"}
              items={items}
              setItems={setItems}
              // Update={Update}
            />
          </CustomTabPanel>
          <CustomTabPanel value={idTab} index={2}>
            <AplicationsConfig
              name={"Aplications"}
              items={items}
              setItems={setItems}
              // Update={Update}
            />
          </CustomTabPanel>
          <CustomTabPanel value={idTab} index={3}>
            <PrivilegesConfigItems
              items={items}
              setItems={setItems}
              // Update={Update}
            ></PrivilegesConfigItems>
          </CustomTabPanel>
          <CustomTabPanel value={idTab} index={4}>
            <SyncConfig
              items={items}
              setItems={setItems} //Update={Update}
            />
          </CustomTabPanel>
        </Paper>
      </Container>
    </>
  );
}

function CustomTabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
