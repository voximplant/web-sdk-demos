import { accessToken, addIncomingCall, isAuthenticated, refreshToken, removeIncomingCall, username } from '@/store';
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
import { PushServiceLoader, pushServiceToken, type PushService } from '@voximplant/websdk/modules/push-service';
import { STORAGE_KEYS } from '@/constants';
import { persistRef } from '@/utils/persistRef';

export const deviceToken = persistRef<string>(STORAGE_KEYS.DEVICE_TOKEN, crypto.randomUUID());

/**
 * WebSDK integration layer for push service functionality. The audio call demo code is used.
 * See audio call demo for call description.
 */
export interface WebSDK {
  core: Core;
  callManager: CallManager;
  rendererManager: RendererManager;
  streamManager: StreamManager;
  deviceTracker: DeviceTrackerHelper;
  pushService: PushService;
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
      prefix: 'PushServiceDemo',
    },
  });

  core.registerModules([StreamLoader(), CallLoader(), PushServiceLoader()]);
  const callManager = core.getModule(callToken)!;
  const streamModule = core.getModule(streamToken)!;
  const streamManager = streamModule.streamManager;
  const rendererManager = streamModule.rendererManager;

  const pushService = core.getModule(pushServiceToken)!;

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
    pushService,
  };
};

export const connect = async (node: ConnectionNode): Promise<void> => {
  await websdk.core.client.connect({
    node,
  });
};

export const login = async (username: string, password: string): Promise<void> => {
  const loginResult = await websdk.core.client.login({
    username,
    password,
    deviceToken: deviceToken.value
  });

  if (loginResult.loginTokens) {
    accessToken.value = loginResult.loginTokens?.accessToken;
    refreshToken.value = loginResult.loginTokens?.refreshToken;
  }

};

export const loginWithStoredAccessToken = async (): Promise<void> => {
  if (!accessToken.value && !refreshToken.value) throw new Error('No token exist');

  try {
    if (accessToken.value) {
      const loginResult = await websdk.core.client.loginAccessToken({
        username: username.value,
        accessToken: accessToken.value,
        deviceToken: deviceToken.value
      })

      if (loginResult.loginTokens) {
        accessToken.value = loginResult.loginTokens?.accessToken;
        refreshToken.value = loginResult.loginTokens?.refreshToken;
      }
    }
  } catch (e) {
    console.error('Failed to login with access token', e);

    const refreshResult = await websdk.core.client.refreshTokens({
      username: username.value,
      refreshToken: refreshToken.value,
      deviceToken: deviceToken.value
    })

    const loginResult = await websdk.core.client.loginAccessToken({
      username: username.value,
      accessToken: refreshResult.accessToken,
      deviceToken: deviceToken.value
    })

    if (loginResult.loginTokens) {
      accessToken.value = loginResult.loginTokens?.accessToken;
      refreshToken.value = loginResult.loginTokens.refreshToken;
    }
  };
}

export const disconnect = async (): Promise<void> => {
  await websdk.core.client.disconnect();
};

export const websdk = initializeWebSDK();
