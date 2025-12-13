<template>
  <div>
    <NavBar :links="myNavLinks" /> 

    <main class="p-0">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NavLink } from '@/types/nav';

const myNavLinks: NavLink[] = [
  { label: 'LinkedIn', to: '/projects' },
  { label: 'GitHub', to: '/contact' },
  { label: 'GitHub', to: 'https://github.com/your-repo', isExternal: true },
];

</script>