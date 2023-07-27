import moment from "moment";
import { AiOutlineMessage } from "solid-icons/ai";
import { FaRegularHeart } from "solid-icons/fa";
import { FiTrash } from "solid-icons/fi";
import { Component, Show, createSignal } from "solid-js";

import { useNavigate } from "@solidjs/router";

import { Tweep } from "../../types/Tweep";
import { User } from "../../types/User";

type Props = {
  tweep: Tweep;
};

const TweepPost: Component<Props> = (props) => {
  const navigate = useNavigate();
  const tweep = () => props.tweep;
  const user = () => tweep().user as User;

  const hasUrl = () => !!tweep().mediaUrl;

  const [isSubtweepsHovered, setIsSubtweepsHovered] = createSignal(false);
  const [isLikesHovered, setIsLikesHovered] = createSignal(false);

  return (
    <div class="flex-it p-4 border-b-1 border-solid border-gray-700">
      <div class="flex-it flex-row">
        <div class="flex-it mr-4">
          <div class="w-12 h-12 overflow-visible cursor-pointer transition duration-200 hover:opacity-80">
            <img class="rounded-full" src={user().avatar}></img>
          </div>
        </div>
        <article
          onClick={() => navigate(`/${tweep().uid}/tweep/${tweep().id}`)}
          class="flex-it flex-grow flex-shrink cursor-pointer"
        >
          <div class="flex-it justify-center flex-grow mb-1">
            <div class="flex-it justify-between flex-row w-full">
              <div>
                <span class="font-bold">{user().nickName}</span>
                <span class="mx-2">&#8226;</span>
                <span class="text-gray-400">
                  {moment(tweep().date.toDate().toISOString()).fromNow()}
                </span>
              </div>
              <div class="text-gray-400 cursor-pointer transition hover:text-red-400">
                <FiTrash size={16} />
              </div>
            </div>
          </div>
          <div class="flex-it flex-row flex-grow-0 items-center mb-2">
            <div class="flex-it mr-3 mb-3 w-full">{tweep().content}</div>
          </div>
          <Show when={hasUrl()}>
            <div class="flex-it max-w-64 pb-6">
              <img src={tweep().mediaUrl} />
            </div>
          </Show>
          <div class="flex-it flex-row flex-grow text-gray-400">
            <div
              class="flex-it flex-row items-center cursor-pointer mr-5 transition hover:text-blue-400"
              onMouseEnter={() => setIsSubtweepsHovered(true)}
              onMouseLeave={() => setIsSubtweepsHovered(false)}
            >
              <AiOutlineMessage
                size={18}
                fill={isSubtweepsHovered() ? "#60A5FA" : "#9CA3AF"}
              />
              <span class="text-xs ml-3">{tweep().subtweepsCount}</span>
            </div>
            <div
              class="flex-it flex-row items-center cursor-pointer transition hover:text-pink-400"
              onMouseEnter={() => setIsLikesHovered(true)}
              onMouseLeave={() => setIsLikesHovered(false)}
            >
              <FaRegularHeart
                size={18}
                fill={isLikesHovered() ? "#F472B6" : "#9CA3AF"}
              />
              <span class="text-xs ml-3">{tweep().likesCount}</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default TweepPost;
