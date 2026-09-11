import { sbSetDoc, sbUpdateDoc, sbDeleteDoc, sbGetDocs, sbGetDoc, sbOnSnapshot } from './supabaseAdapter';

export const db = {};

export function collection(dbRefOrColName: any, colNameArg?: string) {
  const colName = colNameArg ? colNameArg : dbRefOrColName;
  return { colName };
}

export function doc(dbRefOrColName: any, colNameOrDocId?: string, docIdArg?: string) {
  if (docIdArg !== undefined) {
    return { colName: colNameOrDocId, docId: docIdArg };
  } else {
    return { colName: dbRefOrColName, docId: colNameOrDocId };
  }
}

export async function setDoc(docRef: any, data: any) {
  if (docRef && docRef.colName && docRef.docId) {
    await sbSetDoc(docRef.colName, docRef.docId, data);
  }
}

export async function updateDoc(docRef: any, data: any) {
  if (docRef && docRef.colName && docRef.docId) {
    await sbUpdateDoc(docRef.colName, docRef.docId, data);
  }
}

export async function deleteDoc(docRef: any) {
  if (docRef && docRef.colName && docRef.docId) {
    await sbDeleteDoc(docRef.colName, docRef.docId);
  }
}

export async function getDocs(queryRef: any) {
  const colName = queryRef.colName;
  const items = await sbGetDocs(colName);
  return {
    empty: items.length === 0,
    docs: items.map((item: any) => ({
      id: item.id,
      exists: () => true,
      data: () => item
    })),
    forEach: (callback: (docSnap: any) => void) => {
      items.forEach((item: any) => {
        callback({
          id: item.id,
          exists: () => true,
          data: () => item
        });
      });
    }
  };
}

export async function getDoc(docRef: any) {
  const { colName, docId } = docRef;
  const item = await sbGetDoc(colName, docId);
  return {
    exists: () => !!item,
    data: () => item,
    id: docId
  };
}

export function onSnapshot(queryOrDocRef: any, callback: (snapshot: any) => void, errorCallback?: (err: any) => void) {
  const colName = queryOrDocRef.colName;
  return sbOnSnapshot(colName, (items) => {
    const snapshot = {
      empty: items.length === 0,
      docs: items.map((item: any) => ({
        id: item.id,
        exists: () => true,
        data: () => item
      })),
      forEach: (cb: (docSnap: any) => void) => {
        items.forEach((item: any) => {
          cb({
            id: item.id,
            exists: () => true,
            data: () => item
          });
        });
      }
    };
    callback(snapshot);
  });
}

export function query(colRef: any, ...queryConstraints: any[]) {
  return colRef;
}

export function where(...args: any[]) {
  return {};
}

export function limit(...args: any[]) {
  return {};
}

export function orderBy(...args: any[]) {
  return {};
}
