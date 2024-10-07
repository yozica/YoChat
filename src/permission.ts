import router from "./router";
import type { NaiveWindow } from "./types/common";

router.beforeEach(() => {
  const loadingBar = (window as NaiveWindow).$loadingBar;
  loadingBar.start();
});

router.afterEach(() => {
  const loadingBar = (window as NaiveWindow).$loadingBar;
  loadingBar.finish();
});
