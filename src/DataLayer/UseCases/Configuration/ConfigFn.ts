import { ENV } from "../../../EnvConfig";
import GenericFirebaseService from "../../../InfraestructureLayer/Firebase/GenericFirebaseService";
import { db } from "../../../InfraestructureLayer/Firebase/FirebaseClient";
import { IConfigApp } from "../../../DomainLayer/Interfaces/Aplication/IConfig";
import { Crypt0 } from "../../../UtilitiesLayer/Library/C1p70";
import {
  runTransaction,
  doc,
  collection,
  getDocs,
} from "firebase/firestore/lite";

export async function SetConfigFn(
  data: Array<IConfigApp.NsConfigApp>
): Promise<IConfigApp.NsRespConfigApp> {
  try {
    data = data.filter((item) => item.Update === true);

    await runTransaction(db, async (transaction) => {
      const docSnapshots: Array<{
        item: IConfigApp.NsConfigApp;
        snapshot: any;
      }> = [];
      for (const item of data) {
        const docRef = doc(
          collection(db, ENV?.BASE ?? ""),
          Crypt0.C1pt0ToHex(item.Id)
        );
        const docSnapshot = await transaction.get(docRef);
        docSnapshots.push({ item, snapshot: docSnapshot });
      }

      for (const { item, snapshot } of docSnapshots) {
        const docRef = doc(
          collection(db, ENV?.BASE ?? ""),
          Crypt0.C1pt0ToHex(item.Id)
        );

        if (snapshot.exists()) {
          transaction.update(docRef, {
            Body: Crypt0.C1pt0(item.Body),
          });
        } else {
          transaction.set(docRef, {
            Body: Crypt0.C1pt0(item.Body),
          });
        }
      }
    });

    return {
      code: 200,
      success: true,
      message: "Registro satisfactorio.",
    };
  } catch (e: any) {
    console.error("Error:", e);
    return {
      code: 500,
      success: false,
      message: "Error al registrar",
    };
  }
}

export async function GetConfigFn(): Promise<IConfigApp.NsRespConfigApp> {
  try {
    const items = await getDocs(collection(db, ENV?.BASE ?? ""));

    return {
      code: 200,
      success: true,
      data:
        items != undefined
          ? items.docs.map((item): IConfigApp.NsConfigApp => {
              return {
                Id: Crypt0.DC1pt0FromHex(item?.id),
                Body: Crypt0.DC1pt0(item?.data().Body),
                Update: false,
              };
            })
          : [],
      message: "Satisfactorio",
    };
  } catch (e: any) {
    console.error("Error:", e.message);
    return {
      code: 500,
      success: false,
      message: "Error desconocido...",
    };
  }
}

export async function SetImgFn(
  Img: any,
  Route: string,
  Name: string
): Promise<string> {
  try {
    return await GenericFirebaseService.UploadFileBlob(
      Img,
      ENV?.BASE + "/" + Route + "/" + Name
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
    return await GenericFirebaseService.DeleteFileBlob(
      ENV?.BASE + "/" + Route + "/" + Name
    );
  } catch (e: any) {
    return false;
  }
}
