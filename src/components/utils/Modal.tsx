import { Component, createEffect, createSignal, Setter, Show } from "solid-js";
import { Portal } from "solid-js/web";

type ModalProps = {
  setIsOpen: Setter<boolean>;
};

type Props = {
  openComponent: Component<ModalProps>;
  children: Component<ModalProps>;
};

const Modal: Component<Props> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);

  let modalRef: HTMLDivElement;

  createEffect(() => {
    isOpen() ? disableScroll() : enableScroll();
  });

  const enableScroll = () => {
    document.body.classList.remove("no-scroll");
  };

  const disableScroll = () => {
    document.body.classList.add("no-scroll");
  };

  return (
    <>
      <props.openComponent setIsOpen={setIsOpen} />
      <Show when={isOpen()}>
        <Portal>
          <div
            onClick={(e) => {
              if (!modalRef.contains(e.target)) {
                setIsOpen(false);
              }
            }}
            class="openModal"
          >
            <div
              ref={modalRef!}
              class="modal fixed min-w-160 top-14 left-2/4 p-8 -translate-x-1/2 rounded-2xl"
            >
              {props.children({ setIsOpen })}
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
};

export default Modal;
