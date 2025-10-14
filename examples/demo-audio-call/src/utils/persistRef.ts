import { ref, watch } from 'vue';
import type { Ref } from 'vue';

const STORAGE_PREFIX = 'WebSDK_AudioCallDemo';

/**
 * Creates a reactive ref that persists its value to localStorage.
 *
 * Changes to the ref are automatically saved to localStorage,
 * and the value is restored from localStorage on initialization.
 *
 * @param key - The storage key (will be prefixed)
 * @param defaultValue - The default value if nothing is stored
 * @returns A reactive ref that syncs with localStorage
 *
 * @example
 * const username = persistRef('username', '');
 * // Changes to username.value are automatically saved
 */
export const persistRef = <T>(key: string, defaultValue: T): Ref<T> => {
  const fullKey = `${STORAGE_PREFIX}_${key}`;

  const storedValue = localStorage.getItem(fullKey);
  const newRef = ref<T>(storedValue ? JSON.parse(storedValue) : defaultValue);

  watch(
    () => newRef.value,
    (value) => {
      localStorage.setItem(fullKey, JSON.stringify(value));
    },
    { deep: true },
  );

  return newRef as Ref<T>;
};
