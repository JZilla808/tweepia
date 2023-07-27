import { TbProgressBolt } from "solid-icons/tb";

import MainLayout from "../components/layouts/Main";

const ComingSoonScreen = () => {
  return (
    <MainLayout
      onTweepAdded={() => {}}
      pageTitle={<div>{/* <span>Coming Soon</span> */}</div>}
    >
      <div class="flex-it text-center">
        <h1 class="text-2xl font-bold">Coming Soon!</h1>

        <p class="mt-4 p-6 text-gray-400">
          This page is a placeholder for planned future content. Please check
          back later as we build out additional app features.
        </p>

        <div class="mx-auto mt-8">
          <TbProgressBolt size={60} />
        </div>
      </div>
    </MainLayout>
  );
};

export default ComingSoonScreen;
