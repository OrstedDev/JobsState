import { ENV } from "../../../EnvConfig";
import { format } from "date-fns";
import GenericFirebaseService from "../../../InfraestructureLayer/Firebase/GenericFirebaseService";
import { IUser } from "../../../DomainLayer/Interfaces/Aplication/IUser";
import { db } from "../../../InfraestructureLayer/Firebase/FirebaseClient";
import {
  getDocs,
  collection,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore/lite";
import { Crypt0 } from "../../../UtilitiesLayer/Library/C1p70";
import { FragmentStorage } from "../../../UtilitiesLayer/Library/FragmentStorage";
import { GetGlobalCryptKeys } from "../Initialize/InitData";
import {
  OneValue,
  ProfileImg,
  UserInfoBasic,
} from "../../../DomainLayer/Models/Fragment/FragmentEntity";

export async function getAllUsersFn(): Promise<IUser.NsResponse> {
  try {
    const users = await getDocs(collection(db, ENV?.VAR_USERS ?? ""));

    return {
      code: 200,
      success: true,
      message: "Satisfactorio!",
      data:
        users != undefined
          ? users.docs.map((item): IUser.NsUserEntity => {
              return {
                Id: item.id,
                Uid: Crypt0.DC1pt0(item?.data()?.Uid),
                NickName: Crypt0.DC1pt0(item?.data()?.User?.NickName),
                Email: Crypt0.DC1pt0(item?.data()?.User?.Email),
                ImgUser: item?.data()?.Img?.ImgUser,
                ProfileId: item?.data()?.Privileges?.ProfileId,
                Aplications: item?.data()?.Privileges?.Aplications,
                Active: item?.data()?.Active,
              };
            })
          : [],
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message,
      code: 400,
    };
  }
}

export async function updateUserPrivilegesFn(
  Id: string,
  Uid: string,
  Privileges: IUser.NSPrivilegesEntity
): Promise<boolean> {
  try {
    const [userDoc, UserBasicData] = await Promise.all([
      GenericFirebaseService.GetDocumentById(ENV?.VAR_USERS ?? "", Uid),
      GenericFirebaseService.GetDocumentById(Uid, "BasicData"),
    ]);

    if (userDoc?.ref && UserBasicData?.ref) {
      await updateDoc(userDoc.ref, {
        "Privileges.ProfileId": Privileges.ProfileId,
        "Privileges.Aplications": Privileges.Aplications,
      });

      await updateDoc(UserBasicData?.ref, {
        "Privileges.ProfileId": Privileges.ProfileId,
        "Privileges.Aplications": Privileges.Aplications,
      });
    }

    return true;
  } catch (error) {
    return false;
  }
}

export async function updateUserInfoFn(
  Body: IUser.NsUpdateUserEntity
): Promise<boolean> {
  try {
    const Firma = new FragmentStorage().GetValueJSON(
      Crypt0.C1pt0ToHex("Firma")
    );

    const Pin: OneValue = new FragmentStorage().GetValueJSON(
      GetGlobalCryptKeys("Pin")
    );

    const [userDoc, UserBasicData] = await Promise.all([
      GenericFirebaseService.GetDocumentById(
        ENV?.VAR_USERS ?? "",
        Crypt0.DC1pt0FromHex(Firma.usid)
      ),
      GenericFirebaseService.GetDocumentById(
        Crypt0.DC1pt0FromHex(Firma.usid),
        "BasicData"
      ),
    ]);

    if (userDoc?.ref && UserBasicData?.ref) {
      await Promise.all([
        updateDoc(UserBasicData?.ref, {
          "User.Doc": Crypt0.C1pt0(Body.Doc ?? ""),
          "User.NickName": Crypt0.C1pt0(Body.NickName ?? ""),
          "User.FirstName": Crypt0.C1pt0(Body.FirstName ?? ""),
          "User.LastName": Crypt0.C1pt0(Body.LastName ?? ""),
          "User.Gender": Crypt0.C1pt0(Body.Gender ?? ""),
          "Options.AccessPassword":
            Body.NewPin === "" ? Pin.Value : Crypt0.C1pt0(Body.NewPin ?? ""),
          "Contact.Address": Crypt0.C1pt0(Body.Address ?? ""),
          "Contact.PhoneNumber": Crypt0.C1pt0(Body.PhoneNumber ?? ""),
        }),
        updateDoc(userDoc?.ref, {
          "User.NickName": Crypt0.C1pt0(Body.NickName ?? ""),
        }),
      ]);
    }

    //=============================================================================
    // ACTUALIZA EL FRAGMENT
    //=============================================================================

    //* PIN
    if (Body.NewPin !== "") {
      const NewPin: OneValue = {
        Value: Crypt0.C1pt0(Body.NewPin ?? ""),
      };

      new FragmentStorage().SetValue(
        GetGlobalCryptKeys("Pin"),
        JSON.stringify(NewPin)
      );
    }

    const user: UserInfoBasic = new FragmentStorage().GetValueJSON(
      GetGlobalCryptKeys("UserInfoBasic")
    );

    //* USER DATA
    const newUserInfo: UserInfoBasic = {
      Email: user?.Email,
      Doc: Body?.Doc ?? "",
      NickName: Body?.NickName ?? "",
      FirstName: Body?.FirstName ?? "",
      LastName: Body?.LastName ?? "",
      Gender: user?.Gender,
      PhoneNumber: Body?.PhoneNumber ?? "",
      Address: Body?.Address ?? "",
      Profile: user?.Profile,
      Verified: user?.Verified,
    };

    new FragmentStorage().SetValue(
      GetGlobalCryptKeys("UserInfoBasic"),
      JSON.stringify(newUserInfo)
    );

    //* RELOAD DATA DB
    new FragmentStorage().SetValue(
      Crypt0.C1pt0ToHex("Session"),
      JSON.stringify({
        lVal: true,
        lInit: false,
        kyid: Crypt0.C1pt0ToHex(format(new Date(), "yyyyMMddHHmm")),
      })
    );

    return true;
  } catch (error) {
    throw error;
  }
}

export async function validatePinFn(Pin: string): Promise<boolean> {
  const storagePin: OneValue = new FragmentStorage().GetValueJSON(
    GetGlobalCryptKeys("Pin")
  );

  return Crypt0.DC1pt0(storagePin.Value) === Pin;
}

export async function getPinFn(): Promise<string> {
  const storagePin: OneValue = new FragmentStorage().GetValueJSON(
    GetGlobalCryptKeys("Pin")
  );

  return Crypt0.DC1pt0(storagePin.Value);
}

export async function updateUserUrlFn(
  Url: string,
  Type: "ProfilePicture" | "ProfileBackground"
): Promise<boolean> {
  try {
    const Firma = new FragmentStorage().GetValueJSON(
      Crypt0.C1pt0ToHex("Firma")
    );

    if (Type === "ProfilePicture") {
      const [userDoc, UserBasicData] = await Promise.all([
        GenericFirebaseService.GetDocumentById(
          ENV?.VAR_USERS ?? "",
          Crypt0.DC1pt0FromHex(Firma.usid)
        ),
        GenericFirebaseService.GetDocumentById(
          Crypt0.DC1pt0FromHex(Firma.usid),
          "BasicData"
        ),
      ]);

      if (userDoc?.ref && UserBasicData?.ref) {
        await Promise.all([
          updateDoc(UserBasicData?.ref, {
            "Img.ImgUser": Url,
          }),
          updateDoc(userDoc?.ref, {
            "Img.ImgUser": Url,
          }),
        ]);
      }
    } else {
      const UserBasicData = await GenericFirebaseService.GetDocumentById(
        Crypt0.DC1pt0FromHex(Firma.usid),
        "BasicData"
      );

      if (UserBasicData?.ref) {
        await updateDoc(UserBasicData?.ref, {
          "Img.ImgFrontPage": Url,
        });
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

export async function updateImgWallpaperFn(ListUrl: string): Promise<boolean> {
  try {
    const Firma = new FragmentStorage().GetValueJSON(
      Crypt0.C1pt0ToHex("Firma")
    );

    const UserBasicData = await GenericFirebaseService.GetDocumentById(
      Crypt0.DC1pt0FromHex(Firma.usid),
      "BasicData"
    );

    if (UserBasicData?.ref) {
      await updateDoc(UserBasicData?.ref, {
        "Img.ImgWallpaper": Crypt0.C1pt0(ListUrl),
      });
    }

    let NewImgWallp: ProfileImg = new FragmentStorage().GetValueJSON(
      GetGlobalCryptKeys("ProfileImg")
    );

    NewImgWallp.ImgWallpaper = ListUrl;

    new FragmentStorage().SetValue(
      GetGlobalCryptKeys("ProfileImg"),
      JSON.stringify(NewImgWallp)
    );

    return true;
  } catch (error) {
    return false;
  }
}

export async function updateUrlWallpaperFn(ListUrl: string): Promise<boolean> {
  try {
    const Firma = new FragmentStorage().GetValueJSON(
      Crypt0.C1pt0ToHex("Firma")
    );

    const UserBasicData = await GenericFirebaseService.GetDocumentById(
      Crypt0.DC1pt0FromHex(Firma.usid),
      "BasicData"
    );

    if (UserBasicData?.ref) {
      await updateDoc(UserBasicData?.ref, {
        "Options.UrlWallpaper": Crypt0.C1pt0(ListUrl),
      });
    }

    let NewImgWallp: OneValue = new FragmentStorage().GetValueJSON(
      GetGlobalCryptKeys("UrlWallpaper")
    );

    NewImgWallp.Value = ListUrl;

    new FragmentStorage().SetValue(
      GetGlobalCryptKeys("UrlWallpaper"),
      JSON.stringify(NewImgWallp)
    );

    return true;
  } catch (error) {
    return false;
  }
}

export async function updateUserDarkModeFn(
  DarkMode: boolean
): Promise<boolean> {
  try {
    const Firma = new FragmentStorage().GetValueJSON(
      Crypt0.C1pt0ToHex("Firma")
    );

    const UserBasicData = await GenericFirebaseService.GetDocumentById(
      Crypt0.DC1pt0FromHex(Firma.usid),
      "BasicData"
    );

    if (UserBasicData?.ref) {
      await updateDoc(UserBasicData?.ref, {
        "Options.DarkMode": DarkMode,
      });
    }

    return true;
  } catch (error) {
    return false;
  }
}

export async function SetImgFn(
  Img: any,
  Route: string,
  Name: string
): Promise<string> {
  try {
    const Firma = new FragmentStorage().GetValueJSON(
      Crypt0.C1pt0ToHex("Firma")
    );

    return await GenericFirebaseService.UploadFileBlob(
      Img,
      Crypt0.DC1pt0FromHex(Firma.usid) + "/" + Route + "/" + Name
    );
  } catch (e: any) {
    return "Error en la carga...";
  }
}

export async function DeleteImgFn(
  Route: string,
  Name: string
): Promise<boolean> {
  try {
    const Firma = new FragmentStorage().GetValueJSON(
      Crypt0.C1pt0ToHex("Firma")
    );

    return await GenericFirebaseService.DeleteFileBlob(
      Crypt0.DC1pt0FromHex(Firma.usid) + "/" + Route + "/" + Name
    );
  } catch (e: any) {
    return false;
  }
}
