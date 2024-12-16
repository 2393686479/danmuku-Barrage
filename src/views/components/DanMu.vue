<template>
  <div
    :style="style"
    class="danmu-item"
    :class="{ 'danmu-paused': isPaused, 'danmu-destoryed': isEnd }"
    @animationend="animationEnd"
  >
    {{ content }}
  </div>
</template>
<script setup lang="ts">
import { type danmuItemProps } from "./DanMu";

const {
  id,
  style = {
    "--opacity": "0.8",
    "--fontSize": "25px",
    "--fontWeight": "bold",
    "--color": "#ffffff",
    "--translateX": "0px",
    "--duration": "0s",
    "--top": "0px",
  },
  isPaused = false,
  isEnd = false,
  content = "",
  trackIndex = 0,
} = defineProps<danmuItemProps>();

const emit = defineEmits(["animationEnd"]);
const animationEnd = () => {
  emit("animationEnd", id, trackIndex);
};
</script>
<style lang="scss" scoped>
@keyframes roll {
  0% {
    transform: translateX(0) translateZ(0);
  }
  100% {
    transform: translateX(var(--translateX)) translateZ(0);
  }
}

.danmu-item {
  position: absolute;
  left: 100%;
  font-size: var(--fontSize, 25px);
  font-weight: var(--fontWeight, bold);
  color: var(--color, #ffffff);
  top: var(--top, 0);
  opacity: var(--opacity, 1);
  will-change: transform, opacity, top, left;
  animation: roll linear var(--duration) forwards;
  white-space: pre;
}

.danmu-paused {
  animation-play-state: paused;
}

.danmu-destoryed {
  display: none;
}
</style>
