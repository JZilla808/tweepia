import { Accessor, Component, For, onCleanup, onMount, Show } from "solid-js";

import { Tweep } from "../../types/Tweep";
import { CenteredDataLoader } from "../utils/DataLoader";
import TweepPost from "./TweepPost";

type Props = {
  page: Accessor<number>;
  pages: {
    [key: string]: { tweeps: Tweep[] };
  };
  loading: boolean;
  loadMoreTweeps: () => Promise<void>;
};

const PaginatedTweeps: Component<Props> = (props) => {
  let lastItemRef: HTMLDivElement;

  onMount(() => {
    window.addEventListener("scroll", loadNewItems);
  });

  onCleanup(() => {
    window.removeEventListener("scroll", loadNewItems);
  });

  const loadNewItems = () => {
    if (lastItemRef.getBoundingClientRect().top <= window.innerHeight) {
      if (!props.loading) {
        props.loadMoreTweeps();
      }
    }
  };

  return (
    <>
      <For each={Array.from({ length: props.page() })}>
        {(_, i) => (
          <For each={props.pages[i() + 1]?.tweeps}>
            {(tweep) => <TweepPost tweep={tweep} />}
          </For>
        )}
      </For>
      <Show when={props.loading}>
        <CenteredDataLoader />
      </Show>

      <Show when={!props.loading && props.pages[1]?.tweeps?.length === 0}>
        <div class="flex-it">
          <div class="bg-yellow-400 mt-6 p-2 rounded-lg mx-4">
            No new tweeps! create a new one!
          </div>
        </div>
      </Show>
      <div ref={lastItemRef!}></div>
      <div class="h-96"></div>
    </>
  );
};

export default PaginatedTweeps;
