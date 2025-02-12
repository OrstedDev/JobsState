import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { blueGrey } from "@mui/material/colors";
import { useLocation } from "react-router-dom";

import ImageManager from "../../GenericComponents/ImageManager/ImageManager";
import ListObject from "../../../UtilitiesLayer/Structures/ListObject";
import { useGlobalContext } from "../../../Global";

import { FragmentStorage } from "../../../UtilitiesLayer/Library/FragmentStorage";
import {
  ProfileImg,
  OneValue,
} from "../../../DomainLayer/Models/Fragment/FragmentEntity";

import { GetGlobalCryptKeys } from "../../../DataLayer/UseCases/Initialize/InitData";

export const BodyBaseDashBoard = ({ children }: any) => {
  const imgManager = ImageManager.getInstance();
  const location = useLocation();
  const { state } = useGlobalContext();

  const [imgWallpapers, setImgWallpapers] = useState<
    ListObject<{ Key: string; Value: string }>
  >(new ListObject<{ Key: string; Value: string }>());

  const [urlWallpapers, setUrlWallpapers] = useState<
    ListObject<{ Key: string; Value: string }>
  >(new ListObject<{ Key: string; Value: string }>());

  const [loaded, setLoaded] = useState<boolean>(false);
  const [img, setImg] = useState<any>();

  useEffect(() => {
    const idImg = urlWallpapers.getBy("Key", location.pathname);
    const blob = imgWallpapers.getBy("Key", idImg?.Value);

    if (
      state?.loadWallpImg !== undefined &&
      blob !== null &&
      window.innerWidth > 600
    ) {
      setImg(imgManager.getImageByKey(blob?.Key ?? "")?.src ?? "");
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [urlWallpapers, location.pathname]);

  useEffect(() => {
    try {
      if (state?.loadWallpImg !== undefined) {
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
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }, [state?.loadWallpImg]);

  return (
    <Box
      component="main"
      sx={
        loaded
          ? {
              backgroundImage: `
                linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2)), 
                url('${img}')
              `,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed",
              minHeight: "100vh",
              width: "100%",
              color: "white",
              justifyContent: "center",
            }
          : {
              backgroundColor: (theme) =>
                theme.palette.mode === "light" ? blueGrey[100] : "#022830",
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }
      }
    >
      <Toolbar />
      {children}
    </Box>
  );
};
