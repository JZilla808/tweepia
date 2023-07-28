import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { db } from "../db";
import { UploadImage } from "../types/Form";
import { Tweep, UserTweep } from "../types/Tweep";
import { User } from "../types/User";

const uploadImage = async (image: UploadImage) => {
  const storage = getStorage();
  const storageRef = ref(storage, image.name);

  const uploadResult = await uploadBytes(storageRef, image.buffer);
  const downloadUrl = await getDownloadURL(uploadResult.ref);

  return downloadUrl;
};

const getTweepById = async (id: string, uid: string) => {
  const userDocRef = doc(db, "users", uid);
  const userTweepRef = doc(userDocRef, "tweeps", id);

  const userTweepSnap = await getDoc(userTweepRef);
  const userTweep = userTweepSnap.data() as UserTweep;
  const tweepSnap = await getDoc(userTweep.lookup);

  const userDocSnap = await getDoc(userDocRef);

  const tweep = {
    ...tweepSnap.data(),
    user: userDocSnap.data(),
    id: tweepSnap.id,
    lookup: tweepSnap.ref.path,
  } as Tweep;

  return tweep;
};

const getTweeps = async (
  loggedInUser: User,
  lastTweep: QueryDocumentSnapshot | null
) => {
  const _loggedInUserDoc = doc(db, "users", loggedInUser.uid);
  const constraints: QueryConstraint[] = [orderBy("date", "desc"), limit(10)];

  if (loggedInUser.following.length > 0) {
    constraints.push(
      where("user", "in", [...loggedInUser.following, _loggedInUserDoc])
    );
  } else {
    constraints.push(where("user", "==", _loggedInUserDoc));
  }

  if (!!lastTweep) {
    constraints.push(startAfter(lastTweep));
  }

  const q = query(collection(db, "tweeps"), ...constraints);

  const qSnapshot = await getDocs(q);
  const _lastTweep = qSnapshot.docs[qSnapshot.docs.length - 1];

  const tweeps = await Promise.all(
    qSnapshot.docs.map(async (doc) => {
      const tweep = doc.data() as Tweep;
      const userSnap = await getDoc(tweep.user as DocumentReference);

      tweep.user = userSnap.data() as User;

      return { ...tweep, id: doc.id, lookup: doc.ref.path };
    })
  );

  return { tweeps, lastTweep: _lastTweep };
};

const getSubTweeps = async (
  tweepLookup: string,
  lastTweep: QueryDocumentSnapshot | null
) => {
  const ref = doc(db, tweepLookup);
  const _collection = collection(ref, "tweeps");

  const constraints: QueryConstraint[] = [orderBy("date", "desc"), limit(10)];

  if (lastTweep !== null) {
    constraints.push(startAfter(lastTweep));
  }

  const q = query(_collection, ...constraints);

  const qSnapshot = await getDocs(q);
  const _lastTweep = qSnapshot.docs[qSnapshot.docs.length - 1];

  const tweeps = await Promise.all(
    qSnapshot.docs.map(async (doc) => {
      const tweep = doc.data() as Tweep;
      const userSnap = await getDoc(tweep.user as DocumentReference);

      tweep.user = userSnap.data() as User;

      return { ...tweep, id: doc.id, lookup: doc.ref.path };
    })
  );

  return {
    tweeps,
    lastTweep: _lastTweep,
  };
};

const subscribeToTweeps = (
  loggedInUser: User,
  getCallback: (t: Tweep[]) => void
) => {
  const _collection = collection(db, "tweeps");

  const constraints = [
    where("date", ">", Timestamp.now()),
    where("user", "in", loggedInUser.following),
  ];

  const q = query(_collection, ...constraints);

  return onSnapshot(q, async (querySnapshot) => {
    const tweeps = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const tweep = doc.data() as Tweep;
        const userSnap = await getDoc(tweep.user as DocumentReference);
        tweep.user = userSnap.data() as User;
        return { ...tweep, id: doc.id, lookup: doc.ref.path };
      })
    );

    getCallback(tweeps);
  });
};

const getTweepCollection = (replyTo?: string) => {
  let tweepCollection;

  if (!!replyTo) {
    const ref = doc(db, replyTo);
    tweepCollection = collection(ref, "tweeps");
  } else {
    tweepCollection = collection(db, "tweeps");
  }

  return tweepCollection;
};

const createTweep = async (
  form: {
    content: string;
    uid: string;
  },
  replyTo?: string
): Promise<Tweep> => {
  const userRef = doc(db, "users", form.uid);
  const tweepCollection = getTweepCollection(replyTo);

  const tweepToStore = {
    ...form,
    user: userRef,
    likesCount: 0,
    subtweepsCount: 0,
    date: Timestamp.now(),
  };

  if (!!replyTo) {
    const ref = doc(db, replyTo);
    await updateDoc(ref, {
      subtweepsCount: increment(1),
    });
  }

  const added = await addDoc(tweepCollection, tweepToStore);

  const userTweepRef = doc(userRef, "tweeps", added.id);
  await setDoc(userTweepRef, { lookup: added });

  return { ...tweepToStore, id: added.id, lookup: added.path };
};

export {
  createTweep,
  getTweeps,
  subscribeToTweeps,
  getTweepById,
  getSubTweeps,
  uploadImage,
};
