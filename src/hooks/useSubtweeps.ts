import { FirebaseError } from "firebase/app";
import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";

import { getSubTweeps } from "../api/tweep";
import { Tweep, UseTweepState } from "../types/Tweep";

const defaultState = () => ({
  pages: {},
  lastTweep: null,
  loading: false,
});

const useSubtweeps = () => {
  const [store, setStore] = createStore<UseTweepState>(defaultState());
  const [page, setPage] = createSignal(1);

  const loadTweeps = async (tweepLookup: string) => {
    const _page = page();

    if (_page > 1 && !store.lastTweep) {
      return;
    }

    setStore("loading", true);
    try {
      const { tweeps, lastTweep } = await getSubTweeps(tweepLookup, store.lastTweep);

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

  const resetPagination = () => {
    setStore(
      produce((store) => {
        for (let i = 1; i <= page(); i++) {
          store.pages[i] = {
            tweeps: [],
          };
        }

        store.lastTweep = null;
      })
    );

    setPage(1);
  };

  return {
    store,
    loadTweeps,
    page,
    addTweep,
    resetPagination,
  };
};

export default useSubtweeps;
