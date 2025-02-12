import { db, storage } from "./FirebaseClient";
import {
  collection,
  collectionGroup,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  DocumentSnapshot,
} from "firebase/firestore/lite";
import {
  IFirebaseService,
  IDocumentData,
} from "../../DomainLayer/Interfaces/Protocols/IFirebase";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

const GenericFirebaseService: IFirebaseService = {
  async GetDocumentById(
    cCollection: string,
    id: string
  ): Promise<DocumentSnapshot | null> {
    try {
      const docRef = doc(db, cCollection, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap;
      } else {
        console.log("No se encontró el documento con el ID especificado.");
        return null;
      }
    } catch (error) {
      console.error("Error al buscar el documento por ID:", error);
      return null;
    }
  },

  async GetAllDocuments(cCollection: string): Promise<IDocumentData[]> {
    try {
      const docData = await getDocs(query(collectionGroup(db, cCollection)));
      return docData.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
    } catch (error) {
      console.error("Error al buscar el documento:", error);
      return [];
    }
  },

  async GetAllFillDocuments(
    cCollection: string,
    fieldPath: string,
    opStr: any,
    value: any
  ): Promise<IDocumentData[]> {
    try {
      const docData = await getDocs(
        query(collection(db, cCollection), where(fieldPath, opStr, value))
      );
      return docData.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
    } catch (error) {
      console.error("Error al buscar el documento:", error);
      return [];
    }
  },

  async GetMaxValue(
    collectionName: string,
    fieldName: string
  ): Promise<number | null> {
    try {
      const q = query(
        collection(db, collectionName),
        orderBy(fieldName, "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();

      if (data && typeof data[fieldName] === "number") {
        return data[fieldName];
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el valor más alto:", error);
      return null;
    }
  },

  async SetAddDocument(cCollection: string, data: any): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, cCollection), data);
      return docRef.id;
    } catch (error) {
      console.error("Error al insertar el documento:", error);
      return "";
    }
  },

  async SetAddDocumentId(
    cCollection: string,
    customDocId: string,
    data: any
  ): Promise<string> {
    try {
      const docRef = doc(db, cCollection, customDocId);
      await setDoc(docRef, data);

      return docRef.id;
    } catch (error) {
      console.error("Error al insertar el documento:", error);
      return "";
    }
  },

  async updateDocumentFields(
    cCollection: string,
    docId: string,
    fieldsToUpdate: Record<string, any>
  ): Promise<void> {
    try {
      const docRef = doc(db, cCollection, docId);
      await updateDoc(docRef, fieldsToUpdate);
    } catch (error) {
      console.error("Error al actualizar los campos:", error);
    }
  },

  async SetUpdateDocument(
    cCollection: string,
    id: string,
    data: any
  ): Promise<void> {
    try {
      await updateDoc(doc(db, cCollection, id), data);
    } catch (error) {
      console.error("Error al Actualizar el documento:", error);
    }
  },

  async SetDeleteDocument(cCollection: string, id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, cCollection, id));
    } catch (error) {
      console.error("Error al Eliminar el documento:", error);
    }
  },

  //=================================
  // STORAGE
  //=================================

  async UploadFileBlob(file: any, route: string): Promise<string> {
    try {
      const storageRef = ref(storage, route);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error:", error);
    }
    return "error";
  },

  async DeleteFileBlob(route: string): Promise<boolean> {
    try {
      const storageRef = ref(storage, route);
      await deleteObject(storageRef);
      return true; // Indica que se eliminó correctamente
    } catch (error) {
      console.error("Error deleting file:", error);
      return false; // Indica que ocurrió un error al eliminar
    }
  },
};

export default GenericFirebaseService;
