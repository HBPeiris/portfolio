<template>
  <nav 
    :class="[
      'p-4 h-16 w-full fixed top-0 left-0 z-50 transition-all duration-700',
      isDark ? 'bg-gray-900' : 'bg-white'
    ]"
  >
    <div class="max-w-[1200px] mx-auto flex justify-between items-center">
      <div 
        :class="[
          'text-xl font-bold font-epilogue transition-colors duration-700',
          isDark ? 'text-white' : 'text-black'
        ]"
      >
        HIMETH
      </div>
      <div class="space-x-8">
        <a 
          v-for="link in navLinks" 
          :key="link.to" 
          :href="link.to" 
          :target="link.isExternal ? '_blank' : '_self'"
          :class="[
            'transition duration-300 font-epilogue text-base',
            isDark ? 'text-gray-300 hover:text-purple-400' : 'text-black hover:text-pink-800'
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
  { label: 'LinkedIn', to: 'https://linkedin.com', isExternal: true },
  { label: 'GitHub', to: 'https://github.com', isExternal: true },
  { label: 'Contact', to: 'mailto:himeth@example.com' }
];

const navLinks = computed(() => 
  props.links && props.links.length > 0 ? props.links : defaultLinks
);
</script>