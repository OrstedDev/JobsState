import Dictionary from "../../../../../UtilitiesLayer/Structures/Dictionary";
import ListObject from "../../../../../UtilitiesLayer/Structures/ListObject";
import AplicationUseCase from "../Configuration/AplicationUseCase";
import { CatalogEntity } from "../../../../../DomainLayer/Models/Aplication/Modules/Internal/Configuration/CatalogEntity";
import { Crypt0 } from "../../../../../UtilitiesLayer/Library/C1p70";

//========================================================================
// MENU APLICATIONS
//========================================================================

export const MenuUser = new AplicationUseCase();
export const RoutesUser = new ListObject<{ Name: string; Value: string, Route: string }>();
export const DomainUser = new ListObject<{ Name: string; Value: string }>();
export const EndPointUser = new ListObject<{
  Name: string;
  Value: string;
  Protocol: string;
}>();

//========================================================================
// CATALOGS
//========================================================================

export const GlobalCatalogName = new Dictionary<string>();
export const GlobalCatalogItems = new Dictionary<Array<CatalogEntity>>();

//========================================================================
// CRYPTO
//========================================================================

export const GlobalCryptKeys = new Dictionary<string>();
export const GlobalCryptCollect = new Dictionary<string>();
export const GlobalCryptStoragName = new Dictionary<string>();
export const GlobalCryptRoutes = new Dictionary<string>();

//========================================================================
// GETTERS
//========================================================================

export const GetGlobalCatalogName = (name: string): string => {
  return Crypt0.DC1pt0(GlobalCatalogName.get(Crypt0.C1pt0(name)) ?? "");
};

export const GetGlobalCatalogItems = (name: string): Array<CatalogEntity> => {
  return GlobalCatalogItems.get(Crypt0.C1pt0(name)) ?? [];
};

export const GetGlobalCryptKeys = (name: string): string => {
  return Crypt0.DC1pt0(GlobalCryptKeys.get(Crypt0.C1pt0(name)) ?? "");
};

export const GetGlobalCryptCollect = (name: string): string => {
  return Crypt0.DC1pt0(GlobalCryptCollect.get(Crypt0.C1pt0(name)) ?? "");
};

export const GetGlobalCryptStoragName = (name: string): string => {
  return Crypt0.DC1pt0(GlobalCryptStoragName.get(Crypt0.C1pt0(name)) ?? "");
};

export const GetGlobalCryptRoutes = (name: string): string => {
  return Crypt0.DC1pt0(GlobalCryptRoutes.get(Crypt0.C1pt0(name)) ?? "");
};
