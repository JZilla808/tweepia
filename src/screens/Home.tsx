import { Component, onCleanup, onMount, Show } from "solid-js";
import { Portal } from "solid-js/web";

import MainLayout from "../components/layouts/Main";
import PaginatedTweeps from "../components/tweeps/PaginatedTweeps";
import Button from "../components/utils/Button";
import Messenger from "../components/utils/Messenger";
import { usePersistence } from "../context/persistence";
import useTweeps from "../hooks/useTweeps";

const HomeScreen: Component = () => {
  const {
    store,
    addTweep,
    page,
    loadTweeps,
    subscribeToTweeps,
    unsubscribeFromTweeps,
    displayFreshTweeps,
  } = useTweeps();

  onMount(() => {
    subscribeToTweeps();
  });

  onCleanup(() => {
    unsubscribeFromTweeps();
  });

  return (
    <MainLayout pageTitle="Home" onTweepAdded={addTweep}>
      <Messenger onTweepAdded={addTweep} />

      <div class="h-px bg-gray-700 my-1" />
      <Show when={store.freshTweeps.length >= 3}>
        <Portal>
          <div class="fixed top-2 z-100 left-2/4 -translate-x-1/2">
            <Button onClick={displayFreshTweeps}>
              <span>Read New Tweeps</span>
            </Button>
          </div>
        </Portal>
      </Show>
      <PaginatedTweeps
        page={page}
        pages={store.pages}
        loading={store.loading}
        loadMoreTweeps={loadTweeps}
      />
    </MainLayout>
  );
};

export default HomeScreen;
