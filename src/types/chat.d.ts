export interface ChatCacheType {
  id: number;
  clientId: string;
  nickname: string;
  type: "text" | "userAction" | "videoAction";
  data: string;
  time: string;
}
