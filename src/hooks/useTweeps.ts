import { FirebaseError } from 'firebase/app';
import { QueryDocumentSnapshot, Unsubscribe } from 'firebase/firestore';
import { createSignal, onMount } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import * as api from '../api/tweep';
import { useAuthState } from '../context/auth';
import { Tweep, UseTweepState } from '../types/Tweep';

type State = UseTweepState & {
  freshTweeps: Tweep[];
};

const createInitState = () => ({
  pages: {},
  loading: false,
  lastTweep: null,
  freshTweeps: [],
});

const useTweeps = () => {
  const { user } = useAuthState()!;
  const [page, setPage] = createSignal(1);
  const [store, setStore] = createStore<State>(createInitState());

  let unSubscribe: Unsubscribe;

  onMount(() => {
    loadTweeps();
  });

  const loadTweeps = async () => {
    const _page = page();

    if (_page > 1 && !store.lastTweep) {
      return;
    }

    setStore("loading", true);
    try {
      const { tweeps, lastTweep } = await api.getTweeps(user!, store.lastTweep);

      if (tweeps.length > 0) {
        setStore(
          produce((store) => {
            store.pages[_page] = { tweeps };
          })
        );

        setPage(_page + 1);
      }

      setStore("lastTweep", lastTweep);
    } catch (error) {
      const message = (error as FirebaseError).message;
      console.log(message);
    } finally {
      setStore("loading", false);
    }
  };

  const subscribeToTweeps = () => {
    if (user?.following.length == 0) {
      return;
    }

    unSubscribe = api.subscribeToTweeps(user!, (freshTweeps: Tweep[]) => {
      setStore("freshTweeps", freshTweeps);
      console.log(store.freshTweeps);
    });
  };

  const unsubscribeFromTweeps = () => {
    if (!!unSubscribe) {
      unSubscribe();
    }
  };

  const resubscribe = () => {
    unsubscribeFromTweeps();
    subscribeToTweeps();
  };

  const addTweep = (tweep: Tweep | undefined) => {
    if (!tweep) return;

    const page = 1;

    setStore(
      produce((store) => {
        if (!store.pages[page]) {
          store.pages[page] = { tweeps: [] };
        }

        store.pages[page].tweeps.unshift({ ...tweep });
      })
    );
  };

  const displayFreshTweeps = () => {
    store.freshTweeps.forEach((freshTweep) => {
      addTweep(freshTweep);
    });

    setStore("freshTweeps", []);
    resubscribe();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    page,
    loadTweeps,
    addTweep,
    store,
    subscribeToTweeps,
    unsubscribeFromTweeps,
    displayFreshTweeps,
  };
};

export default useTweeps;
