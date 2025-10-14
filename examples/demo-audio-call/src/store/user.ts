import { ref } from 'vue';
import { persistRef } from '@/utils/persistRef';
import { STORAGE_KEYS } from '@/constants';
import type { ConnectionNode } from '@voximplant/websdk';

export const username = persistRef(STORAGE_KEYS.USERNAME, '');
export const password = ref('');
export const node = persistRef<ConnectionNode | ''>(STORAGE_KEYS.NODE, '');

export const isAuthenticated = ref(false);
