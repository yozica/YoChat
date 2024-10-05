import { ref } from "vue";
import { defineStore } from "pinia";
import type { ChatCacheType } from "@/types/chat";

export const useChatroomStore = defineStore("chatroom", () => {
  // 连接状态，表示客户端是否与服务器建立了连接
  const connected = ref(false);
  const connectError = ref(false);
  const errorToReconnectTimes = ref(0);
  const connectTimeout = ref(false);

  const initState = () => {
    connected.value = false;
    connectError.value = false;
    errorToReconnectTimes.value = 0;
    connectTimeout.value = false;
  };

  const userInfo = ref({
    clientId: "",
    nickname: "",
    roomNumber: ""
  });

  const sending = ref(false);

  const roomMembers = new Set<string>();
  const chatCache = ref<ChatCacheType[]>([]);

  return {
    state: {
      connected,
      connectError,
      errorToReconnectTimes,
      connectTimeout,
      initState
    },
    userInfo,
    sending,
    roomMembers,
    chatCache
  };
});
