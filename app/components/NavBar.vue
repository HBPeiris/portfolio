<template>
  <nav 
    :class="[
      'fixed left-1/2 -translate-x-1/2 transition-all duration-700 rounded-full border',
      'px-4 sm:px-6 lg:px-8 h-14 sm:h-16',
      'w-[90%] max-w-[320px] sm:max-w-[420px] lg:max-w-[542px]',
      isDark 
        ? 'top-3 sm:top-4 z-40 bg-black backdrop-blur-md border-gray-700 shadow-[0_0_50px_rgba(0,0,0,0.8)]' 
        : 'top-3 sm:top-4 z-40 bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm'
    ]"
  >
    <div class="h-full flex justify-between items-center">
      <!-- Logo -->
      <div 
        :class="[
          'text-lg sm:text-xl font-bold tracking-wider transition-all duration-700',
          isDark ? 'text-white' : 'text-black'
        ]"
      >
        HIMETH
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden sm:flex items-center gap-4 lg:gap-8">
        <a 
          v-for="link in navLinks" 
          :key="link.to" 
          :href="link.to" 
          :target="link.isExternal ? '_blank' : '_self'"
          :rel="link.isExternal ? 'noopener noreferrer' : undefined"
          :class="[
            'text-xs sm:text-sm font-medium transition-colors duration-300',
            isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
          ]"
        >
          {{ link.label }}
        </a>
      </div>
      
      <!-- Mobile Menu Button -->
      <button
        @click="toggleMenu"
        :class="[
          'sm:hidden p-2 rounded-lg transition-colors duration-300',
          isDark ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-black hover:bg-black/5'
        ]"
        aria-label="Toggle menu"
      >
        <svg 
          class="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            v-if="!isMenuOpen"
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path 
            v-else
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    
    <!-- Mobile Menu Dropdown -->
    <Transition name="slide-fade">
      <div 
        v-if="isMenuOpen"
        :class="[
          'absolute top-full left-0 right-0 mt-2 rounded-2xl border overflow-hidden',
          isDark 
            ? 'bg-black/95 backdrop-blur-md border-gray-700 shadow-[0_0_30px_rgba(0,0,0,0.8)]' 
            : 'bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg'
        ]"
      >
        <div class="flex flex-col py-2">
          <a 
            v-for="link in navLinks" 
            :key="link.to" 
            :href="link.to" 
            :target="link.isExternal ? '_blank' : '_self'"
            :rel="link.isExternal ? 'noopener noreferrer' : undefined"
            @click="closeMenu"
            :class="[
              'px-6 py-3 text-sm font-medium transition-colors duration-300',
              isDark 
                ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                : 'text-gray-600 hover:text-black hover:bg-black/5'
            ]"
          >
            {{ link.label }}
          </a>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { NavLink } from '@/types/nav';

interface Props {
  links: NavLink[];
  isDark?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isDark: false
});

const isMenuOpen = ref(false);

const defaultLinks: NavLink[] = [
  { label: 'LinkedIn', to: 'https://www.linkedin.com/in/himeth-peiris-1ab2232b3/', isExternal: true },
  { label: 'GitHub', to: 'https://github.com/HBPeiris', isExternal: true },
  { label: 'Contact', to: 'mailto:himeth@example.com' }
];

const navLinks = computed(() => 
  props.links && props.links.length > 0 ? props.links : defaultLinks
);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>