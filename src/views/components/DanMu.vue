<template>
  <div :style="props.style" class="danmu-item" @animationend="animationEnd">
    {{ props.content }}
  </div>
</template>
<script setup lang="ts">
import { type danmuItemProps } from './DanMu';

const props = withDefaults(
  defineProps<danmuItemProps>(),
  {
    id: '0',
    style: () => {
      return {
        '--opacity': '0.8',
        '--fontSize': '25px',
        '--fontWeight': 'bold',
        '--color': '#ffffff',
        '--translateX': '0px',
        '--duration': '0s',
        '--top': '0px',
      };
    },
    content: '',
    trackIndex: 0
  }
);

const emit = defineEmits(['animationEnd'])
const animationEnd = () => {
  emit('animationEnd', props.id, props.trackIndex)
}
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

.danmu-item{
    position: absolute;
    left: 100%;
    font-size: var(--fontSize, 25px);
    font-weight: var(--fontWeight, bold);
    color: var(--color, #ffffff);
    top: var(--top, 0);
    opacity: var(--opacity, 1);
    will-change: transform, opacity, top, left;
    animation: roll linear var(--duration) forwards infinite;
    white-space: pre;
}
</style>
