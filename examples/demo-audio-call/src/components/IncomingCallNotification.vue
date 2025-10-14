<template>
  <div class="incoming-call-notification">
    <div class="notification-content">
      <div class="caller-info">
        <Icon name="ic24-phone-in-talk" :width="24" :height="24" />
        <div class="text-content">
          <Typography font-weight="medium">Incoming call</Typography>
          <Typography>{{ callerId }}</Typography>
        </div>
      </div>
      <div class="actions">
        <Button size="s" class="decline-btn" mode="alert" icon="ic24-phone" @click="onDecline" />
        <Button size="s" mode="success" icon="ic24-phone" @click="onAnswer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Icon, Typography } from '@voximplant/spaceui';
import type { IncomingCall } from '@/store/incoming-calls';

interface Props {
  incomingCall: IncomingCall;
}

interface Emits {
  answer: [id: string];
  decline: [id: string];
}

defineOptions({ name: 'IncomingCallNotification' });

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { callerId, id } = props.incomingCall;

const onAnswer = (): void => {
  emit('answer', id);
};

const onDecline = (): void => {
  emit('decline', id);
};
</script>

<style scoped>
.incoming-call-notification {
  width: 100%;
  max-width: 360px;
  box-sizing: border-box;
  background: var(--sui-purple-600);

  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notification-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.caller-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  color: white;
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.caller-label {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.caller-id {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: white;
  word-break: break-all;
}

.actions {
  display: flex;
  gap: 14px;
  flex-shrink: 0;
  margin-right: 6px;
}

.decline-btn,
.answer-btn {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.decline-btn:hover,
.answer-btn:hover {
  transform: scale(1.05);
}

@media (max-width: 480px) {
  .incoming-call-notification {
    padding: 12px;
    border-radius: 8px;
  }

  .notification-content {
    gap: 12px;
  }

  .caller-info {
    gap: 8px;
  }

  .caller-label {
    font-size: 12px;
  }

  .caller-id {
    font-size: 14px;
  }

  .actions {
    gap: 6px;
  }
}

.decline-btn :deep(svg) {
  transform: rotate(135deg);
}
</style>
