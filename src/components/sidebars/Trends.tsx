import { For } from "solid-js";

const randomize = () => Math.floor(Math.random() * 2000);

const trends = [
  {
    category: "Sports",
    content: "Some team won some game!",
    tweepCount: randomize(),
  },
  {
    category: "Finance",
    content: "Apple passes $3 trillion market cap.",
    tweepCount: randomize(),
  },
  {
    category: "PC & Gaming",
    content: "Unreal Engine receives a major update!",
    tweepCount: randomize(),
  },
  {
    category: "Economy",
    content: "The economy is booming!",
    tweepCount: randomize(),
  },
  {
    category: "Celebrities",
    content: "Who's Kim Kardashian dating now?",
    tweepCount: randomize(),
  },
  {
    category: "Movies",
    content: "Top 10 movies for this summer!",
    tweepCount: randomize(),
  },
];

const TrendsSidebar = () => {
  return (
    <div class="bg-gray-800 overflow-hidden flex-it rounded-2xl">
      <div class="flex-it p-4">
        <span class="text-xl font-bold">Trends</span>
      </div>

      <For each={trends}>
        {(trend) => (
          <div class="flex-it p-4 cursor-pointer transition duration-200 hover:bg-gray-700">
            <div class="flex-it">
              <span class="text-gray-400 text-sm">{trend.content}</span>
              <span class="text-lg font-bold">{trend.category}</span>
              <span class="text-gray-400 text-sm">
                {trend.tweepCount} Tweeps
              </span>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export default TrendsSidebar;
