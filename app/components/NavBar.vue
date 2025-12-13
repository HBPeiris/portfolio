<template>
  <nav 
    :class="[
      'px-8 h-16 fixed left-1/2 -translate-x-1/2 transition-all duration-700 rounded-full border',
      isDark 
        ? 'top-4 z-40 bg-black backdrop-blur-md border-gray-700 shadow-[0_0_50px_rgba(0,0,0,0.8)]' 
        : 'top-4 z-40 bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm'
    ]"
    :style="isDark ? 'width: 570px; padding: 0 2.5rem;' : 'width: 542px;'"
  >
    <div class="h-full flex justify-between items-center">
      <div 
        :class="[
          'text-xl font-bold tracking-wider transition-all duration-700',
          isDark ? 'text-white' : 'text-black'
        ]"
      >
        HIMETH
      </div>
      <div class="flex items-center gap-8">
        <a 
          v-for="link in navLinks" 
          :key="link.to" 
          :href="link.to" 
          :target="link.isExternal ? '_blank' : '_self'"
          :class="[
            'text-sm font-medium transition-colors duration-300',
            isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
          ]"
        >
          {{ link.label }}
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { NavLink } from '@/types/nav';

interface Props {
  links: NavLink[];
  isDark?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isDark: false
});

const defaultLinks: NavLink[] = [
  { label: 'LinkedIn', to: 'https://www.linkedin.com/in/himeth-peiris-1ab2232b3/', isExternal: true },
  { label: 'GitHub', to: 'https://github.com/HBPeiris', isExternal: true },
  { label: 'Contact', to: 'mailto:himeth@example.com' }
];

const navLinks = computed(() => 
  props.links && props.links.length > 0 ? props.links : defaultLinks
);
</script>