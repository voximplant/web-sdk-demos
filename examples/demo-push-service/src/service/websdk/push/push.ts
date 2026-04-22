import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { websdk } from '../core';
import { ROUTE_NAMES } from '@/constants';
import router from '@/router';
import { isAuthenticated } from '@/store';
import { firebaseConfig, voximplantBundleId } from './push.config';
import type { VoximplantPushData, VoximplantPushMessage } from './push.types';


const sendCallNotification = (callFrom: string): void => {
    const title = 'Call Notification';
    const body = `You have a new call from ${callFrom}`;
    const icon = '/favicon.ico';
    const notification = new Notification(title, { body, icon });
    notification.addEventListener('click', () => {
        notification.close();
        window.focus();

        if (!isAuthenticated.value) {
            router.push({ name: ROUTE_NAMES.AUTO_SIGNIN });
        }
    });
};

/**
 * Initializes the push service and handle notifications.
 *
 * To workflow should be:
 * - obtain token from fire base every time the application starts
 * - register token with the Voximplant WebSDK api
 * - add handlers to firebase background (when the main window or tab is hidden)
 *   and foreground (when the main window or tab is focused); the logic is client-specific,
 *   in this demo we want to show browser push notification and go to application on notification click,
 *   autologin to voximplant if it is possible.
 * - send firebase notification data to voximplant with handlePushNotification method initiate missing incoming call
 */
export const initPushService = async (): Promise<void> => {
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    onMessage(messaging, async ({ data }) => {
        console.log(`[FCM Foreground] message`, data);
        if (typeof document === 'undefined' && typeof Notification === 'undefined') return;

        if (document.hasFocus() && isAuthenticated.value) return;

        if (!isAuthenticated.value) {
          await router.push({ name: ROUTE_NAMES.AUTO_SIGNIN });
        }

        if (Notification.permission !== 'granted') await Notification.requestPermission();

        const voximplantPushMessage: VoximplantPushMessage | null = data?.voximplant ? JSON.parse(data.voximplant) : null;

        if (voximplantPushMessage) {
            sendCallNotification(voximplantPushMessage.display_name);
            await handleFirebaseCloudMessagingPayload(data);
        }
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', async (event: MessageEvent) => {
            const data = event.data as
                | { type?: string; payload: { data?: Record<string, string> } }
                | undefined;
            if (data?.type === 'FCM_BACKGROUND_MESSAGE') {

              if (!isAuthenticated.value)
                await router.push({ name: ROUTE_NAMES.AUTO_SIGNIN });
                await handleFirebaseCloudMessagingPayload(data.payload?.data);
            }
        });
    }

    // Browser may require a user gesture before allow to use the Notification API
    document.addEventListener('click', async () => {
      const token = await getToken(messaging);
      await websdk.pushService.registerPushToken({
        token,
        bundleId: voximplantBundleId,
      });
    })
};

const isVoximplantPushMessage = (data?: Record<string, string>): data is VoximplantPushData => {
    return typeof data?.voximplant === 'string';
};

const handleFirebaseCloudMessagingPayload = async (
    data?: Record<string, string>
): Promise<void> => {

    if (isVoximplantPushMessage(data)) {
        const parsedMessage = JSON.parse(data.voximplant);
        await websdk.pushService.handlePushNotification(parsedMessage);
    }

};


