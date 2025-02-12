import { data } from "react-router-dom";
import TreeObject from "../UtilitiesLayer/Structures/TreeObject";
import ListObject from "../UtilitiesLayer/Structures/ListObject";
import { v4 as uuidv4 } from "uuid";

import AplicationUseCase from "../DataLayer/UseCases/Configuration/AplicationUseCase";

import { ConfigUseCase } from "../DataLayer/UseCases/Configuration/ConfigUseCase";

import { CryptoEntity } from "../DomainLayer/Models/Aplication/Modules/Configuration/CryptoEntity";

// type ObjetcEntity = {
//   Key?: string;
//   Value: string;
//   Name?: string;
// };

// type AplicationEntity = ObjetcEntity & {
//   Description?: string;
//   CreatedAt?: Date;
//   IsVisible: boolean;
//   IsEnabled: boolean;
//   ItemValues?: ObjetcEntity[];
// };

// type AplicationGetEntity = AplicationEntity & {
//   Ref: string;
// };

// type AppsEntity = {
//   Key?: string;
//   Value: string; //LA URL
//   Name?: string;

//   Domains?: MdlAppDomains[]; //LISTA CON DOMINIOS
//   Routes?: MdlAppRoutes[]; //LISTA CON RUTAS
//   EndPoints?: MdlAppEndPoints[]; //LISTA CON ENDPOINTS
// };

// type MdlAppRoutes = {
//   Key?: string;
//   Value: string;
//   Name: string;

//   EndPoints?: MdlAppEndPoints[]; //LISTA CON ENDPOINTS
// };

// type MdlAppDomains = {
//   Key?: string;
//   Value: string;
//   Name?: string;
// };

// type MdlAppEndPoints = {
//   Key?: string;
//   Value?: string;
//   Name?: string;

//   KeyDomain?: string;
//   KeyRouter?: string;
//   protocol?: string;
// };

export function Test(): void {
  console.clear();

  const app = new AplicationUseCase(`{
    "name": "0",
    "value": {
      "Key": "0",
      "Value": "APP",
      "IsVisible": false,
      "IsEnabled": true
    },
    "children": [
      {
        "name": "0:c25e4dca-7a4",
        "value": {
          "Key": "c25e4dca-7a4",
          "Value": "ConfigApp",
          "Name": "Configuración de la Aplicación",
          "Description": "Configuración de la Aplicación de OrstedDev",
          "CreatedAt": "2025-01-04T17:31:21.089Z",
          "IsVisible": false,
          "IsEnabled": true,
          "ItemValues": [
            {
              "Key": "3f69f606-546",
              "Value": "https:/photo1",
              "Name": "PhotoURL"
            }
          ]
        },
        "children": [
          {
            "name": "0:c25e4dca-7a4:25d1b645-a96",
            "value": {
              "Key": "25d1b645-a96",
              "Value": "Domains",
              "CreatedAt": "2025-01-04T17:36:02.018Z",
              "IsVisible": false,
              "IsEnabled": true
            },
            "children": [
              {
                "name": "0:c25e4dca-7a4:25d1b645-a96:6f0714e4-c04",
                "value": {
                  "Key": "6f0714e4-c04",
                  "Value": "https://orsteddev.com",
                  "Name": "Dominio Principal",
                  "CreatedAt": "2025-01-04T17:42:25.044Z",
                  "IsVisible": false,
                  "IsEnabled": true
                },
                "children": []
              }
            ]
          },
          {
            "name": "0:c25e4dca-7a4:22370f46-c4b",
            "value": {
              "Key": "22370f46-c4b",
              "Value": "Routers",
              "CreatedAt": "2025-01-04T17:36:02.018Z",
              "IsVisible": false,
              "IsEnabled": true
            },
            "children": [
              {
                "name": "0:c25e4dca-7a4:22370f46-c4b:cb5aca56-cc5",
                "value": {
                  "Key": "cb5aca56-cc5",
                  "Value": "/ConfigApp",
                  "Name": "Centro de configuración",
                  "CreatedAt": "2025-01-04T17:42:25.044Z",
                  "IsVisible": false,
                  "IsEnabled": true
                },
                "children": []
              }
            ]
          }
        ]
      },
      {
        "name": "0:20f1c71f-33e",
        "value": {
          "Key": "20f1c71f-33e",
          "Value": "PersonalApp",
          "Name": "Apps Personales",
          "Description": "Apliaciones Personales de OrstedDev",
          "CreatedAt": "2025-01-04T17:31:21.089Z",
          "IsVisible": true,
          "IsEnabled": true,
          "ItemValues": [
            {
              "Key": "45793666-4ff",
              "Value": "https:/photo2",
              "Name": "PhotoURL"
            }
          ]
        },
        "children": []
      },
      {
        "name": "0:eb12f63b-b0c",
        "value": {
          "Key": "eb12f63b-b0c",
          "Value": "CurriculumApp",
          "Name": "Curriculum",
          "Description": "Curriculum de Axel Marquez",
          "CreatedAt": "2025-01-04T17:31:21.089Z",
          "IsVisible": true,
          "IsEnabled": true,
          "ItemValues": [
            {
              "Key": "37c5f079-654",
              "Value": "https:/photo3",
              "Name": "PhotoURL"
            }
          ]
        },
        "children": []
      }
    ]
  }`);

  //==============================================
  //CREAR APLICACIONES
  //==============================================

  app.add("0", {
    Value: "ConfigApp",
    Name: "Configuración de la Aplicación",
    Description: "Configuración de la Aplicación de OrstedDev",
    IsVisible: false,
    IsEnabled: true,
    ItemValues: [{ Value: "https:/photo1", Name: "PhotoURL" }],
  });

  // app.add("0", {
  //   Value: "PersonalApp",
  //   Name: "Apps Personales",
  //   Description: "Apliaciones Personales de OrstedDev",
  //   IsVisible: true,
  //   IsEnabled: true,
  //   ItemValues: [{ Value: "https:/photo2", Name: "PhotoURL" }],
  // });

  // app.add("0", {
  //   Value: "CurriculumApp",
  //   Name: "Curriculum",
  //   Description: "Curriculum de Axel Marquez",
  //   IsVisible: true,
  //   IsEnabled: true,
  //   ItemValues: [{ Value: "https:/photo3", Name: "PhotoURL" }],
  // });

  //==============================================
  //CREAR ATRIBUTOS INTERNOS APLICACION
  //==============================================

  // app.add("0:c25e4dca-7a4", {
  //   Value: "Domains",
  //   IsVisible: false,
  //   IsEnabled: true,
  // });

  // app.add("0:c25e4dca-7a4", {
  //   Value: "Routers",
  //   IsVisible: false,
  //   IsEnabled: true,
  // });

  //==============================================
  //LLENAR ATRIBUTOS INTERNOS APLICACION
  //==============================================

  // app.add("0:c25e4dca-7a4:25d1b645-a96", {
  //   Value: "https://orsteddev.com",
  //   Name: "Dominio Principal",
  //   IsVisible: false,
  //   IsEnabled: true,
  // });

  // app.add("0:c25e4dca-7a4:22370f46-c4b", {
  //   Value: "/ConfigApp",
  //   Name: "Centro de configuración",
  //   IsVisible: false,
  //   IsEnabled: true,
  // });

  //==============================================
  //CREAR ATRIBUTOS ROUTER
  //==============================================

  // app.add("0:c25e4dca-7a4:22370f46-c4b:cb5aca56-cc5", {
  //   Value: "Endpoints",
  //   IsVisible: false,
  //   IsEnabled: true,
  // });

  // const data = app.get("0");

  // if (data !== null) {
  //   console.log("data", data);
  //   const ItemData = new ListObject<ObjetcEntity>(data.ItemValues);

  //   ItemData.add({ Value: "axel-app", Name: "Axel Ones" });

  //   data.ItemValues = ItemData.getAll();
  //   console.log("data edit", data);

  //   app.edit("0", data);
  // }
  
  console.log(app.getChilldren("0"));

  console.log(app.getChilldren("0:c25e4dca-7a4"));

  console.log(app.getChilldren("0:c25e4dca-7a4:22370f46-c4b"));

  console.log(app.getAllParents("0:c25e4dca-7a4").map((item) => item.Value));

  console.log(app.getToStringJSON());
}
