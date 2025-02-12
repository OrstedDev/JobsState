import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

import AlertComponent from "../../../../../../GenericComponents/Alerts/AlertComponent";
import UserUseCase from "../../../../../../../DataLayer/UseCases/Aplications/Internal/User/UserUseCase";
import { IUser } from "../../../../../../../DomainLayer/Interfaces/Aplication/Internal/IUser";

export default function CardUsers() {
  const [rowsUser, setRowsUsers] = useState<Array<IUser.NsUserEntity>>([]);

  const [dialogState, setDialogState] = useState<{ [key: string]: boolean }>({
    view: false,
  });

  //=======================================
  // DIALOG
  //=======================================

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

  //=======================================
  // LOAD
  //=======================================

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
    <>
      <Card
        sx={{
          mt: 2,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            USERS
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
            }}
          >
            {rowsUser.length} Users
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              mt: 2,
            }}
          >
            <PhotoProvider>
              {rowsUser.slice(0, 20).map((user, index) => (
                <AvatarUser key={index} src={user.ImgUser} />
              ))}
            </PhotoProvider>
          </Box>
          <Button
            variant="text"
            sx={{
              mt: 2,
            }}
            fullWidth
            onClick={() => {
              openDialog("view");
            }}
          >
            VIEW ALL
          </Button>
        </CardContent>
      </Card>

      {dialogState["view"] && (
        <Dialog
          open={dialogState["view"]}
          onClose={() => closeDialog("view")}
          maxWidth="md"
        >
          <Card sx={{ maxWidth: 350 }}>
            <CardContent
              sx={{
                maxHeight: 500,
                overflowY: "auto",
              }}
            >
              <List>
                {rowsUser.map((user, index) => (
                  <ListItem key={index} sx={{ borderRadius: 2, mb: 1 }}>
                    <ListItemAvatar>
                      <Avatar src={user.ImgUser} />
                    </ListItemAvatar>
                    <ListItemText primary={user.NickName} sx={{ width: 300 }} />
                    <Button
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                      }}
                    >
                      Agregar
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Dialog>
      )}
    </>
  );
}

const AvatarUser = ({ src }: { src: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        width: 50,
        height: 50,
        marginRight: 5,
        marginBottom: 5,
        position: "relative",
      }}
    >
      {!isLoaded && (
        <CircularProgress
          size={10}
          sx={{
            position: "absolute",
            top: "40%",
            left: "40%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
      <PhotoView src={src}>
        <Avatar
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: 10,
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
          alt="Remy Sharp"
          src={src}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(false)}
        />
      </PhotoView>
    </div>
  );
};
