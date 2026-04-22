import type { Call } from '@voximplant/websdk/modules/call-manager';
import { CallEvent, CallState, RejectMode } from '@voximplant/websdk/modules/call-manager';
import type { DeviceTrackerHelper } from '@voximplant/websdk/modules/stream';
import { callDestination, callFailCode, callFailReason, currentCall } from '@/store/call';
import { websdk } from './core';
import { getIncomingCallById, getOtherIncomingCalls } from '@/store/incoming-calls';
import { ROUTE_NAMES } from '@/constants';
import router from '@/router';

/**
 * Ends the current call and resets call state
 */
export const hangupAndClear = (): void => {
  currentCall.value?.hangup();
  currentCall.value = null;
  callFailReason.value = '';
  callFailCode.value = null;
};

/**
 * Toggles microphone mute state for the current call
 */
export const toggleMute = (): void => {
  if (!currentCall.value) return;

  if (currentCall.value.isMicrophoneMuted.value) {
    currentCall.value.unmuteMicrophone();
  } else {
    currentCall.value.muteMicrophone();
  }
};

/**
 * Toggles hold state for the current call
 */
export const toggleHold = async (): Promise<void> => {
  if (!currentCall.value) return;
  await currentCall.value.hold(!currentCall.value.isOnHold.value);
};

const setupCallFailListener = (call: Call): void => {
  call.addEventListener(CallEvent.Failed, (event) => {
    const payload = event.payload;
    callFailReason.value = payload.reason;
    callFailCode.value = payload.code;
  });
};

const setupCallStateWatcher = (call: Call, deviceTracker: DeviceTrackerHelper): void => {
  call.state.watch((state) => {
    if ([CallState.Disconnected, CallState.Failed].includes(state)) {
      deviceTracker.clear();
    }
  });
};

/**
 * Initiates an outbound call to the specified destination
 */
export const call = async (): Promise<void> => {
  const createdCall = websdk.callManager.createCall(callDestination.value);

  websdk.deviceTracker.attachCall(createdCall);

  setupCallFailListener(createdCall);
  setupCallStateWatcher(createdCall, websdk.deviceTracker);

  await createdCall.start();
  currentCall.value = createdCall;
};

/**
 * Sends DTMF tones during an active call
 * @param tones - The DTMF digits to send
 */
export const sendDTMF = async (tones: string): Promise<void> => {
  if (!currentCall.value) return;
  await currentCall.value.sendDTMF(tones);
};

/**
 * Answers an incoming call by its ID
 * @param id - The unique identifier of the incoming call
 */
export const answerIncomingCall = (id: string): void => {
  const incomingCall = getIncomingCallById(id);
  if (!incomingCall) return;

  const deviceTracker = websdk.deviceTracker;
  deviceTracker.attachCall(incomingCall.call);

  incomingCall.call.answer();
  currentCall.value = incomingCall.call;

  const otherIncomingCalls = getOtherIncomingCalls(id);
  otherIncomingCalls.forEach((otherIncomingCall) => {
    otherIncomingCall.call.reject(RejectMode.Decline);
  });

  router.push({ name: ROUTE_NAMES.CALL });
};

/**
 * Declines an incoming call by its ID
 * @param id - The unique identifier of the incoming call
 */
export const declineIncomingCall = (id: string): void => {
  const incomingCall = getIncomingCallById(id);
  if (!incomingCall) return;

  incomingCall.call.reject(RejectMode.Decline);
};
