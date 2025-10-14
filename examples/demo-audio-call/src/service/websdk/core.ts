import { addIncomingCall, isAuthenticated, removeIncomingCall } from '@/store';
import { currentCall } from '@/store/call';
import { ClientState, ConnectionNode, Core } from '@voximplant/websdk';
import {
  CallLoader,
  CallManagerEvent,
  CallState,
  callToken,
  RejectMode,
  type CallManager,
} from '@voximplant/websdk/modules/call-manager';
import {
  StreamHelper,
  StreamLoader,
  streamToken,
  type DeviceTrackerHelper,
  type RendererManager,
  type StreamManager,
} from '@voximplant/websdk/modules/stream';

/**
 * WebSDK integration layer for audio call functionality.
 *
 * This module initializes and configures the Voximplant WebSDK with:
 * - Core module: Manages connection to Voximplant cloud
 * - Call module: Handles incoming/outgoing calls
 * - Stream module: Manages audio devices and streams
 *
 * The DeviceTrackerHelper automatically manages audio device selection
 * and provides APIs for manual device switching during calls.
 */
export interface WebSDK {
  core: Core;
  callManager: CallManager;
  rendererManager: RendererManager;
  streamManager: StreamManager;
  deviceTracker: DeviceTrackerHelper;
}

const setupClientStateWatcher = (core: Core): void => {
  core.client.state.watch((state) => {
    if ([ClientState.LoggedIn].includes(state)) isAuthenticated.value = true;
    if ([ClientState.Disconnected, ClientState.Disconnecting].includes(state))
      isAuthenticated.value = false;
  });
};

export const setupIncomingCallListener = (callManager: CallManager): void => {
  callManager.addEventListener(CallManagerEvent.IncomingCall, (event) => {
    const { callId } = event.payload;
    const callsMap = callManager.getCalls();
    const call = callsMap.get(callId);

    if (!call) return;

    if (
      currentCall.value &&
      ![CallState.Disconnected, CallState.Failed].includes(currentCall.value.state.value)
    ) {
      call.reject(RejectMode.Decline);
      return;
    }

    const callerId = call.remoteDisplayName?.value || call.remoteSipUri?.value || 'Unknown';
    addIncomingCall(call, callerId);

    call.state.watch((state) => {
      if ([CallState.Connected, CallState.Disconnected, CallState.Failed].includes(state)) {
        removeIncomingCall(callId);
      }
    });
  });
};

const initializeWebSDK = (): WebSDK => {
  const core = Core.init({
    logger: {
      prefix: 'AudioCallDemo',
    },
  });

  core.registerModules([StreamLoader(), CallLoader()]);
  const callManager = core.getModule(callToken)!;
  const streamModule = core.getModule(streamToken)!;
  const streamManager = streamModule.streamManager;
  const rendererManager = streamModule.rendererManager;

  setupClientStateWatcher(core);
  setupIncomingCallListener(callManager);

  const deviceTracker = streamModule.createHelper(StreamHelper.DeviceTracker);
  deviceTracker.enableTracker();

  return {
    core,
    callManager,
    streamManager,
    rendererManager,
    deviceTracker,
  };
};

export const connect = async (node: ConnectionNode): Promise<void> => {
  await websdk.core.client.connect({
    node,
  });
};

export const login = async (username: string, password: string): Promise<void> => {
  await websdk.core.client.login({
    username,
    password,
  });
};

export const disconnect = async (): Promise<void> => {
  await websdk.core.client.disconnect();
};

export const websdk = initializeWebSDK();
