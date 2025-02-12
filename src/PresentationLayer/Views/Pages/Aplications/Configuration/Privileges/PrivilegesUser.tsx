import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import EditIcon from "@mui/icons-material/Edit";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import {
  InputLabel,
  FormControl,
  Box,
  Typography,
  Checkbox,
} from "@mui/material";

import AlertComponent from "../../../../../GenericComponents/Alerts/AlertComponent";
import GenDataTable from "../../../../../GenericComponents/DataTable/GenDataTable";
import AplicationUseCase from "../../../../../../DataLayer/UseCases/Configuration/AplicationUseCase";
import ListObject from "../../../../../../UtilitiesLayer/Structures/ListObject";
import { IConfigApp } from "../../../../../../DomainLayer/Interfaces/Aplication/IConfig";
import { UserEntity } from "../../../../../../DomainLayer/Models/Aplication/Modules/User/UserEntity";
import { Crypt0 } from "../../../../../../UtilitiesLayer/Library/C1p70";

import { IUser } from "../../../../../../DomainLayer/Interfaces/Aplication/IUser";
import UserUseCase from "../../../../../../DataLayer/UseCases/User/UserUseCase";

import {
  GetGlobalCatalogName,
  GetGlobalCatalogItems,
} from "../../../../../../DataLayer/UseCases/Initialize/InitData";

type TablaCryptoEntity = {
  Actions: any;
  Email: string;
  NickName: string;
  ProfileId: string;
  Active: string;
};

export default function PrivilegesUser({
  users,
  items,
  setRowsUsers,
}: {
  users: Array<IUser.NsUserEntity>;
  items: ListObject<IConfigApp.NsConfigApp>;
  setRowsUsers: React.Dispatch<React.SetStateAction<Array<IUser.NsUserEntity>>>;
}) {
  //=======================================================================
  // STATES
  //=======================================================================

  const [aplicationConfig, setAplicationConfig] = useState<AplicationUseCase>(
    new AplicationUseCase()
  );
  const [itemSelected, setItemSelected] = useState<IUser.NsUserEntity>();
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [rowsDataTable, setRowsDatatable] = useState<Array<TablaCryptoEntity>>(
    []
  );

  useEffect(() => {
    setAplicationConfig(
      new AplicationUseCase(items.getBy("Id", "Aplications")?.Body)
    );
  }, [items]);

  //=======================================================================
  //CARGAR DATA TABLE INICIAL
  //=======================================================================

  const LoadUsers = async () => {
    try {
      const rows: Array<TablaCryptoEntity> = [];
      users.forEach((items: UserEntity) => {
        rows.push({
          Actions: (
            <>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    color: "white",
                    background: "green",
                    borderRadius: "5px",
                    padding: "3px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setOpenFormDialog(true);
                    setItemSelected(items);
                  }}
                >
                  <EditIcon />
                </div>
              </div>
            </>
          ),
          Email: items?.Email,
          NickName: items?.NickName,
          ProfileId: Crypt0.DC1pt0(
            GetGlobalCatalogItems(GetGlobalCatalogName("PerfilUsuario")).find(
              (x) => x.Key === items?.ProfileId
            )?.Value ?? ""
          ),
          Active: items?.Active ? "SI" : "NO",
        });
      });

      setRowsDatatable(rows);
    } catch (error: any) {
      AlertComponent("error", error.message);
    }
  };

  useEffect(() => {
    LoadUsers();
  }, [users]);

  //=======================================================================
  // UPDATE PRIVILEGES
  //=======================================================================

  const GetValuesForm = async (values: IUser.NSPrivilegesEntity) => {
    const updateUser = new ListObject<IUser.NsUserEntity>(users);
    updateUser.editByDynamic("Id", itemSelected?.Id, {
      ProfileId: values.ProfileId,
      Aplications: values.Aplications,
    });

    setRowsUsers(updateUser.getAll());
    setOpenFormDialog(false);

    const update = await new UserUseCase().updateUserPrivileges(
      itemSelected?.Id,
      itemSelected?.Uid ?? "",
      values
    );

    AlertComponent(
      "success",
      "Los privilegios del usuario se actualizaron correctamente."
    );
  };

  //=======================================================================
  // RENDER
  //=======================================================================

  return (
    <>
      <TableCrypto dataRows={rowsDataTable} />

      {openFormDialog && (
        <Dialog
          open={openFormDialog}
          onClose={() => setOpenFormDialog(false)}
          maxWidth="md"
        >
          <DialogTitle>
            <center>PRIVILEGES</center>
          </DialogTitle>
          <DialogContent>
            <FormPrivileges
              itemSelected={itemSelected}
              aplicationConfig={aplicationConfig}
              onSubmit={GetValuesForm}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

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
      name: "E-MAIL",
      idName: "Email",
      selector: (row: TablaCryptoEntity) => row?.Email,
      cell: (row: TablaCryptoEntity) => <>{row?.Email}</>,
      width: "250px",
      style: { fontWeight: "bold" },
      sortable: true,
    },
    {
      name: "NICK NAME",
      idName: "NickName",
      selector: (row: TablaCryptoEntity) => row?.NickName,
      cell: (row: TablaCryptoEntity) => <>{row?.NickName}</>,
      width: "200px",
      style: { fontWeight: "bold" },
      sortable: true,
    },
    {
      name: <samp style={{ margin: "auto", textAlign: "center" }}>PERFIL</samp>,
      idName: "ProfileId",
      selector: (row: TablaCryptoEntity) => row?.ProfileId,
      cell: (row: TablaCryptoEntity) => (
        <div style={{ margin: "auto", textAlign: "center" }}>
          {row?.ProfileId}
        </div>
      ),
      width: "150px",
    },
    {
      name: <samp style={{ margin: "auto", textAlign: "center" }}>ACTIVO</samp>,
      idName: "Active",
      selector: (row: TablaCryptoEntity) => row?.Active,
      cell: (row: TablaCryptoEntity) => (
        <div style={{ margin: "auto", textAlign: "center" }}>{row?.Active}</div>
      ),
      width: "100px",
    },
  ];

  return <GenDataTable columns={columns} data={dataRows} />;
};

const FormPrivileges = ({
  itemSelected,
  aplicationConfig,
  onSubmit,
}: {
  itemSelected: UserEntity | undefined;
  aplicationConfig: AplicationUseCase;
  onSubmit: (values: IUser.NSPrivilegesEntity) => void;
}) => {
  const [selectedApps, setSelectedApps] = useState<string[]>(
    itemSelected?.Aplications ?? []
  );
  const [profileSelected, setProfileSelected] = useState<string>(
    itemSelected?.ProfileId ?? ""
  );

  const handleAppChange = (id: string) => {
    setSelectedApps((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const UpdatePrivileges = async () => {
    onSubmit({
      ProfileId: profileSelected,
      Aplications: selectedApps,
    });
  };

  return (
    <>
      <FormControl fullWidth variant="standard">
        <InputLabel htmlFor="Type">Perfil de usuario</InputLabel>
        <Select
          fullWidth
          id="Type"
          name="Type"
          value={profileSelected}
          onChange={(e) => {
            setProfileSelected(e.target.value);
          }}
        >
          {GetGlobalCatalogItems(GetGlobalCatalogName("PerfilUsuario")).map(
            (x) => (
              <MenuItem key={x.Key} value={x.Key}>
                {Crypt0.DC1pt0(x.Value ?? "")}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>

      <Box sx={{ marginBottom: "15px", marginTop: "20px" }}>
        <Typography variant="subtitle1" gutterBottom>
          Selecciona Aplicaciones
        </Typography>
        {aplicationConfig.getChilldren("0").map((app) => (
          <div key={app.Ref}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Checkbox
                checked={selectedApps.includes(app.Ref ?? "")}
                onChange={() => handleAppChange(app.Ref ?? "")}
              />
              <span>{app.Name}</span>
            </label>
          </div>
        ))}
      </Box>

      <Button
        fullWidth
        sx={{ marginBottom: "10px", marginTop: "15px" }}
        color="error"
        variant="contained"
        endIcon={<SaveIcon />}
        onClick={UpdatePrivileges}
      >
        GUARDAR
      </Button>
    </>
  );
};
