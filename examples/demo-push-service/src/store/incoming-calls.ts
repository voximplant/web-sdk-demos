import { type Call } from '@voximplant/websdk/modules/call-manager';
import { ref } from 'vue';

export interface IncomingCall {
  id: string;
  call: Call;
  callerId: string;
}

export const incomingCalls = ref<IncomingCall[]>([]);

/**
 * Adds a new incoming call to the queue
 */
export const addIncomingCall = (call: Call, callerId: string): void => {
  const incomingCall: IncomingCall = {
    id: call.id,
    call,
    callerId,
  };
  incomingCalls.value.push(incomingCall);
};

/**
 * Removes an incoming call from the queue by ID
 */
export const removeIncomingCall = (id: string): void => {
  const index = incomingCalls.value.findIndex((incomingCall) => incomingCall.id === id);
  if (index > -1) {
    incomingCalls.value.splice(index, 1);
  }
};

/**
 * Retrieves an incoming call by its ID
 */
export const getIncomingCallById = (id: string): IncomingCall | undefined => {
  return incomingCalls.value.find((incomingCall) => incomingCall.id === id);
};

/**
 * Retrieves all incoming calls except the one with the specified ID
 */
export const getOtherIncomingCalls = (id: string): IncomingCall[] => {
  return incomingCalls.value.filter((incomingCall) => incomingCall.id !== id);
};
