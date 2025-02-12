import { ENV } from "../../../../../EnvConfig";
import GenericFirebaseService from "../../../../../InfraestructureLayer/Firebase/GenericFirebaseService";
import { IJobs } from "../../../../../DomainLayer/Interfaces/Aplication/Example/IJobs";
import { db } from "../../../../../InfraestructureLayer/Firebase/FirebaseClient";
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore/lite";
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
            _Id: item.id,
            state: x?.state,
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

export async function updateJobFn(
  id: string,
  data: Partial<IJobs.NsJobOffer>
): Promise<boolean> {
  try {
    const Firma = new FragmentStorage().GetValueJSON(
      Crypt0.C1pt0ToHex("Firma")
    );

    const docRef = doc(
      db,
      Crypt0.DC1pt0FromHex(Firma.usid) + GetGlobalCryptKeys("Jobs"),
      id
    );

    await updateDoc(docRef, data);

    return true;
  } catch (e: any) {
    return false;
  }
}

export async function deleteJobFn(id: string): Promise<boolean> {
  try {
    const Firma = new FragmentStorage().GetValueJSON(
      Crypt0.C1pt0ToHex("Firma")
    );

    const docRef = doc(
      db,
      Crypt0.DC1pt0FromHex(Firma.usid) + GetGlobalCryptKeys("Jobs"),
      id
    );

    await deleteDoc(docRef);

    return true;
  } catch (e: any) {
    return false;
  }
}

export async function deleteExpiredJobsFn(): Promise<boolean> {
  try {
    const Firma = new FragmentStorage().GetValueJSON(
      Crypt0.C1pt0ToHex("Firma")
    );

    const collectionRef = collection(
      db,
      Crypt0.DC1pt0FromHex(Firma.usid) + GetGlobalCryptKeys("Jobs")
    );

    // Obtener la fecha actual en formato "dd/MM/yyyy"
    const today = new Date();
    const todayFormatted = `${today.getDate().toString().padStart(2, "0")}/${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${today.getFullYear()}`;

    // Consultar los registros con deadline anterior a hoy
    const q = query(collectionRef, where("state", "==", 1));
    const querySnapshot = await getDocs(q);

    const deletePromises: any = [];

    querySnapshot.forEach((docSnap) => {
      const job = docSnap.data();
      if (job.deadline && compareDates(job.deadline, todayFormatted)) {
        deletePromises.push(deleteDoc(docSnap.ref));
      }
    });

    await Promise.all(deletePromises);
    return true;
  } catch (e: any) {
    return false;
  }
}

function compareDates(dateStr: string, todayStr: string): boolean {
  const [day, month, year] = dateStr.split("/").map(Number);
  const [todayDay, todayMonth, todayYear] = todayStr.split("/").map(Number);

  const date = new Date(year, month - 1, day);
  const today = new Date(todayYear, todayMonth - 1, todayDay);

  return date < today;
}
