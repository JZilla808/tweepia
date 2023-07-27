import {
  DocumentReference,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";

import { User } from "./User";

export interface Tweep {
  id: string;
  lookup?: string;
  mediaUrl?: string;
  uid: string;
  content: string;
  user: Partial<User> | DocumentReference;
  likesCount: number;
  subtweepsCount: number;
  date: Timestamp;
}

export type UserTweep = {
  lookup: DocumentReference;
};

export type UseTweepState = {
  pages: {
    [key: string]: { tweeps: Tweep[] };
  };
  loading: boolean;
  lastTweep: QueryDocumentSnapshot | null;
};
