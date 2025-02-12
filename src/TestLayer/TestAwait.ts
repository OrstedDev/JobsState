import { ConfigUseCase } from "../DataLayer/UseCases/Aplications/Internal/Configuration/ConfigUseCase";
import { ConfigEntity } from "../DomainLayer/Models/Aplication/Modules/Internal/Configuration/ConfigEntity";

export const TestAwait = async (): Promise<void> => {
  //console.clear();

  const config = new ConfigUseCase();

  const items: Array<ConfigEntity> = [
    {
      Id: "HEAD",
      Body: "BODY",
      Update: true,
    },
  ];

  await config.Set(items);

  console.log("HOLA", (await config.Get()).data);
};
