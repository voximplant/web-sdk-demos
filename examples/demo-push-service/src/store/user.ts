import { ref } from 'vue';
import { persistRef } from '@/utils/persistRef';
import { STORAGE_KEYS } from '@/constants';
import type { ConnectionNode } from '@voximplant/websdk';

export const username = persistRef(STORAGE_KEYS.USERNAME, '');
export const password = ref('');
export const node = persistRef<ConnectionNode | ''>(STORAGE_KEYS.NODE, '');

export const accessToken = persistRef(STORAGE_KEYS.ACCESS_TOKEN, '');
export const refreshToken = persistRef(STORAGE_KEYS.REFRESH_TOKEN, '');

export const isAuthenticated = ref(false);
