import { persistRef } from '@/utils/persistRef';
import { STORAGE_KEYS } from '@/constants';
import type { Call } from '@voximplant/websdk/modules/call-manager';
import { ref } from 'vue';

export const callDestination = persistRef(STORAGE_KEYS.CALL_DESTINATION, '');

export const currentCall = ref<Call | null>(null);

export const callFailReason = ref<string>('');
export const callFailCode = ref<number | null>(null);
