import "./style/common.scss";

import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./permission";

const app = createApp(App);

app.use(store);
app.use(router);

app.mount("#app");
