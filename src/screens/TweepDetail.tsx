import { FaSolidArrowLeft } from "solid-icons/fa";
import { createEffect, createResource, Show } from "solid-js";

import { useParams } from "@solidjs/router";

import { getTweepById } from "../api/tweep";
import MainLayout from "../components/layouts/Main";
import PaginatedTweeps from "../components/tweeps/PaginatedTweeps";
import TweepPost from "../components/tweeps/TweepPost";
import { CenteredDataLoader } from "../components/utils/DataLoader";
import Messenger from "../components/utils/Messenger";
import { usePersistence } from "../context/persistence";
import useSubtweeps from "../hooks/useSubtweeps";
import { Tweep } from "../types/Tweep";
import { User } from "../types/User";

const TweepDetail = () => {
  const params = useParams();
  const persistence = usePersistence()!;

  const onTweepLoaded = (tweep: Tweep) => {
    resetPagination();
    loadTweeps(tweep.lookup!);
  };

  const [data, { mutate, refetch }] = createResource(async () => {
    const tweep = await persistence.useRevalidate(
      `selectedTweep-${params.id}`,
      () => getTweepById(params.id, params.uid),
      (latestTweep) => {
        mutate(latestTweep);
      }
    );

    onTweepLoaded(tweep);
    return tweep;
  });
  const { store, page, loadTweeps, addTweep, resetPagination } = useSubtweeps();
  const user = () => data()?.user as User;

  createEffect(() => {
    if (!data.loading && data()?.id !== params.id) {
      refetch();
    }
  });

  const onTweepAdded = (newTweep?: Tweep) => {
    const tweep = data()!;
    const tweepWithNewCount = {
      ...tweep,
      subtweepsCount: tweep.subtweepsCount + 1,
    };

    mutate(tweepWithNewCount);
    persistence.setValue(`selectedTweep-${tweep.id}`, tweepWithNewCount);

    addTweep(newTweep);
  };

  return (
    <MainLayout
      onTweepAdded={onTweepAdded}
      selectedTweep={data()}
      pageTitle={
        <div onClick={() => history.back()}>
          <div class="flex-it flex-row items-center text-xl cursor-pointer">
            <FaSolidArrowLeft fill="white" />
            <div class="ml-5 font-bold">Back</div>
          </div>
        </div>
      }
    >
      <Show when={!data.loading} fallback={<CenteredDataLoader />}>
        <TweepPost tweep={data()!} />
        <div class="p-4 border-b-1 border-solid border-gray-700">
          <div class="text-sm italic text-gray-300 underline mb-2 ml-4">
            Tweep your reply to {user().nickName}
          </div>
          <Messenger
            replyTo={data()?.lookup}
            showAvatar={false}
            onTweepAdded={onTweepAdded}
          />
        </div>
        <PaginatedTweeps
          page={page}
          pages={store.pages}
          loading={store.loading}
          loadMoreTweeps={() => {
            const lookup = data()?.lookup!;
            return loadTweeps(lookup);
          }}
        />
      </Show>
    </MainLayout>
  );
};

export default TweepDetail;
