<template>
  <div class="w-full">
    <div
      class="infinite-scroll-wrapper relative flex items-center justify-center w-full overflow-hidden"
      ref="wrapperRef"
      :style="{
        maxHeight: maxHeight,
        overscrollBehavior: 'none'
      }"
    >
      <div
        class="infinite-scroll-container flex flex-col px-2 md:px-4 cursor-grab active:cursor-grabbing"
        ref="containerRef"
        :style="{
          transform: getTiltTransform(),
          width: width,
          overscrollBehavior: 'contain',
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d'
        }"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="infinite-scroll-item rounded-xl md:rounded-3xl flex items-center justify-center text-xl font-semibold text-center select-none box-border relative"
          :style="{
            height: getItemHeight(),
            marginTop: negativeMargin
          }"
          v-html="item.content.template"
        >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import gsap from 'gsap';

interface InfiniteScrollItem {
  content: {
    template: string;
  };
}

interface Props {
  width?: string;
  maxHeight?: string;
  negativeMargin?: string;
  items?: InfiniteScrollItem[];
  itemMinHeight?: number;
  isTilted?: boolean;
  tiltDirection?: 'left' | 'right';
  autoplay?: boolean;
  autoplaySpeed?: number;
  autoplayDirection?: 'down' | 'up';
  pauseOnHover?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: '30rem',
  maxHeight: '100%',
  negativeMargin: '-0.5em',
  items: () => [],
  itemMinHeight: 150,
  isTilted: false,
  tiltDirection: 'left',
  autoplay: false,
  autoplaySpeed: 1.5,
  autoplayDirection: 'down',
  pauseOnHover: false
});

const wrapperRef = ref<HTMLDivElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const isMobile = ref(false);
let observer: any = null;
let rafId: number | null = null;
let velocity = 0;
let stopTicker: (() => void) | null = null;
let startTicker: (() => void) | null = null;

// Check if mobile device
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

// Responsive item height - smaller on mobile
const getItemHeight = () => {
  return isMobile.value ? '120px' : `${props.itemMinHeight}px`;
};

const getTiltTransform = (): string => {
  if (!props.isTilted) return 'none';
  return props.tiltDirection === 'left'
    ? 'rotateX(15deg) rotateZ(-15deg) skewX(15deg)'
    : 'rotateX(15deg) rotateZ(15deg) skewX(-15deg)';
};

const initializeScroll = async () => {
  const container = containerRef.value;
  if (!container) return;
  if (props.items.length === 0) return;

  // Dynamic import to avoid casing issues
  const { Observer } = await import('gsap/all');
  
  // Register Observer plugin
  gsap.registerPlugin(Observer);

  const divItems = gsap.utils.toArray<HTMLDivElement>(container.children);
  if (!divItems.length) return;

  const firstItem = divItems[0];
  if (!firstItem) return;

  const itemStyle = getComputedStyle(firstItem);
  const itemHeight = firstItem.offsetHeight;
  const itemMarginTop = parseFloat(itemStyle.marginTop) || 0;
  const totalItemHeight = itemHeight + itemMarginTop;
  const totalHeight = itemHeight * props.items.length + itemMarginTop * (props.items.length - 1);

  const wrapFn = gsap.utils.wrap(-totalHeight, totalHeight);

  divItems.forEach((child, i) => {
    const y = i * totalItemHeight;
    gsap.set(child, { y });
  });

  // ENHANCED SCROLL SENSITIVITY - Much easier to scroll
  const scrollMultiplier = isMobile.value ? 4.5 : 2.5;
  const dragMultiplier = isMobile.value ? 5 : 6;

  observer = Observer.create({
    target: container,
    type: 'wheel,touch,pointer',
    preventDefault: true,
    onPress: ({ target }: any) => {
      if (target instanceof HTMLElement) {
        const container = target.closest('.infinite-scroll-container');
        if (container) {
          (container as HTMLElement).style.cursor = 'grabbing';
        }
      }
    },
    onRelease: ({ target }: any) => {
      if (target instanceof HTMLElement) {
        const container = target.closest('.infinite-scroll-container');
        if (container) {
          (container as HTMLElement).style.cursor = 'grab';
        }
      }
      if (Math.abs(velocity) > 0.1) {
        const momentum = velocity * (isMobile.value ? 0.7 : 0.8);
        divItems.forEach(child => {
          gsap.to(child, {
            duration: isMobile.value ? 1.2 : 1.5,
            ease: 'power2.out',
            y: `+=${momentum}`,
            modifiers: {
              y: gsap.utils.unitize(wrapFn)
            }
          });
        });
      }
      velocity = 0;
    },
    onChange: ({ deltaY = 0, isDragging = false, event }: any) => {
      const d = event.type === 'wheel' ? -deltaY : deltaY;
      const distance = isDragging ? d * dragMultiplier : d * scrollMultiplier;

      velocity = distance * 0.5;

      divItems.forEach(child => {
        gsap.to(child, {
          duration: isDragging ? (isMobile.value ? 0.25 : 0.3) : (isMobile.value ? 0.9 : 1.2),
          ease: isDragging ? 'power1.out' : 'power3.out',
          y: `+=${distance}`,
          modifiers: {
            y: gsap.utils.unitize(wrapFn)
          }
        });
      });
    }
  });

  if (props.autoplay) {
    const directionFactor = props.autoplayDirection === 'down' ? 1 : -1;
    const speedPerFrame = props.autoplaySpeed * directionFactor;

    const tick = () => {
      divItems.forEach(child => {
        gsap.set(child, {
          y: `+=${speedPerFrame}`,
          modifiers: {
            y: gsap.utils.unitize(wrapFn)
          }
        });
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    if (props.pauseOnHover) {
      stopTicker = () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };
      
      startTicker = () => {
        if (rafId === null) {
          rafId = requestAnimationFrame(tick);
        }
      };

      container.addEventListener('mouseenter', stopTicker);
      container.addEventListener('mouseleave', startTicker);
      
      // Add touch events for mobile
      if (isMobile.value) {
        container.addEventListener('touchstart', stopTicker, { passive: true });
        container.addEventListener('touchend', startTicker, { passive: true });
      }
    }
  }
};

const cleanup = () => {
  if (observer) {
    observer.kill();
    observer = null;
  }
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  velocity = 0;

  const container = containerRef.value;
  if (container && props.pauseOnHover && stopTicker && startTicker) {
    container.removeEventListener('mouseenter', stopTicker);
    container.removeEventListener('mouseleave', startTicker);
    container.removeEventListener('touchstart', stopTicker);
    container.removeEventListener('touchend', startTicker);
  }

  stopTicker = null;
  startTicker = null;
};

// Handle window resize
const handleResize = () => {
  checkMobile();
  cleanup();
  setTimeout(() => {
    initializeScroll();
  }, 100);
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', handleResize);
  
  setTimeout(() => {
    initializeScroll();
  }, 100);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  cleanup();
});

watch(
  [
    () => props.items,
    () => props.autoplay,
    () => props.autoplaySpeed,
    () => props.autoplayDirection,
    () => props.pauseOnHover,
    () => props.isTilted,
    () => props.tiltDirection,
    () => props.negativeMargin
  ],
  () => {
    cleanup();
    setTimeout(() => {
      initializeScroll();
    }, 100);
  }
);
</script>

<style scoped>
.infinite-scroll-wrapper {
  touch-action: none;
  -webkit-overflow-scrolling: touch;
}

.infinite-scroll-wrapper::before,
.infinite-scroll-wrapper::after {
  content: '';
  position: absolute;
  background: linear-gradient(var(--dir, to bottom), transparent, transparent);
  height: 25%;
  width: 100%;
  z-index: 1;
  pointer-events: none;
}

.infinite-scroll-wrapper::before {
  top: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.95), transparent);
}

.infinite-scroll-wrapper::after {
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95), transparent);
}

.infinite-scroll-container {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
}

.infinite-scroll-item {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  transform: translateZ(0);
}

/* Mobile optimizations - Better scrolling */
@media (max-width: 768px) {
  .infinite-scroll-container {
    touch-action: pan-y;
  }
  
  .infinite-scroll-wrapper::before,
  .infinite-scroll-wrapper::after {
    height: 20%;
  }
}

/* Improve scroll performance on mobile */
@media (hover: none) and (pointer: coarse) {
  .infinite-scroll-container {
    cursor: default !important;
  }
  
  .infinite-scroll-container.active {
    cursor: default !important;
  }
}
</style>