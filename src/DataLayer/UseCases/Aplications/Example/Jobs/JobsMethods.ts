import { ENV } from "../../../../../EnvConfig";
import GenericFirebaseService from "../../../../../InfraestructureLayer/Firebase/GenericFirebaseService";
import { IJobs } from "../../../../../DomainLayer/Interfaces/Aplication/Example/IJobs";
import { db } from "../../../../../InfraestructureLayer/Firebase/FirebaseClient";
import { getDocs, collection, addDoc } from "firebase/firestore/lite";
import { Crypt0 } from "../../../../../UtilitiesLayer/Library/C1p70";
import { FragmentStorage } from "../../../../../UtilitiesLayer/Library/FragmentStorage";
import { GetGlobalCryptKeys } from "../../Internal/Initialize/InitData";

export async function insertJobsFn(jobs: IJobs.NsJobOffer[]): Promise<boolean> {
  try {
    const Firma = new FragmentStorage().GetValueJSON(
      Crypt0.C1pt0ToHex("Firma")
    );

    const collectionRef = collection(
      db,
      Crypt0.DC1pt0FromHex(Firma.usid) + GetGlobalCryptKeys("Jobs")
    );

    const insertPromises = jobs.map(async (job) => {
      return addDoc(collectionRef, job);
    });

    await Promise.all(insertPromises);

    return true;
  } catch (e: any) {
    return false;
  }
}

export async function getAllJobsFn(): Promise<IJobs.NsJobOffer[]> {
  try {
    const Firma = new FragmentStorage().GetValueJSON(
      Crypt0.C1pt0ToHex("Firma")
    );

    const users = await getDocs(
      collection(
        db,
        Crypt0.DC1pt0FromHex(Firma.usid) + GetGlobalCryptKeys("Jobs")
      )
    );

    return users != undefined
      ? users.docs.map((item): IJobs.NsJobOffer => {
          const x = item.data();
          return {
            vigent: x?.vigent,
            company: x?.company,
            positions: x?.positions,
            contractType: x?.contractType,
            education: x?.education,
            location: x?.location,
            salary: x?.salary,
            deadline: x?.deadline,
            link: x?.link,
          };
        })
      : [];
  } catch (e: any) {
    return [];
  }
}
