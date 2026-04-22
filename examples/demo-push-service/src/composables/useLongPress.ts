import { ref, onUnmounted, readonly, type Ref } from 'vue';
import { LONG_PRESS_DURATION_MS, LONG_PRESS_RESET_CHAR_DURATION_MS } from '@/constants';

export interface LongPressOptions {
  /** Duration in milliseconds to trigger long press */
  duration?: number;
  /** Character to emit on long press */
  longPressValue?: string;
  /** Character to emit on short press */
  value: string;
  /** Callback function called when any press occurs */
  onPress?: (value: string, isReseted: boolean) => void;
}

/**
 * Handles long-press interactions on UI elements (e.g., numpad buttons).
 *
 * Differentiates between short presses and long presses, emitting
 * different values based on hold duration. Commonly used for the
 * numpad "0" button to emit "+" on long press.
 *
 * @param options - Configuration for the long press behavior
 * @returns Event handlers and state for the long press interaction
 *
 * @example
 * const { startLongPress, endLongPress, handlePress } = useLongPress({
 *   value: '0',
 *   longPressValue: '+',
 *   onPress: (val) => console.log(val)
 * });
 */
export const useLongPress = (
  options: LongPressOptions,
): {
  startLongPress: () => void;
  endLongPress: () => void;
  handlePress: () => void;
  isLongPressActive: Ref<boolean>;
} => {
  const { duration = LONG_PRESS_DURATION_MS, longPressValue, value, onPress } = options;

  const longPressChars = longPressValue?.split('') ?? [];
  const longPressCharIndex = ref(0);

  const longPressTimer = ref<number>();
  const longPressResetCharIndexTimer = ref<number>();
  const isLongPressActive = ref(false);

  const startLongPress = (): void => {
    isLongPressActive.value = false;

    // Clear any existing timer
    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value);
    }

    // If no long press value is provided, skip scheduling a long-press
    if (!longPressValue) {
      return;
    }

    // Set a timer for the specified duration
    longPressTimer.value = setTimeout(() => {
      isLongPressActive.value = true;
      onPress?.(
        longPressChars?.[longPressCharIndex.value] ?? longPressChars?.[0] ?? '',
        !Boolean(longPressResetCharIndexTimer.value),
      );
      longPressCharIndex.value++;

      if (longPressCharIndex.value >= (longPressChars?.length ?? 0)) {
        longPressCharIndex.value = 0;
      }

      if (longPressResetCharIndexTimer.value) clearTimeout(longPressResetCharIndexTimer.value);

      longPressResetCharIndexTimer.value = setTimeout(() => {
        longPressCharIndex.value = 0;
        longPressResetCharIndexTimer.value = undefined;
      }, LONG_PRESS_RESET_CHAR_DURATION_MS);
    }, duration);
  };

  const endLongPress = (): void => {
    // Clear the timer if it exists
    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value);
      longPressTimer.value = undefined;
    }
  };

  const handlePress = (): void => {
    // Only emit short press value if it wasn't a long press
    if (!isLongPressActive.value) {
      onPress?.(value, true);
    }

    // Reset the long press state
    isLongPressActive.value = false;
  };

  // Cleanup timer on unmount
  onUnmounted(() => {
    if (longPressTimer.value) {
      clearTimeout(longPressTimer.value);
    }
  });

  // Return event handlers and state
  return {
    startLongPress,
    endLongPress,
    handlePress,
    isLongPressActive: readonly(isLongPressActive),
  };
};
