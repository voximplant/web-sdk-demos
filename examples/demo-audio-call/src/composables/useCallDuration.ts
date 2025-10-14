import { CallState, type Call } from '@voximplant/websdk/modules/call-manager';
import { computed, ref, onUnmounted, type ComputedRef } from 'vue';
import { CALL_DURATION_UPDATE_INTERVAL_MS } from '@/constants';

const humanizeDurationPart = (value: number): string => {
  return value.toString().padStart(2, '0');
};

/**
 * Tracks and formats the duration of an active call.
 *
 * Automatically updates the duration at a regular interval
 * and formats it as HH:MM:SS or MM:SS.
 *
 * @param call - The call instance to track, or null
 * @returns A computed ref with formatted duration string
 *
 * @example
 * const duration = useCallDuration(currentCall.value);
 * // duration.value => "05:23" or "01:05:23"
 */
export const useCallDuration = (call: Call | null): ComputedRef<string> => {
  const durationMs = ref(0);
  let intervalId: ReturnType<typeof setInterval> | null = null;

  if (call) {
    intervalId = setInterval(() => {
      durationMs.value = call.duration;
    }, CALL_DURATION_UPDATE_INTERVAL_MS);

    call.state.watch((state) => {
      if ([CallState.Disconnected, CallState.Failed].includes(state)) {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        durationMs.value = call.duration;
      }
    });
  }

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  });

  const duration = computed(() => {
    const totalSeconds = Math.floor(durationMs.value / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return hours > 0
      ? `${humanizeDurationPart(hours)}:${humanizeDurationPart(minutes)}:${humanizeDurationPart(seconds)}`
      : `${humanizeDurationPart(minutes)}:${humanizeDurationPart(seconds)}`;
  });

  return duration;
};
