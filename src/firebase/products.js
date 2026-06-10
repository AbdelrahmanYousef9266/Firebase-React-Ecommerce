import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const COL = 'products';

export async function fetchAllProducts() {
  console.time('FETCH_PRODUCTS');
  try {
    const snap = await getDocs(collection(db, COL));
    console.timeEnd('FETCH_PRODUCTS');
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.timeEnd('FETCH_PRODUCTS');
    throw err;
  }
}

export async function fetchProduct(id) {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) throw new Error('Product not found');
  return { id: snap.id, ...snap.data() };
}

export async function addProduct(data) {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(id, data) {
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, COL, id));
}
