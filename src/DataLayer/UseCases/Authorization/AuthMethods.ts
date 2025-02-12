import { ENV } from "../../../EnvConfig";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  query,
  getDocs,
  collection,
  where,
  limit,
} from "firebase/firestore/lite";
import { format } from "date-fns";

import GenericFirebaseService from "../../../InfraestructureLayer/Firebase/GenericFirebaseService";
import { IAuth } from "../../../DomainLayer/Interfaces/Aplication/IAuth";
import { auth } from "../../../InfraestructureLayer/Firebase/FirebaseClient";
import { db } from "../../../InfraestructureLayer/Firebase/FirebaseClient";
import { BasicDataEntity } from "../../../DomainLayer/Models/DataBase/User/BasicDataEntity";
import { UserDataEntity } from "../../../DomainLayer/Models/DataBase/User/UserDataEntity";
import { FragmentStorage } from "../../../UtilitiesLayer/Library/FragmentStorage";
import { Crypt0 } from "../../../UtilitiesLayer/Library/C1p70";

import InitUseCase from "../Initialize/InitUseCase";

export async function SetRegisterAuthFn(
  body: IAuth.NsAuthRequest
): Promise<IAuth.NsAuthResponse> {
  let cMessage: string = "Registro satisfactorio!";

  try {
    let createUser: any = await createUserWithEmailAndPassword(
      auth,
      body.Email,
      body.Password ?? ""
    );

    const BasicData: BasicDataEntity = {
      Head: "BasicData",
      User: {
        Doc: Crypt0.C1pt0(body.Doc ?? ""),
        NickName: Crypt0.C1pt0(body.Name ?? ""),
        FirstName: Crypt0.C1pt0(body.Name ?? ""),
        LastName: Crypt0.C1pt0(body.LastName ?? ""),
        Email: Crypt0.C1pt0(body.Email),
        Gender: Crypt0.C1pt0(body.Gender ?? ""),
        Verified: false,
      },
      Contact: {
        PhoneNumber: Crypt0.C1pt0(body.PhoneNumber ?? ""),
        Address: Crypt0.C1pt0(body.Address ?? ""),
      },
      Img: {
        ImgUser: "",
        ImgFrontPage: "",
        ImgWallpaper: Crypt0.C1pt0("[]"),
      },
      Options: {
        DarkMode: false,
        AccessPassword: Crypt0.C1pt0("1111"),
        UrlWallpaper: Crypt0.C1pt0("[]"),
      },
      Privileges: {
        Aplications: [],
        ProfileId: Crypt0.C1pt0(ENV?.VAR_PROFILE ?? ""),
      },
      Active: true,
    };

    const UserData: UserDataEntity = {
      Uid: Crypt0.C1pt0(createUser.user.uid),
      User: {
        NickName: Crypt0.C1pt0(
          (body.Name ?? "") + ", " + (body.LastName ?? "")
        ),
        Email: Crypt0.C1pt0(body.Email),
      },
      Img: {
        ImgUser: "",
      },
      Privileges: {
        Aplications: [],
        ProfileId: Crypt0.C1pt0(ENV?.VAR_PROFILE ?? ""),
      },
      Metadata: {
        CreationTime: new Date(),
        LastSignInTime: new Date(),
      },
      Online: false,
      Active: true,
    };

    await Promise.all([
      GenericFirebaseService.SetAddDocumentId(
        createUser.user.uid,
        "BasicData",
        BasicData
      ),
      GenericFirebaseService.SetAddDocumentId(
        ENV?.VAR_USERS ?? "",
        createUser.user.uid,
        UserData
      ),
    ]);

    return {
      success: true,
      message: cMessage,
      code: 200,
    };
  } catch (e: any) {
    switch (e.code) {
      case "auth/email-already-in-use":
        cMessage =
          "El correo electrónico ya está en uso. Por favor, intenta con otro.";
        break;
      case "auth/weak-password":
        cMessage = "La contraseña es débil. Debe tener al menos 6 caracteres.";
        break;
      case "auth/invalid-email":
        cMessage = "El correo electrónico proporcionado no es válido.";
        break;
      default:
        cMessage = "Error desconocido al crear usuario";
        break;
    }

    return {
      success: false,
      message: cMessage,
      code: 400,
    };
  }
}

export async function LoginAuthFn(
  body: IAuth.NsAuthRequest
): Promise<IAuth.NsAuthResponse> {
  let cMessage: string = "¡Bienvenido!!!";

  try {
    await signInWithEmailAndPassword(auth, body.Email, body.Password ?? "");

    new FragmentStorage().SetValue(
      Crypt0.C1pt0ToHex("Session"),
      JSON.stringify({
        lVal: true,
        lInit: false,
        kyid: Crypt0.C1pt0ToHex(format(new Date(), "yyyyMMddHHmm")),
      })
    );

    return {
      success: true,
      message: cMessage,
      code: 200,
    };
  } catch (e: any) {
    switch (e.code) {
      case "auth/user-not-found":
        cMessage = "Usuario no encontrado. Verifica tus credenciales.";
        break;
      case "auth/invalid-credential":
        cMessage = "Credenciales Invalidas.";
        break;
      case "auth/wrong-password":
        cMessage = "Contraseña incorrecta. Inténtalo de nuevo.";
        break;
      case "auth/invalid-email":
        cMessage = "Correo electrónico inválido. Ingresa un correo válido.";
        break;
      case "auth/too-many-requests":
        cMessage =
          "Demasiados intentos fallidos. Por favor, intenta nuevamente más tarde.";
        break;
      default:
        cMessage = "Error desconocido";
        break;
    }

    new FragmentStorage().SetValue(
      Crypt0.C1pt0ToHex("Session"),
      JSON.stringify({
        lVal: false,
      })
    );

    return {
      success: false,
      message: cMessage,
      code: 400,
    };
  }
}

export async function LoginWithGoogleAuthFn(): Promise<IAuth.NsAuthResponse> {
  const googleProvider = new GoogleAuthProvider();
  let cMessage: string = "¡Bienvenido!!!";

  try {
    let googleAuth: any = await signInWithPopup(auth, googleProvider);

    new FragmentStorage().SetValue(
      Crypt0.C1pt0ToHex("Session"),
      JSON.stringify({
        lVal: true,
        lInit: false,
        kyid: Crypt0.C1pt0ToHex(format(new Date(), "yyyyMMddHHmm")),
      })
    );

    const user = await GenericFirebaseService.GetDocumentById(
      googleAuth?.user?.uid,
      "BasicData"
    );

    if (!user?.ref) {
      const BasicData: BasicDataEntity = {
        Head: "BasicData",
        User: {
          Doc: Crypt0.C1pt0(""),
          NickName: Crypt0.C1pt0(
            googleAuth?.user?.displayName.split(" ")[0] ?? ""
          ),
          FirstName: Crypt0.C1pt0(""),
          LastName: Crypt0.C1pt0(""),
          Email: Crypt0.C1pt0(googleAuth?.user?.email ?? ""),
          Gender: Crypt0.C1pt0(""),
          Verified: googleAuth?.user?.emailVerified,
        },
        Contact: {
          PhoneNumber: Crypt0.C1pt0(googleAuth?.user?.phoneNumber ?? ""),
          Address: Crypt0.C1pt0(""),
        },
        Img: {
          ImgUser: googleAuth?.user?.photoURL,
          ImgFrontPage: "",
          ImgWallpaper: Crypt0.C1pt0("[]"),
        },
        Options: {
          DarkMode: false,
          AccessPassword: Crypt0.C1pt0("1111"),
          UrlWallpaper: Crypt0.C1pt0("[]"),
        },
        Privileges: {
          Aplications: [],
          ProfileId: Crypt0.C1pt0(ENV?.VAR_PROFILE ?? ""),
        },
        Active: true,
      };

      const UserData: UserDataEntity = {
        Uid: Crypt0.C1pt0(googleAuth?.user?.uid),
        User: {
          NickName: Crypt0.C1pt0(googleAuth?.user?.displayName ?? ""),
          Email: Crypt0.C1pt0(googleAuth?.user?.email ?? ""),
        },
        Img: {
          ImgUser: googleAuth?.user?.photoURL,
        },
        Privileges: {
          Aplications: [],
          ProfileId: Crypt0.C1pt0(ENV?.VAR_PROFILE ?? ""),
        },
        Metadata: {
          CreationTime: new Date(),
          LastSignInTime: new Date(),
        },
        Online: false,
        Active: true,
      };

      await Promise.all([
        GenericFirebaseService.SetAddDocumentId(
          googleAuth?.user?.uid,
          "BasicData",
          BasicData
        ),
        GenericFirebaseService.SetAddDocumentId(
          ENV?.VAR_USERS ?? "",
          googleAuth?.user?.uid,
          UserData
        ),
      ]);
    }

    return {
      success: true,
      message: cMessage,
      data: googleAuth,
      code: 200,
    };
  } catch (e: any) {
    switch (e.code) {
      case "auth/user-not-found":
        cMessage = "Usuario no encontrado. Verifica tus credenciales.";
        break;
      case "auth/invalid-credential":
        cMessage = "Credenciales Invalidas.";
        break;
      case "auth/wrong-password":
        cMessage = "Contraseña incorrecta. Inténtalo de nuevo.";
        break;
      case "auth/invalid-email":
        cMessage = "Correo electrónico inválido. Ingresa un correo válido.";
        break;
      case "auth/too-many-requests":
        cMessage =
          "Demasiados intentos fallidos. Por favor, intenta nuevamente más tarde.";
        break;
      default:
        cMessage = "Error desconocido";
        break;
    }

    new FragmentStorage().SetValue(
      Crypt0.C1pt0ToHex("Session"),
      JSON.stringify({
        lVal: false,
      })
    );

    return {
      success: false,
      message: cMessage,
      code: 400,
    };
  }
}

export async function ResetPassFn(
  body: IAuth.NsAuthRequest
): Promise<IAuth.NsAuthResponse> {
  let cMessage: string =
    "Se ha enviado un enlace para que resetees tu contraseña.";

  if (body.Email.trim().length === 0) {
    return {
      success: false,
      message: "Debe ingresar una dirección de correo electrónico.",
      code: 400,
    };
  }

  try {
    await sendPasswordResetEmail(auth, body.Email);

    return {
      success: true,
      message: cMessage,
      code: 200,
    };
  } catch (e: any) {
    switch (e.code) {
      case "auth/invalid-credential":
        cMessage = "Credenciales Invalidas.";
        break;
      case "auth/invalid-email":
        cMessage = "Correo electrónico inválido. Ingresa un correo válido.";
        break;
      case "auth/too-many-requests":
        cMessage =
          "Demasiados intentos fallidos. Por favor, intenta nuevamente más tarde.";
        break;
      default:
        cMessage = "Error desconocido";
        break;
    }

    return {
      success: false,
      message: cMessage,
      code: 400,
    };
  }
}

export async function GetStateAuthFn(): Promise<IAuth.NsAuthResponse> {
  let cMessage: string = "No Autenticado.";
  let lSuccess: boolean = false;
  let user: any;

  try {
    if (!ValidateLocalStorageFn()) {
      await signOut(auth);
      return {
        success: false,
        message: cMessage,
        code: 400,
      };
    }

    await new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        user = currentUser;
        if (currentUser) {
          lSuccess = true;
          cMessage = "¡Bienvenido!";
        } else {
          cMessage = "¡Tiempo Excedido!";
        }
        unsubscribe();
        resolve();
      });
    });

    let Session = new FragmentStorage().GetValueJSON(
      Crypt0.C1pt0ToHex("Session")
    );

    new FragmentStorage().SetValue(
      Crypt0.C1pt0ToHex("Firma"),
      JSON.stringify({
        usid: Crypt0.C1pt0ToHex(user?.uid),
        kyid:
          Session?.kyid?.substring(0, 5) +
          Crypt0.C1pt0ToHex(user?.uid).substring(0, 5) +
          Crypt0.C1pt0ToHex(ENV?.CPRT ?? "").substring(0, 5),
      })
    );

    return {
      success: lSuccess,
      message: cMessage,
      code: 200,
    };
  } catch (e: any) {
    switch (e.code) {
      case "auth/network-request-failed":
        cMessage = "Error de red";
        break;
      case "auth/too-many-requests":
        cMessage = "Demasiadas solicitudes";
        break;
      case "auth/internal-error":
        cMessage = "Error interno de Firebase";
        break;
      default:
        cMessage = "Error desconocido";
        break;
    }

    return {
      success: false,
      message: cMessage,
      code: 400,
    };
  }
}

export async function ReAuthenticateFn(
  body: IAuth.NsAuthRequest
): Promise<boolean> {
  const user = auth.currentUser;

  if (!user) {
    return false;
  }

  try {
    const credential = EmailAuthProvider.credential(
      body.Email,
      body.Password ?? ""
    );

    await reauthenticateWithCredential(user, credential);

    return true;
  } catch (e: any) {
    return false;
  }
}

export async function LogoutFn(): Promise<IAuth.NsAuthResponse> {
  let cMessage: string = "Logout satisfactorio!";

  try {
    await signOut(auth);

    localStorage.clear();

    if (!(await new InitUseCase().ClearInit())) {
      throw new Error("Failed to clear init");
    }

    return {
      success: true,
      message: cMessage,
      code: 200,
    };
  } catch (e: any) {
    console.log(e.message);

    return {
      success: false,
      message: cMessage,
      code: 400,
    };
  }
}

export function ValidateLocalStorageFn(): boolean {
  let item: any;
  try {
    if (localStorage.length === 0) {
      throw new Error();
    } else {
      item = new FragmentStorage().GetValueJSON(Crypt0.C1pt0ToHex("Session"));
      if (item?.lVal === true) {
        return true;
      }
    }
  } catch (e: any) {
    new FragmentStorage().SetValue(
      Crypt0.C1pt0ToHex("Session"),
      JSON.stringify({
        lVal: false,
      })
    );
  }
  return false;
}
