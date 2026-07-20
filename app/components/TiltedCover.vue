<template>
  <div class="flex h-[350px] w-[280px] sm:h-[450px] sm:w-[320px] lg:h-[500px] lg:w-96 items-center justify-center overflow-visible">
    <div 
      class="relative h-[320px] w-[250px] sm:h-[420px] sm:w-[290px] lg:h-[450px] lg:w-80 cursor-pointer transition-transform duration-300 hover:scale-105"
      @click="$emit('click')"
    >
      
      <!-- Background Layer -->
      <div
        class="pointer-events-none relative h-full w-full overflow-hidden rounded-xl border border-gray-300 transition-all duration-700 ease-[cubic-bezier(.405,0,.025,1)]"
        :style="{
          transform: isFlipped 
            ? 'perspective(400px) rotateY(0deg) scale(1) translateX(0%)' 
            : `perspective(400px) rotateY(${factor * 20}deg) scale(0.85) translateX(${-factor * 20}%)`
        }"
      >
        <slot name="background">
          <div class="p-4 flex flex-col justify-center h-full bg-gradient-to-br from-purple-500 to-pink-500">
            <div class="mb-2 text-sm font-semibold text-white">
              👋 Click me!
            </div>
            <p class="text-xs text-white/80">
              Discover more about my journey
            </p>
          </div>
        </slot>
        <div 
          class="absolute inset-0 h-full w-full bg-gray-900/20 transition-all duration-700"
          :style="{ opacity: isFlipped ? 0 : 1 }"
        />
      </div>
      
      <!-- Cover Content Layer -->
      <div
        class="absolute inset-0 h-full w-full rounded-xl border-4 sm:border-[6px] border-white bg-white transition-all duration-700 ease-[cubic-bezier(.405,0,.025,1)] shadow-2xl"
        :style="{
          transform: isFlipped 
            ? `perspective(400px) rotateY(${factor * 180}deg)` 
            : `perspective(400px) rotateY(${factor * 20}deg)`,
          opacity: isFlipped ? 0 : 1,
          pointerEvents: isFlipped ? 'none' : 'auto'
        }"
      >
        <slot name="cover">
          <div class="h-full w-full bg-gray-200 rounded-md" />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  direction?: 'left' | 'right';
  isFlipped?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'right',
  isFlipped: false
});

defineEmits(['click']);

const tiltLeft = computed(() => props.direction === 'left');
const factor = computed(() => tiltLeft.value ? 1 : -1);
</script>

