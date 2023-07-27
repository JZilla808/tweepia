import { Component } from "solid-js";
import { TbLetterT } from "solid-icons/tb";

type Props = {
  size: number;
};

const Loader: Component<Props> = (props) => {
  return (
    <div class="flex-it text-white justify-center items-center h-full">
      <div class="rotating">
        <TbLetterT size={props.size} />
      </div>
    </div>
  );
};

export default Loader;
