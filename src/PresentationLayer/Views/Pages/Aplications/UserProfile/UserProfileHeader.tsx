import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Cropper from "react-cropper";
import Compressor from "compressorjs";
import IconButton from "@mui/material/IconButton";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { dataURLToBlob } from "blob-util";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

import { useGlobalContext } from "../../../../../Global";
import AlertComponent from "../../../../GenericComponents/Alerts/AlertComponent";
import UserUseCase from "../../../../../DataLayer/UseCases/User/UserUseCase";
import ImageManager from "../../../../GenericComponents/ImageManager/ImageManager";
import {
  GetGlobalCryptRoutes,
  GetGlobalCryptStoragName,
} from "../../../../../DataLayer/UseCases/Initialize/InitData";

export default function UserProfileHeader({
  Alias,
  Profile,
}: {
  Alias: string;
  Profile: string;
}) {
  const { state } = useGlobalContext();
  const imgManager = ImageManager.getInstance();
  const theme = useTheme();

  const cropperRef = useRef<any>(null);
  const [image, setImage] = useState<any>(null);

  const [dialogState, setDialogState] = useState<{ [key: string]: boolean }>({
    background: false,
    photo: false,
  });

  const [loadedImage, setLoadedImage] = useState<{ [key: string]: any }>({
    ProfilePicture: false,
    ProfileBackground: false,
  });

  //=======================================
  // LOAD IMAGE
  //=======================================

  const SetLoadImage = (Key: string, Value: any) => {
    setLoadedImage((prevState) => ({
      ...prevState,
      [Key]: Value,
    }));
  };

  useEffect(() => {
    SetLoadImage(
      "ProfilePicture",
      imgManager.getImageByKey("ProfilePicture")?.src
    );
    SetLoadImage(
      "ProfileBackground",
      imgManager.getImageByKey("ProfileBackground")?.src
    );
  }, [state?.loadBaseImg]);

  //=======================================
  // CROPPER
  //=======================================

  const LoadImage = (event: any) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const RecortImage = (type: "ProfileBackground" | "ProfilePicture") => {
    const cropper = cropperRef.current.cropper;
    const croppedImageBase64 = cropper.getCroppedCanvas().toDataURL();

    const croppedImageBlob = dataURLToBlob(croppedImageBase64);

    imgManager.updateImageFromBlob(type, croppedImageBlob);
    SetLoadImage(type, croppedImageBase64);

    RegisterImg(croppedImageBlob, type);
  };

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

  //=======================================================================
  // COMPRESSOR
  //=======================================================================

  const compressImage = async (image: any) => {
    return new Promise((resolve, reject) => {
      new Compressor(image, {
        quality: 0.8,
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

  const RegisterImg = async (
    img: any,
    type: "ProfileBackground" | "ProfilePicture"
  ) => {
    try {
      const urlImg: string = await new UserUseCase().setImg(
        await compressImage(img),
        GetGlobalCryptRoutes("AccountImages"),
        GetGlobalCryptStoragName(type)
      );

      if (!(await new UserUseCase().updateUserUrl(urlImg, type))) {
        AlertComponent("error", "Error al Actualizar...");
      }
    } catch (e: any) {
      AlertComponent("error", e.message);
    }
  };

  return (
    <PhotoProvider>
      <Paper
        sx={{
          height: 300,
          backgroundImage: `url(${loadedImage["ProfileBackground"]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          boxShadow: "0px 4px 10px rgba(195, 195, 195, 0.61)",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              theme.palette.mode === "light"
                ? "linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.7))"
                : "linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.7))",
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            right: 10,
            zIndex: 2,
          }}
        >
          <IconButton
            sx={{
              width: 30,
              height: 30,
              border: "2px solid #ccc",
              borderRadius: "8px",
              backgroundColor:
                theme.palette.mode === "light" ? "white" : "black",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "light" ? "#f0f0f0" : "#565656",
              },
            }}
            onClick={() => setImage(null)}
            onChange={() => {
              openDialog("background");
            }}
            component="label"
          >
            <CameraAltIcon sx={{ fontSize: 20 }} />
            <input type="file" hidden accept="image/*" onChange={LoadImage} />
          </IconButton>
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: -20,
            left: 20,
            display: "flex",
            alignItems: "center",
            zIndex: 2,
          }}
        >
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <PhotoView src={loadedImage["ProfilePicture"]}>
              <Avatar
                src={loadedImage["ProfilePicture"]}
                sx={{
                  width: 100,
                  height: 100,
                  border: "4px solid white",
                  cursor: "pointer",
                }}
              />
            </PhotoView>

            <IconButton
              sx={{
                position: "absolute",
                bottom: -5,
                right: -5,
                backgroundColor:
                  theme.palette.mode === "light" ? "white" : "black",
                border: "2px solid #ccc",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "light" ? "#f0f0f0" : "#565656",
                },
              }}
              onClick={() => setImage(null)}
              onChange={() => {
                openDialog("photo");
              }}
              component="label"
            >
              <CameraAltIcon />
              <input type="file" hidden accept="image/*" onChange={LoadImage} />
            </IconButton>
          </Box>

          <Box sx={{ ml: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              {Alias}
            </Typography>
            <Typography variant="body2">{Profile}</Typography>
          </Box>
        </Box>

        {dialogState["background"] && image && (
          <Dialog
            open={dialogState["background"]}
            onClose={() => {
              closeDialog("background");
            }}
            maxWidth="xs"
          >
            <DialogContent>
              <Cropper
                src={image}
                initialAspectRatio={2}
                aspectRatio={3}
                guides={true}
                cropBoxResizable={true}
                cropBoxMovable={true}
                dragMode="move"
                viewMode={2}
                responsive={true}
                background={true}
                autoCropArea={1}
                ref={cropperRef}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  RecortImage("ProfileBackground");
                  closeDialog("background");
                }}
                sx={{ mt: 1 }}
              >
                SAVE
              </Button>
            </DialogContent>
          </Dialog>
        )}

        {dialogState["photo"] && image && (
          <Dialog
            open={dialogState["photo"]}
            onClose={() => {
              closeDialog("photo");
            }}
            maxWidth="xs"
          >
            <DialogContent>
              <Cropper
                src={image}
                initialAspectRatio={1}
                aspectRatio={1}
                guides={true}
                cropBoxResizable={true}
                cropBoxMovable={true}
                dragMode="move"
                viewMode={2}
                responsive={true}
                background={true}
                autoCropArea={1}
                ref={cropperRef}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  RecortImage("ProfilePicture");
                  closeDialog("photo");
                }}
                sx={{ mt: 1 }}
              >
                SAVE
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </Paper>
    </PhotoProvider>
  );
}
