import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const COL = 'users';

export async function createUserProfile({ uid, name, email, address }) {
  await setDoc(doc(db, COL, uid), {
    uid,
    name,
    email,
    address,
    createdAt: serverTimestamp(),
  });
}

export async function fetchUserProfile(uid) {
  const snap = await getDoc(doc(db, COL, uid));
  if (!snap.exists()) return null;
  return snap.data();
}

export async function updateUserProfile(uid, { name, address }) {
  await setDoc(doc(db, COL, uid), { name, address }, { merge: true });
}

export async function deleteUserProfile(uid) {
  await deleteDoc(doc(db, COL, uid));
}
