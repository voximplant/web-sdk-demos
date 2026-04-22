import type { ReadonlyWatchable } from '@voximplant/websdk';
import { ref, type Ref } from 'vue';

/**
 * Converts a WebSDK ReadonlyWatchable into a Vue reactive ref.
 *
 * The WebSDK uses its own reactivity system with Watchable objects.
 * This composable bridges WebSDK reactivity with Vue's reactivity system,
 * automatically synchronizing the ref value when the watchable changes.
 *
 * Note: Direct assignments to the returned ref will be overwritten
 * on the next watchable update. The watchable is the source of truth.
 *
 * @param watchable - The WebSDK Watchable object to convert
 * @returns A Vue ref that stays in sync with the watchable value
 *
 * @example
 * const callState = useReadonlyWatchable(call.state);
 * // callState.value updates automatically when call.state changes
 */
export const useReadonlyWatchable = <
  T extends ReadonlyWatchable<unknown>,
  R = T extends ReadonlyWatchable<infer InnerType> ? Ref<InnerType> : never,
>(
  watchable: T,
): R => {
  const vueRef = ref(watchable.value);

  watchable.watch((value) => {
    vueRef.value = value;
  });

  return vueRef as R;
};
