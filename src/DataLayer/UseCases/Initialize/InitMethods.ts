import { ENV } from "../../../EnvConfig";
import { IAuth } from "../../../DomainLayer/Interfaces/Aplication/IAuth";
import { db } from "../../../InfraestructureLayer/Firebase/FirebaseClient";
import {
  query,
  getDocs,
  collection,
  where,
  limit,
} from "firebase/firestore/lite";
import GenericFirebaseService from "../../../InfraestructureLayer/Firebase/GenericFirebaseService";
import { format } from "date-fns";
import { Crypt0 } from "../../../UtilitiesLayer/Library/C1p70";
import { CatalogosUseCase } from "../Configuration/CatalogsUseCase";
import { CryptoConfigUseCase } from "../Configuration/CryptoConfigUseCase";
import { FragmentStorage } from "../../../UtilitiesLayer/Library/FragmentStorage";
import { CatalogEntity } from "../../../DomainLayer/Models/Aplication/Modules/Configuration/CatalogEntity";
import PrivilegesUseCase from "../Configuration/PrivilegesUseCase";
import UniqueList from "../../../UtilitiesLayer/Structures/UniqueList";

import {
  UserInfoBasic,
  ProfileImg,
  OneValue,
} from "../../../DomainLayer/Models/Fragment/FragmentEntity";

import {
  GlobalCatalogName,
  GlobalCatalogItems,
  GlobalCryptKeys,
  GlobalCryptCollect,
  GlobalCryptRoutes,
  GlobalCryptStoragName,
  MenuUser,
  RoutesUser,
  DomainUser,
  EndPointUser,
  GetGlobalCryptKeys,
  GetGlobalCatalogItems,
  GetGlobalCatalogName,
} from "./InitData";

export async function InitMethodsFn(): Promise<IAuth.NsAuthResponse> {
  try {
    const session = new FragmentStorage().GetValueJSON(
      Crypt0.C1pt0ToHex("Session")
    );
    
    //========================================
    // QUERYS
    //========================================

    if (!session?.lInit) {
      const Firma = new FragmentStorage().GetValueJSON(
        Crypt0.C1pt0ToHex("Firma")
      );

      const [userDb, configsDb] = await Promise.all([
        GenericFirebaseService.GetDocumentById(
          Crypt0.DC1pt0FromHex(Firma.usid),
          "BasicData"
        ),
        getDocs(collection(db, ENV?.BASE ?? "")),
      ]);

      if (userDb?.ref) {
        new FragmentStorage().SetValue(
          Crypt0.C1pt0("InitDataLoad"),
          JSON.stringify({
            user: userDb.data(),
            configs: configsDb.docs.map((item) => {
              return {
                Id: Crypt0.DC1pt0FromHex(item?.id),
                Body: Crypt0.DC1pt0(item?.data()?.Body),
              };
            }),
          })
        );
      }

      new FragmentStorage().SetValue(
        Crypt0.C1pt0ToHex("Session"),
        JSON.stringify({
          lVal: true,
          lInit: true,
          kyid: Crypt0.C1pt0ToHex(format(new Date(), "yyyyMMddHHmm")),
        })
      );

      new FragmentStorage().SetValue(
        GetGlobalCryptKeys("LastSign"),
        JSON.stringify({
          LastSignInTime: new Date(),
        })
      );
    }

    const InitDataLoad = new FragmentStorage().GetValueJSON(
      Crypt0.C1pt0("InitDataLoad")
    );

    const user = InitDataLoad?.user;
    const configs = InitDataLoad?.configs;

    //========================================
    // CATALOGS
    //========================================

    const Catalogs = new CatalogosUseCase(
      configs.find((x: any) => x?.Id == "Catalogs")?.Body
    );

    Catalogs.get().forEach((catalog) => {
      GlobalCatalogName.insertOrUpdate(
        Crypt0.C1pt0(catalog?.Value ?? ""),
        Crypt0.C1pt0(catalog?.Key ?? "")
      );
      GlobalCatalogItems.insertOrUpdate(
        Crypt0.C1pt0(catalog?.Key ?? ""),
        Catalogs.getItems(catalog?.Key ?? "").map((item): CatalogEntity => {
          return {
            Key: Crypt0.C1pt0(item?.Key ?? ""),
            Value: Crypt0.C1pt0(item?.Value ?? ""),
          };
        })
      );
    });

    //========================================
    // CRYPTOS
    //========================================

    new CryptoConfigUseCase(
      configs.find((x: any) => x?.Id == "CryptKeys")?.Body
    )
      .getAll()
      .forEach((item) => {
        GlobalCryptKeys.insertOrUpdate(
          Crypt0.C1pt0(item?.Name ?? ""),
          Crypt0.C1pt0(item?.Key ?? "")
        );
      });

    new CryptoConfigUseCase(
      configs.find((x: any) => x?.Id == "CryptCollect")?.Body
    )
      .getAll()
      .forEach((item) => {
        GlobalCryptCollect.insertOrUpdate(
          Crypt0.C1pt0(item?.Name ?? ""),
          Crypt0.C1pt0(item?.Key ?? "")
        );
      });

    new CryptoConfigUseCase(
      configs.find((x: any) => x?.Id == "CryptStoragName")?.Body
    )
      .getAll()
      .forEach((item) => {
        GlobalCryptStoragName.insertOrUpdate(
          Crypt0.C1pt0(item?.Name ?? ""),
          Crypt0.C1pt0(item?.Key ?? "")
        );
      });

    new CryptoConfigUseCase(
      configs.find((x: any) => x?.Id == "CryptRoutes")?.Body
    )
      .getAll()
      .forEach((item) => {
        GlobalCryptRoutes.insertOrUpdate(
          Crypt0.C1pt0(item?.Name ?? ""),
          Crypt0.C1pt0(item?.Key ?? "")
        );
      });

    //========================================
    // INFO DEL CLIENTE
    //========================================

    if (user !== undefined || user !== null) {
      const UserInfoBasic: UserInfoBasic = {
        Email: Crypt0.DC1pt0(user?.User?.Email),
        Doc: Crypt0.DC1pt0(user?.User?.Doc),
        NickName: Crypt0.DC1pt0(user?.User?.NickName),
        FirstName: Crypt0.DC1pt0(user?.User?.FirstName),
        LastName: Crypt0.DC1pt0(user?.User?.LastName),
        Gender: Crypt0.DC1pt0(user?.User?.Gender),
        PhoneNumber: Crypt0.DC1pt0(user?.Contact?.PhoneNumber),
        Address: Crypt0.DC1pt0(user?.Contact?.Address),
        Profile: Crypt0.DC1pt0(
          GetGlobalCatalogItems(GetGlobalCatalogName("PerfilUsuario")).find(
            (x) => x.Key === user?.Privileges?.ProfileId
          )?.Value ?? ""
        ),
        Verified: user?.User?.Verified,
      };

      const ProfileImg: ProfileImg = {
        ImgUser: user?.Img?.ImgUser,
        ImgFrontPage: user?.Img?.ImgFrontPage,
        ImgWallpaper: Crypt0.DC1pt0(user?.Img?.ImgWallpaper),
      };

      const Theme: OneValue = {
        Value: user?.Options?.DarkMode,
      };

      const UrlWallpaper: OneValue = {
        Value: Crypt0.DC1pt0(user?.Options?.UrlWallpaper),
      };

      const Pin: OneValue = {
        Value: user?.Options?.AccessPassword,
      };

      new FragmentStorage().SetValue(
        GetGlobalCryptKeys("UserInfoBasic"),
        JSON.stringify(UserInfoBasic)
      );

      new FragmentStorage().SetValue(
        GetGlobalCryptKeys("Pin"),
        JSON.stringify(Pin)
      );

      if (!session?.lInit) {
        // OBVIADO
        new FragmentStorage().SetValue(
          Crypt0.C1pt0ToHex("Theme"),
          JSON.stringify(Theme)
        );

        new FragmentStorage().SetValue(
          GetGlobalCryptKeys("ProfileImg"),
          JSON.stringify(ProfileImg)
        );

        new FragmentStorage().SetValue(
          GetGlobalCryptKeys("UrlWallpaper"),
          JSON.stringify(UrlWallpaper)
        );
      }
    }

    //========================================
    // ACCESOS DEL CLIENTE
    //========================================

    MenuUser.SetToJSON(configs.find((x: any) => x?.Id == "Aplications")?.Body);

    const privi = new PrivilegesUseCase(
      configs.find((x: any) => x?.Id == "PrivilegesProfile")?.Body
    );

    const myApps: Array<string> = user?.Privileges?.Aplications ?? [];

    const userProfileAccess: Array<string> =
      privi.getAll().find((x) => x.Key === user?.Privileges?.ProfileId)
        ?.Value ?? [];

    //========================================
    // FILTRA SUS ACCESOS POR PERFIL y USUARIO
    //========================================

    const finalUserAccess = new UniqueList<string>();
    const allUniqueRef = new UniqueList<string>();

    if (myApps.length != 0) {
      myApps.forEach((access) => {
        userProfileAccess
          .filter((x) => x.includes(access))
          .forEach((item) => {
            finalUserAccess.add(item);
          });
      });
    } else {
      userProfileAccess.forEach((item) => {
        finalUserAccess.add(item);
      });
    }

    //========================================
    // OBTIENE REFERENCIAS UNICAS
    //========================================

    finalUserAccess.getAll().forEach((access) => {
      if (MenuUser.exist(access)) {
        MenuUser.getAllRefParents(access).forEach((ref) => {
          allUniqueRef.add(ref);
        });
      }
    });

    //========================================
    // OBTIENE LOS ENDPOINT Y DOMAINS DEL USER
    //========================================

    allUniqueRef.getAll().forEach((ref) => {
      MenuUser.getChilldren(ref).forEach((chill) => {
        if (chill.Value === "EndPoints") {
          MenuUser.getChilldren(chill.Ref).forEach((endPoint) => {
            EndPointUser.addUnique(
              {
                Name: endPoint.Name ?? "",
                Value: endPoint.Value,
                Protocol:
                  endPoint.ItemValues?.find((x) => x.Name === "TypeMethod")
                    ?.Value ?? "",
              },
              "Value"
            );
          });
        } else if (chill.Value === "Domains") {
          MenuUser.getChilldren(chill.Ref).forEach((domain) => {
            DomainUser.addUnique(
              { Name: domain.Name ?? "", Value: domain.Value },
              "Value"
            );
          });
        }
      });
    });

    //========================================
    // ELIMINA REFERENCIAS NO NECESARIAS
    //========================================

    MenuUser.getAllMapNodes().forEach((mapNode) => {
      if (!allUniqueRef.getAll().includes(mapNode.key)) {
        MenuUser.deleteNode(mapNode.key);
      }
    });

    //========================================
    // OBTIENE LAS RUTAS DEL USUARIO
    //========================================

    RoutesUser.addUnique(
      {
        Name: "Inicio",
        Value: "Inicio",
        Route: "/",
      },
      "Value"
    );

    RoutesUser.addUnique(
      {
        Name: "User Profile",
        Value: "User Profile",
        Route: "/user-profile",
      },
      "Value"
    );

    MenuUser.getAllMapNodes().forEach((mapNode) => {
      if (mapNode.node.children.length === 0) {
        RoutesUser.addUnique(
          {
            Name: mapNode.node.value.Name ?? "",
            Value: MenuUser.getAllParents(mapNode.key)
              .filter((x) => x.Key !== "0" && x.Value !== "Routes")
              .map((item): any => item.Name)
              .join("/"),
            Route: MenuUser.getAllParents(mapNode.key)
              .filter((x) => x.Key !== "0" && x.Value !== "Routes")
              .map((item): any => item.Value)
              .join(""),
          },
          "Value"
        );
      }
    });

    //========================================
    // DELETE CATALOGO DE PRIVILEGIOS
    //========================================

    var AdmId = GetGlobalCatalogItems(
      GetGlobalCatalogName("PerfilUsuario")
    ).find((x) => x.Value === Crypt0.C1pt0("Admin"));

    if (user?.Privileges?.ProfileId !== AdmId?.Key) {
      GlobalCatalogItems.remove(
        GlobalCatalogName.get(Crypt0.C1pt0("PerfilUsuario")) ?? ""
      );

      GlobalCatalogName.remove(Crypt0.C1pt0("PerfilUsuario"));
    }

    //========================================
    // IS LOADED
    //========================================

    localStorage.setItem("lSt", JSON.stringify(true));

    return {
      success: true,
      message: "Satisfactorio!",
      code: 200,
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message,
      code: 400,
    };
  }
}

export async function ClearInitFn(): Promise<boolean> {
  try {
    GlobalCatalogName.clear();
    GlobalCatalogItems.clear();
    GlobalCryptKeys.clear();
    GlobalCryptCollect.clear();
    GlobalCryptRoutes.clear();
    GlobalCryptStoragName.clear();
    RoutesUser.clear();
    DomainUser.clear();
    EndPointUser.clear();
    MenuUser.clear();
  } catch (e: any) {
    console.log(e.message);
    return false;
  }

  return true;
}
