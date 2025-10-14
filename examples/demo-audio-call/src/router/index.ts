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

router.beforeEach((to) => {
  if (to.name === ROUTE_NAMES.SIGNIN) {
    return true;
  }

  if (!isAuthenticated.value) {
    return { name: ROUTE_NAMES.SIGNIN };
  }

  return true;
});

export default router;
