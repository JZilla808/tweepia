import { FirebaseError } from "firebase/app";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { createTweep, uploadImage } from "../api/tweep";
import { useAuthState } from "../context/auth";
import { useUIDispatch } from "../context/ui";
import { MessengerForm, TweepiaInputEvent, UploadImage } from "../types/Form";

const defaultImage = () => ({
  buffer: new ArrayBuffer(0),
  name: "",
  previewUrl: "",
});

const useMessenger = (replyTo?: string) => {
  const { isAuthenticated, user } = useAuthState()!;
  const { addSnackbar } = useUIDispatch();
  const [image, setImage] = createSignal<UploadImage>(defaultImage());
  const [loading, setLoading] = createSignal(false);
  const [form, setForm] = createStore<MessengerForm>({
    content: "",
  });

  const handleInput = (e: TweepiaInputEvent) => {
    const { name, value } = e.currentTarget;
    setForm(name, value);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      addSnackbar({ message: "You are not authenticated", type: "error" });
      return;
    }

    setLoading(true);

    const tweepForm = {
      ...form,
      uid: user!.uid,
    };

    try {
      if (image().buffer.byteLength > 0) {
        const downloadUrl = await uploadImage(image());
        tweepForm.mediaUrl = downloadUrl;
      }

      const newTweep = await createTweep(tweepForm, replyTo);
      newTweep.user = {
        nickName: user!.nickName,
        avatar: user!.avatar,
      };

      addSnackbar({ message: "Tweep Added!", type: "success" });
      setForm({
        content: "",
      });
      setImage(defaultImage());
      return newTweep;
    } catch (error) {
      const message = (error as FirebaseError).message;
      addSnackbar({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return { handleInput, handleSubmit, form, loading, image, setImage };
};

export default useMessenger;
