import { useMessage, useLoadingBar } from "naive-ui";

/* 有关Naive的可能会全局调用类型 */
export type NaiveWindow = {
  $message: ReturnType<typeof useMessage>;
  $loadingBar: ReturnType<typeof useLoadingBar>;
} & typeof window;
/* 有关Naive的可能会全局调用类型 */

/* 统一返回值类型 */
export interface ResType<T> {
  code: 200 | 400 | 401 | 403 | 404;
  desc: string;
  data: T;
}
/* 统一返回值类型 */
