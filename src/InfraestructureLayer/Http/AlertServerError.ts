import { HttpStatusCodeEnum } from "../../DomainLayer/Models/Protocols/HttpClientEntity";
import AlertComponent from "../../PresentationLayer/GenericComponents/Alerts/AlertComponent";

export default class AlertServerError {
  AlertStatusCode(statusCode: HttpStatusCodeEnum): void {
    switch (statusCode) {
      case HttpStatusCodeEnum.ok:
        //Alertas("success", "Code " + HttpStatusCode.ok + ": Success.");
        break;
      case HttpStatusCodeEnum.noContent:
        AlertComponent(
          "error",
          "Error " + HttpStatusCodeEnum.noContent + ": Sin Contenido."
        );
        break;
      case HttpStatusCodeEnum.badRequest:
        AlertComponent(
          "error",
          "Error " + HttpStatusCodeEnum.badRequest + ": Solicitud Incorrecta."
        );
        break;
      case HttpStatusCodeEnum.unauthorized:
        AlertComponent(
          "error",
          "Error " + HttpStatusCodeEnum.unauthorized + ": No autorizado."
        );
        break;
      case HttpStatusCodeEnum.forbidden:
        AlertComponent(
          "error",
          "Error " + HttpStatusCodeEnum.forbidden + ": Prohibido."
        );
        break;
      case HttpStatusCodeEnum.notFound:
        AlertComponent(
          "error",
          "Error " + HttpStatusCodeEnum.notFound + ": No Encontrado."
        );
        break;
      case HttpStatusCodeEnum.serverError:
        AlertComponent(
          "error",
          "Error " + HttpStatusCodeEnum.serverError + ": Error de servidor."
        );
        break;
      default:
        AlertComponent("error", "Error de Servidor: Inesperado.");
    }
  }
}
