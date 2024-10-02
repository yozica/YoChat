import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/home/home.vue")
    },
    {
      path: "/chatroom",
      name: "Chatroom",
      component: () => import("@/views/chatroom/chatroom.vue")
    }
  ]
});

export default router;
