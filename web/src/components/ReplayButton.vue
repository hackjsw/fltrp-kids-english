<script setup>
defineProps({ label: { type: String, default: '重听' } })
</script>

<template>
  <button type="button" class="replay-button" data-quiet :aria-label="label">
    <span class="replay-icon" aria-hidden="true">🔊</span>
    <span>{{ label }}</span>
  </button>
</template>

<style scoped>
.replay-button {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  min-height: 44px; padding: 9px 18px; border-radius: 999px; flex-shrink: 0;
  background: #e8f3ff; color: #245da1; font-size: 16px; font-weight: 800;
  box-shadow: 0 3px 0 #bad8f5; white-space: nowrap;
}
.replay-button > span { color: inherit; font-weight: inherit; }
.replay-icon { font-size: 22px; line-height: 1; }
.replay-button:active:not(:disabled) { transform: translateY(2px); }
.replay-button:focus-visible { outline: 3px solid #245da1; outline-offset: 4px; }
.replay-button:disabled { opacity: .5; cursor: default; }
.replay-button.prominent { min-height: 76px; padding: 12px 28px; font-size: 21px; margin: 0 0 22px; }
.replay-button.prominent .replay-icon { font-size: 34px; }
@media (max-width: 600px) {
  .replay-button { padding: 9px 14px; }
  .replay-button.prominent { margin-bottom: 16px; }
}
</style>
