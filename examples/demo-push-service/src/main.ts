import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { SpaceUIPlugin } from '@voximplant/spaceui';
import './service/websdk/core';
import { initPushService } from './service/websdk/push';

const app = createApp(App);

app.use(router);

const spaceUiPlugin = SpaceUIPlugin({
  spriteUrl: new URL('../node_modules/@voximplant/spaceui/common/sui-icons.svg', import.meta.url)
    .pathname,
});

// @ts-expect-error vue plugin type mismatch due to spaceui build on 3.2.22
app.use(spaceUiPlugin);

app.mount('#app');

initPushService();

