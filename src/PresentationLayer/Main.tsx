import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useGlobalContext } from "../Global";
import { Crypt0 } from "../UtilitiesLayer/Library/C1p70";
import { RoutesUser } from "../DataLayer/UseCases/Aplications/Internal/Initialize/InitData";
import ListObject from "../UtilitiesLayer/Structures/ListObject";
import { FragmentStorage } from "../UtilitiesLayer/Library/FragmentStorage";
import { GetGlobalCryptKeys } from "../DataLayer/UseCases/Aplications/Internal/Initialize/InitData";
import ImageManager from "./GenericComponents/ImageManager/ImageManager";

import Routers from "./Views/Routes";
import Error404 from "./Views/Pages/Error/Error404";
import InicioLoginIndex from "./Views/Pages/Login/LoginIndex";
import DashBoardIndex from "./Views/DashBoard/DashBoardIndex";

import { ProfileImg } from "../DomainLayer/Models/Fragment/FragmentEntity";

function Main({ validSession }: { validSession: boolean }) {
  const location = useLocation();
  const { state } = useGlobalContext();
  const { dispatch } = useGlobalContext();
  const imgManager = ImageManager.getInstance();

  const [loaded, setLoaded] = useState<boolean>(false);
  const [appRoutes, setAppRoutes] = useState<
    ListObject<{ Key: string; Value: React.ReactNode }>
  >(
    new ListObject<{ Key: string; Value: React.ReactNode }>(
      Routers.getAll().filter(
        (x) =>
          x.Key === Crypt0.C1pt0("/") ||
          x.Key === Crypt0.C1pt0("*") ||
          x.Key === Crypt0.C1pt0("/restore")
      )
    )
  );

  //===========================================================================
  // LOAD IMG PROFILE
  //===========================================================================

  const UserLoadImg = async () => {
    try {
      const Img: ProfileImg = new FragmentStorage().GetValueJSON(
        GetGlobalCryptKeys("ProfileImg")
      );

      await Promise.all([
        imgManager.addOrUpdate("ProfilePicture", Img.ImgUser),
        imgManager.addOrUpdate("ProfileBackground", Img.ImgFrontPage),
      ]);

      dispatch({
        type: "UPDATE_STATE",
        payload: { loadBaseImg: new Date().toISOString() },
      });
    } catch (e: any) {
      console.log(e.message);
    }
  };

  //===========================================================================
  // LOAD IMG WALLPAPER
  //===========================================================================

  const PageWallpaperLoadImg = async () => {
    try {
      const Img: ProfileImg = new FragmentStorage().GetValueJSON(
        GetGlobalCryptKeys("ProfileImg")
      );

      const lstWallp = ListObject.fromJSON<{ Key: string; Value: string }>(
        JSON.parse(Img.ImgWallpaper) ?? []
      );

      await Promise.all(
        lstWallp
          .getAll()
          .map((item) => imgManager.addOrUpdate(item.Key, item.Value))
      );

      dispatch({
        type: "UPDATE_STATE",
        payload: { loadWallpImg: new Date().toISOString() },
      });
    } catch (e: any) {
      console.log(e.message);
    }
  };

  //===========================================================================
  // ROUTES VALIDATE
  //===========================================================================

  useEffect(() => {
    try {
      if (RoutesUser.getAll().length !== 0) {
        Routers.getAll().forEach((route) => {
          if (
            RoutesUser.getAll().find(
              (x) => x.Route === Crypt0.DC1pt0(route.Key)
            ) !== undefined
          ) {
            appRoutes.addUnique(route, "Key");
          } else {
            //Routers.removeBy("Key", route.Key);
          }
        });
        setAppRoutes(new ListObject(appRoutes.getAll()));
        setLoaded(true);

        UserLoadImg();
        PageWallpaperLoadImg();
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }, [state?.initDate]);

  return (
    <>
      {validSession ? (
        <DashBoardIndex>
          {loaded &&
            (!appRoutes
              .getAll()
              .find((x) => Crypt0.DC1pt0(x.Key) === location.pathname) ? (
              <Error404 />
            ) : (
              <Routes>
                {appRoutes
                  .getAll()
                  .map(
                    (
                      x: { Key: string; Value: React.ReactNode },
                      index: number
                    ) => (
                      <Route
                        key={index}
                        path={Crypt0.DC1pt0(x.Key)}
                        element={x.Value}
                      />
                    )
                  )}
              </Routes>
            ))}
        </DashBoardIndex>
      ) : (
        <InicioLoginIndex />
      )}
    </>
  );
}

export default Main;
