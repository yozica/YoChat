import io, { Socket } from "socket.io-client";
import lzString from "lz-string";
import router from "@/router";
import { useChatroomStore } from "@/store";
import type { ChatCacheType } from "@/types/chat";
import type { NaiveWindow, ResType } from "@/types/common";

const chatroomStore = useChatroomStore();

// 配置自动重连选项
const baseURL = "http://192.168.2.100:8080";
// const baseURL = "https://www.yozica.top:8080";
const socket: Socket = io(baseURL, {
  reconnection: true, // 启用自动重连
  reconnectionAttempts: 10, // 最大重连次数
  reconnectionDelay: 1000, // 每次重连间隔时间（毫秒）
  reconnectionDelayMax: 5000, // 最大重连间隔时间（毫秒）
  randomizationFactor: 0.5, // 重连间隔时间的随机化因子,
  timeout: 20000 // 连接超时时间（毫秒）
});

// 监听连接事件
socket.on("connect", () => {
  console.log("连接成功");
  setTimeout(() => {
    chatroomStore.state.initState();
    chatroomStore.state.connected = true;
  }, 500);
});

// 监听连接失败事件
socket.on("connect_error", (err) => {
  console.error("连接失败:", err);
  chatroomStore.state.connectError = true;
  if (chatroomStore.state.errorToReconnectTimes < 10) {
    chatroomStore.state.errorToReconnectTimes++;
  } else {
    chatroomStore.state.connectTimeout = true;
  }
});

// 监听连接超时事件
socket.on("connect_timeout", () => {
  console.warn("连接超时");
  chatroomStore.state.connectTimeout = true;
});

// 监听重连尝试事件
socket.on("reconnect_attempt", (attempt) => {
  console.log(`重连尝试第 ${attempt} 次`);
});

// 监听重连成功事件
socket.on("reconnect", (attempt) => {
  console.log(`重连成功，第 ${attempt} 次`);
});

// 监听重连失败事件
socket.on("reconnect_failed", () => {
  console.log("重连失败");
});

/* 以下为自定义事件 */

// 用户创建聊天室后服务端返回信息 - onCreateRoomRes
socket.on(
  "onCreateRoomRes",
  (
    res: ResType<{
      clientId: string;
      nickname: string;
      roomNumber: string;
      chatCache: ChatCacheType[];
    }>
  ) => {
    if (res.code !== 200) {
      (window as NaiveWindow).$message.error(res.desc);
      return;
    }
    chatroomStore.userInfo = {
      clientId: res.data.clientId,
      nickname: res.data.nickname,
      roomNumber: res.data.roomNumber
    };
    chatroomStore.chatCache = res.data.chatCache;
    chatroomStore.roomMembers.add(res.data.nickname);
    const userinfo = lzString.compressToBase64(
      JSON.stringify({
        nickname: res.data.nickname,
        roomNumber: res.data.roomNumber
      })
    );
    sessionStorage.setItem("userinfo", userinfo);
    router.push(`/chatroom`);
  }
);

// 用户加入聊天室后服务端返回信息 - onJoinRoomRes
socket.on(
  "onJoinRoomRes",
  (
    res: ResType<{
      clientId: string;
      nickname: string;
      roomNumber: string;
      chatCache: ChatCacheType[];
    }>
  ) => {
    if (res.code !== 200) {
      (window as NaiveWindow).$message.error(res.desc);
      router.replace("/");
      return;
    }
    chatroomStore.userInfo = {
      clientId: res.data.clientId,
      nickname: res.data.nickname,
      roomNumber: res.data.roomNumber
    };
    chatroomStore.chatCache = res.data.chatCache;
    chatroomStore.roomMembers.add(res.data.nickname);
    res.data.chatCache.forEach((item) => {
      if (
        item.type === "userAction" &&
        (item.data === "创建了聊天室" || item.data === "加入了聊天室")
      ) {
        chatroomStore.roomMembers.add(item.nickname);
      } else if (item.type === "userAction" && item.data === "离开了聊天室") {
        chatroomStore.roomMembers.delete(item.nickname);
      }
    });
    const userinfo = lzString.compressToBase64(
      JSON.stringify({
        nickname: res.data.nickname,
        roomNumber: res.data.roomNumber
      })
    );
    sessionStorage.setItem("userinfo", userinfo);
    router.replace(`/chatroom`);
  }
);

// 有新的成员加入聊天室 - onNewUserJoin
socket.on("onNewUserJoin", (res: ResType<ChatCacheType>) => {
  chatroomStore.chatCache.push(res.data);
  chatroomStore.roomMembers.add(res.data.nickname);
});

// 有成员离开聊天室 - onUserOff
socket.on("onUserOff", (res: ResType<ChatCacheType>) => {
  chatroomStore.chatCache.push(res.data);
  chatroomStore.roomMembers.delete(res.data.nickname);
});

// 接收其他成员发来的消息
socket.on("receiveClientMessageRes", (res: ResType<ChatCacheType>) => {
  chatroomStore.chatCache.push(res.data);
});

// 自己发送的消息确认发出成功
socket.on("confirmSendMessageOK", (res: ResType<ChatCacheType>) => {
  if (res.code !== 200) {
    (window as NaiveWindow).$message.error(res.desc);
    chatroomStore.sending = false;
    return;
  }
  const item = chatroomStore.chatCache.find((item) => item.id === Number.MAX_VALUE);
  if (item) {
    item.id = res.data.id;
    item.time = res.data.time;
  }
  chatroomStore.sending = false;
});

export default socket;
