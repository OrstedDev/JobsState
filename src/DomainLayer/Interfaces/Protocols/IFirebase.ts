import { DocumentSnapshot } from "firebase/firestore/lite";

export interface IDocumentData {
  id: string;
  data: any; // Define la estructura de tus datos
}

export interface IFirebaseService {
  GetDocumentById: (
    collection: string,
    id: string
  ) => Promise<DocumentSnapshot | null>;
  GetAllDocuments: (collection: string) => Promise<IDocumentData[]>;
  GetAllFillDocuments: (
    collection: string,
    fieldPath: string,
    opStr: any,
    value: any
  ) => Promise<IDocumentData[]>;
  SetAddDocument: (collection: string, data: any) => Promise<string>;
  SetAddDocumentId: (
    cCollection: string,
    customDocId: string,
    data: any
  ) => Promise<string>;
  GetMaxValue: (
    collectionName: string,
    fieldName: string
  ) => Promise<number | null>;
  updateDocumentFields: (
    cCollection: string,
    docId: string,
    fieldsToUpdate: Record<string, any>
  ) => Promise<void>;
  SetUpdateDocument: (
    collection: string,
    id: string,
    data: any
  ) => Promise<void>;
  SetDeleteDocument: (collection: string, id: string) => Promise<void>;
  UploadFileBlob: (file: any, route: string) => Promise<string>;
  DeleteFileBlob: (route: string) => Promise<boolean>;
}
