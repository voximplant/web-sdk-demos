<template>
  <div class="incoming-call-manager">
    <TransitionGroup name="notification-stack" tag="div" class="notifications-container">
      <IncomingCallNotification
        v-for="incomingCall in incomingCalls"
        :key="incomingCall.id"
        :incoming-call="incomingCall"
        @answer="answerIncomingCall"
        @decline="declineIncomingCall"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { incomingCalls } from '@/store/incoming-calls';
import IncomingCallNotification from './IncomingCallNotification.vue';
import { answerIncomingCall, declineIncomingCall } from '@/service/websdk/call';

defineOptions({ name: 'IncomingCallManager' });
</script>

<style scoped>
.incoming-call-manager {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
}

.notifications-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 12px;
  pointer-events: auto;
}

.notification-stack-enter-active,
.notification-stack-leave-active {
  transition: all 0.3s ease;
}

.notification-stack-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.notification-stack-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-stack-move {
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .notifications-container {
    gap: 8px;
    padding: 8px;
  }
}
</style>
