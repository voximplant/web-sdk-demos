import { createRouter, createWebHashHistory } from 'vue-router';
import { isAuthenticated } from '../store';
import { ROUTE_NAMES } from '@/constants';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: `/${ROUTE_NAMES.SIGNIN}` },
    {
      path: '/signin',
      name: ROUTE_NAMES.SIGNIN,
      component: (): Promise<typeof import('../views/SignIn.vue')> => import('../views/SignIn.vue'),
    },
    {
      path: '/auto-signin',
      name: ROUTE_NAMES.AUTO_SIGNIN,
      component: (): Promise<typeof import('../views/AutoSignIn.vue')> => import('../views/AutoSignIn.vue'),
    },
    {
      path: '/main',
      name: ROUTE_NAMES.MAIN,
      component: (): Promise<typeof import('../views/Main.vue')> => import('../views/Main.vue'),
    },
    {
      path: '/call',
      name: ROUTE_NAMES.CALL,
      component: (): Promise<typeof import('../views/Call.vue')> => import('../views/Call.vue'),
    },
  ],
});

const PUBLIC_ROUTES: ReadonlyArray<string | symbol> = [
  ROUTE_NAMES.SIGNIN,
  ROUTE_NAMES.AUTO_SIGNIN,
];

router.beforeEach((to) => {
  if (to.name && PUBLIC_ROUTES.includes(to.name)) {
    return true;
  }

  if (!isAuthenticated.value) {
    return { name: ROUTE_NAMES.SIGNIN };
  }

  return true;
});

export default router;
