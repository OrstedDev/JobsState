import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Cropper from "react-cropper";
import Compressor from "compressorjs";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

import { dataURLToBlob } from "blob-util";

import { useGlobalContext } from "../../../../../../Global";
import { RoutesUser } from "../../../../../../DataLayer/UseCases/Initialize/InitData";
import AlertComponent from "../../../../../GenericComponents/Alerts/AlertComponent";
import ImageManager from "../../../../../GenericComponents/ImageManager/ImageManager";
import ListObject from "../../../../../../UtilitiesLayer/Structures/ListObject";
import UserUseCase from "../../../../../../DataLayer/UseCases/User/UserUseCase";

import { FragmentStorage } from "../../../../../../UtilitiesLayer/Library/FragmentStorage";
import {
  ProfileImg,
  OneValue,
} from "../../../../../../DomainLayer/Models/Fragment/FragmentEntity";

import {
  GetGlobalCryptRoutes,
  GetGlobalCryptKeys,
} from "../../../../../../DataLayer/UseCases/Initialize/InitData";
import { Divider } from "@mui/material";

const modelRatio = [
  { rows: 2, cols: 2 },
  { rows: 1, cols: 1 },
  { rows: 1, cols: 1 },
  { rows: 1, cols: 2 },

  { rows: 1, cols: 2 },
  { rows: 2, cols: 2 },
  { rows: 1, cols: 1 },
  { rows: 1, cols: 1 },
];

type urlEntity = {
  Name: string;
  Route: string;
};

type imgGridEntity = {
  rows: number;
  cols: number;
  Key: string;
  Value: string;
};

export default function CardWallpapers() {
  const imgManager = ImageManager.getInstance();
  const cropperRef = useRef<any>(null);

  const { dispatch } = useGlobalContext();
  const { state } = useGlobalContext();

  const [dialogState, setDialogState] = useState<{ [key: string]: boolean }>({
    wallpaper: false,
    load: false,
    asign: false,
    select: false,
  });

  const [imgWallpapers, setImgWallpapers] = useState<
    ListObject<{ Key: string; Value: string }>
  >(new ListObject<{ Key: string; Value: string }>());

  const [urlWallpapers, setUrlWallpapers] = useState<
    ListObject<{ Key: string; Value: string }>
  >(new ListObject<{ Key: string; Value: string }>());

  const [gridImg, setGridImg] = useState<Array<imgGridEntity>>([]);

  const [lstUrl, setLstUrl] = useState<ListObject<urlEntity>>(
    new ListObject<urlEntity>()
  );

  const [itemSelect, setItemSelect] = useState<string>("");
  const [allImg, setAllImg] = useState<{ [key: string]: any }>({});
  const [cropImg, setCropImg] = useState<any>(null);

  //=======================================
  // GET URL USER
  //=======================================

  useEffect(() => {
    if (RoutesUser.getAll().length !== 0) {
      setLstUrl(
        new ListObject<urlEntity>(
          RoutesUser.getAll().map((x): urlEntity => {
            return {
              Name: x.Name,
              Route: x.Route,
            };
          })
        )
      );
    }
  }, [state?.initDate]);

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
  // LOAD IMAGE
  //=======================================

  const SetLoadImage = (Key: string, Value: any) => {
    setAllImg((prevState) => ({
      ...prevState,
      [Key]: Value,
    }));
  };

  const HasKeyImage = (Key: string): boolean => {
    return Key in allImg;
  };

  //=======================================
  // LOAD WALLPAPERS
  //=======================================

  useEffect(() => {
    try {
      const strImg: ProfileImg = new FragmentStorage().GetValueJSON(
        GetGlobalCryptKeys("ProfileImg")
      );

      const strUrlWall: OneValue = new FragmentStorage().GetValueJSON(
        GetGlobalCryptKeys("UrlWallpaper")
      );

      setImgWallpapers(
        new ListObject<{ Key: string; Value: string }>(
          JSON.parse(strImg.ImgWallpaper) ?? []
        )
      );

      setUrlWallpapers(
        new ListObject<{ Key: string; Value: string }>(
          JSON.parse(strUrlWall.Value) ?? []
        )
      );

      const lstImgWallpapers = ListObject.fromJSON<{
        Key: string;
        Value: string;
      }>(JSON.parse(strImg.ImgWallpaper) ?? []);

      lstImgWallpapers.getAll().forEach((item) => {
        SetLoadImage(item.Key, imgManager.getImageByKey(item.Key)?.src ?? "");
      });

      setGridImg(
        lstImgWallpapers.getAll().map((item, index) => {
          const mdl = modelRatio[index % modelRatio.length];
          return {
            ...item,
            rows: mdl.rows,
            cols: mdl.cols,
          };
        })
      );
    } catch (e: any) {
      console.log(e.message);
    }
  }, [state?.loadWallpImg]);

  //=======================================
  // CROPPER
  //=======================================

  const LoadImage = (event: any) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const RecortImage = async () => {
    const cropper = cropperRef.current.cropper;
    const croppedImageBase64 = cropper.getCroppedCanvas().toDataURL();
    const croppedImageBlob = dataURLToBlob(croppedImageBase64);

    const idImg = uuidv4();

    imgManager.updateImageFromBlob(idImg, croppedImageBlob);
    SetLoadImage(idImg, croppedImageBase64);

    await RegisterWallpaper(croppedImageBlob, idImg);
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
  // REGISTER IMG
  //=======================================================================

  const RegisterWallpaper = async (blob: any, idImg: string) => {
    try {
      const urlImg: string = await new UserUseCase().setImg(
        await compressImage(blob),
        GetGlobalCryptRoutes("PageWallpapers"),
        idImg
      );

      imgWallpapers.addUnique({ Key: idImg, Value: urlImg }, "Key");

      setImgWallpapers(
        new ListObject<{ Key: string; Value: string }>(imgWallpapers.getAll())
      );

      setGridImg(
        imgWallpapers.getAll().map((item, index) => {
          const mdl = modelRatio[index % modelRatio.length];
          return {
            ...item,
            rows: mdl.rows,
            cols: mdl.cols,
          };
        })
      );

      if (
        !(await new UserUseCase().updateImgWallpaper(
          JSON.stringify(imgWallpapers.toJSON())
        ))
      ) {
        AlertComponent("error", "Error al Actualizar...");
      }
    } catch (e: any) {
      AlertComponent("error", e.message);
    }
  };

  //=======================================================================
  // DELETE IMG
  //=======================================================================

  const DeleteWallpaper = async (idImg: string) => {
    try {
      imgWallpapers.removeBy("Key", idImg);

      setImgWallpapers(
        new ListObject<{ Key: string; Value: string }>(imgWallpapers.getAll())
      );

      setGridImg(
        imgWallpapers.getAll().map((item, index) => {
          const mdl = modelRatio[index % modelRatio.length];
          return {
            ...item,
            rows: mdl.rows,
            cols: mdl.cols,
          };
        })
      );

      if (
        !(await new UserUseCase().updateImgWallpaper(
          JSON.stringify(imgWallpapers.toJSON())
        )) ||
        !(await new UserUseCase().deleteImg(
          GetGlobalCryptRoutes("PageWallpapers"),
          idImg
        ))
      ) {
        AlertComponent("error", "Error al Actualizar...");
      }
    } catch (e: any) {
      AlertComponent("error", e.message);
    }
  };

  //=======================================================================
  // ASIGN TO URL
  //=======================================================================

  const AsignToUrl = async (idImg: string) => {
    try {
      console.log(idImg);

      urlWallpapers.addUnique({ Key: itemSelect, Value: idImg }, "Key");

      setUrlWallpapers(
        new ListObject<{ Key: string; Value: string }>(urlWallpapers.getAll())
      );

      if (
        !(await new UserUseCase().updateUrlWallpaper(
          JSON.stringify(urlWallpapers.toJSON())
        ))
      ) {
        AlertComponent("error", "Error al Actualizar...");
      }

      dispatch({
        type: "UPDATE_STATE",
        payload: { loadWallpImg: new Date().toISOString() },
      });
    } catch (e: any) {
      AlertComponent("error", e.message);
    }
  };

  return (
    <Grid>
      <Card
        sx={{
          mt: 2,
        }}
      >
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold">
              WALLPAPERS{" "}
            </Typography>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => {
                openDialog("load");
              }}
            >
              LOAD
            </Button>
          </Box>

          <PhotoProvider>
            <ImageList
              sx={{ height: 200 }}
              variant="quilted"
              cols={4}
              rowHeight={121}
            >
              {gridImg.map((item, index) => (
                <PhotoView key={index} src={item.Value}>
                  <ImageListItem
                    key={item.Key}
                    cols={item.cols}
                    rows={item.rows}
                  >
                    <img src={item.Value} alt={item.Key} loading="lazy" />
                  </ImageListItem>
                </PhotoView>
              ))}
            </ImageList>
          </PhotoProvider>

          <Button
            variant="text"
            sx={{
              mt: 1,
            }}
            fullWidth
            onClick={() => {
              openDialog("asign");
            }}
          >
            ASIGN WALLPAPERS
          </Button>
        </CardContent>

        {dialogState["load"] && (
          <Dialog
            open={dialogState["load"]}
            onClose={() => {
              closeDialog("load");
            }}
            maxWidth="md"
          >
            <DialogContent>
              <Button
                variant="contained"
                color="inherit"
                fullWidth
                onClick={() => {
                  setCropImg(null);
                }}
                onChange={() => {
                  openDialog("wallpaper");
                }}
                component="label"
              >
                LOAD NEW IMAGE
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={LoadImage}
                />
              </Button>

              {imgWallpapers.getAll().length > 0 && (
                <>
                  <Divider sx={{ mt: 2 }} />
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">WALLPAPERS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {imgWallpapers.getAll().map((item, index: number) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell align="center" width={250} sx={{ pb: 1 }}>
                            <Avatar
                              sx={{
                                width: "100%",
                                height: "100%",
                                top: 0,
                                left: 0,
                                borderRadius: 0,
                                transition: "opacity 0.3s ease-in-out",
                              }}
                              alt="Remy Sharp"
                              src={allImg[item.Key]}
                            />
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              sx={{ borderRadius: 0, mt: -5 }}
                              fullWidth
                              onClick={() => {
                                DeleteWallpaper(item.Key);
                              }}
                            >
                              DELETE
                              <DeleteIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </DialogContent>
          </Dialog>
        )}

        {dialogState["select"] && (
          <Dialog
            open={dialogState["select"]}
            onClose={() => {
              closeDialog("select");
            }}
            maxWidth="md"
          >
            <DialogContent>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">WALLPAPERS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {imgWallpapers.getAll().map((item, index: number) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell align="center" width={250} sx={{ pb: 1 }}>
                        <Avatar
                          sx={{
                            width: "100%",
                            height: "100%",
                            top: 0,
                            left: 0,
                            borderRadius: 0,
                            transition: "opacity 0.3s ease-in-out",
                          }}
                          alt="Remy Sharp"
                          src={allImg[item.Key]}
                        />
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ borderRadius: 0, mt: -5 }}
                          fullWidth
                          onClick={() => {
                            AsignToUrl(item.Key);
                            closeDialog("select");
                          }}
                        >
                          SELECT
                          <DoneOutlineIcon sx={{ width: 15, ml: 1 }} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>
        )}

        {dialogState["asign"] && (
          <Dialog
            open={dialogState["asign"]}
            onClose={() => {
              closeDialog("asign");
            }}
            maxWidth="md"
          >
            <DialogTitle>
              <center>ASIGN WALLPAPERS</center>
            </DialogTitle>
            <DialogContent>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">ACTIONS</TableCell>
                    <TableCell>ROUTE</TableCell>
                    <TableCell align="center">IMG</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lstUrl.getAll().map((item, index: number) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell align="center" width={30}>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          style={{
                            marginLeft: "auto",
                            minWidth: "0",
                            padding: "6px",
                          }}
                          sx={{ mr: 0.5 }}
                          onClick={() => {
                            openDialog("select");
                            setItemSelect(item.Route);
                          }}
                        >
                          {HasKeyImage(item.Route) ? (
                            <ChangeCircleIcon />
                          ) : (
                            <AddBoxIcon />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell component="th" scope="row" width={100}>
                        {item.Route.split("/").join("/\n")}
                      </TableCell>
                      <TableCell align="center" width={100}>
                        <Avatar
                          sx={{
                            width: "100%",
                            height: "100%",
                            top: 0,
                            left: 0,
                            borderRadius: 1,
                            transition: "opacity 0.3s ease-in-out",
                            aspectRatio: "16 / 9",
                            position: "relative",
                          }}
                          alt="Remy Sharp"
                          src={
                            allImg[
                              urlWallpapers.getBy("Key", item.Route)?.Value ??
                                ""
                            ]
                          }
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <PhotoCameraBackIcon
                              sx={{ color: "white", fontSize: 24 }}
                            />
                          </Box>
                        </Avatar>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>
        )}

        {dialogState["wallpaper"] && cropImg && (
          <Dialog
            open={dialogState["wallpaper"]}
            onClose={() => {
              closeDialog("wallpaper");
            }}
            maxWidth="xs"
          >
            <DialogContent>
              <Cropper
                src={cropImg}
                initialAspectRatio={16 / 9}
                aspectRatio={16 / 9}
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
                variant="outlined"
                onClick={async () => {
                  closeDialog("wallpaper");
                  closeDialog("asign");

                  RecortImage();
                }}
                sx={{ mt: 1 }}
              >
                SAVE
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </Card>
    </Grid>
  );
}
