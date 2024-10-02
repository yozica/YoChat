export interface ChatCacheType {
  id: number;
  clientId: string;
  nickname: string;
  type: "text" | "userAction";
  data: string;
  time: string;
}
