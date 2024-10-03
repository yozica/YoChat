import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useChatroomStore } from "@/store";
import socket from "@/socket";
import lzString from "lz-string";

export const useParams = () => {
  const router = useRouter();
  const chatroomStore = useChatroomStore();

  const params = ref({
    nickname: "",
    roomNumber: ""
  });

  const userinfo = sessionStorage.getItem("userinfo") || "";
  params.value = (JSON.parse(lzString.decompressFromBase64(userinfo)) as {
    nickname: string;
    roomNumber: string;
  }) || {
    nickname: "",
    roomNumber: ""
  };

  if (params.value.roomNumber === "") {
    router.replace("/");
  }

  watch(
    () => chatroomStore.state.connected,
    (newValue) => {
      if (newValue) {
        socket.emit("onJoinRoom", {
          nickname: params.value.nickname,
          roomNumber: params.value.roomNumber
        });
      }
    }
  );

  return { params };
};
