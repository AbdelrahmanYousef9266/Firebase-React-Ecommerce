import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const COL = 'orders';

export async function createOrder({ userId, userEmail, items, totalItems, totalPrice }) {
  const ref = await addDoc(collection(db, COL), {
    userId,
    userEmail,
    items,
    totalItems,
    totalPrice,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function fetchUserOrders(userId) {
  const q = query(collection(db, COL), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchOrder(id) {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) throw new Error('Order not found');
  return { id: snap.id, ...snap.data() };
}
