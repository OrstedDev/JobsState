import { ENV } from "../../../../EnvConfig";
import { IResumeBuilder } from "../../../../DomainLayer/Interfaces/Aplication/ResumeBuilder/IResumeBuilder";
import { FragmentStorage } from "../../../../UtilitiesLayer/Library/FragmentStorage";
import GenericFirebaseService from "../../../../InfraestructureLayer/Firebase/GenericFirebaseService";

export async function SetImgInstitutionFn(
  data: IResumeBuilder.NsImgExperience
): Promise<string> {
  try {
    const DtVl = new FragmentStorage().GetValue("Rcto");

    const res = await GenericFirebaseService.UploadFileBlob(
      data?.blob,
      (DtVl ? JSON.parse(DtVl)?.id : "") + "/Experience/" + data?.name
    );

    return res;
  } catch (e: any) {
    return "Error en la carga...";
  }
}

export async function SetExperienceFn(
  data: IResumeBuilder.NsExperienceIn
): Promise<IResumeBuilder.NsResponse> {
  try {
    const UsrDt = new FragmentStorage().GetValue("Rcto");

    await GenericFirebaseService.SetAddDocument(
      (UsrDt ? JSON.parse(UsrDt)?.id : "") + "Experience",
      data
    );

    return {
      code: 200,
      success: true,
      message: "Registro satisfactorio",
    };
  } catch (e: any) {
    return {
      code: 500,
      success: false,
      message: "Error al registrar",
    };
  }
}

export async function GetAllExperienceFn(): Promise<IResumeBuilder.NsResponse> {
  try {
    const UsrDt = new FragmentStorage().GetValue("Rcto");

    let objData = await GenericFirebaseService.GetAllDocuments(
      (UsrDt ? JSON.parse(UsrDt)?.id : "") + "Experience"
    );

    return {
      code: 200,
      success: true,
      data: objData.sort((a, b) => {
        return a?.data?.dateOut - b?.data?.dateOut;
      }),
      message: "Satisfactorio",
    };
  } catch (e: any) {
    return {
      code: 500,
      success: false,
      message: "Error desconocido...",
    };
  }
}

export async function DeleteExperienceFn(id: string): Promise<boolean> {
  try {
    await GenericFirebaseService.SetDeleteDocument(ENV?.BASE ?? "", id);

    return true;
  } catch (e: any) {
    return false;
  }
}
