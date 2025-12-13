<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-50">
    <!-- Navigation Bar -->
    <NavBar :links="navLinks" :is-dark="false" class="fixed top-0 left-0 right-0 z-50" />

    <!-- Main Content -->
    <main class="pt-24 px-8 pb-16">
      <div class="max-w-6xl mx-auto">
        
        <!-- Header -->
        <div class="mb-16">
          <button 
            @click="navigateBack"
            class="group flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-8"
          >
            <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          
          <h1 class="text-6xl font-bold text-gray-900 mb-4">
            My Projects
          </h1>
          <p class="text-xl text-gray-600">
            A collection of my work and experiments
          </p>
        </div>

        <!-- Project Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="project in projects" 
            :key="project.id"
            class="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div class="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 relative overflow-hidden">
              <div class="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300"></div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ project.title }}
              </h3>
              <p class="text-gray-600 mb-4">
                {{ project.description }}
              </p>
              <div class="flex gap-2 flex-wrap">
                <span 
                  v-for="tech in project.tech" 
                  :key="tech"
                  class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NavLink } from '@/types/nav';

const router = useRouter();

const navLinks: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'LinkedIn', to: 'https://www.linkedin.com/in/himeth-peiris-1ab2232b3', isExternal: true },
  { label: 'GitHub', to: 'https://github.com/HBPeiris', isExternal: true },
  { label: 'Contact', to: 'mailto:himeth@example.com' }
];

const projects = [
  {
    id: 1,
    title: 'Project Alpha',
    description: 'A modern web application built with Vue 3 and TypeScript.',
    tech: ['Vue 3', 'TypeScript', 'Tailwind']
  },
  {
    id: 2,
    title: 'Project Beta',
    description: 'Full-stack application with real-time features.',
    tech: ['Nuxt', 'Node.js', 'WebSocket']
  },
  {
    id: 3,
    title: 'Project Gamma',
    description: 'Mobile-first responsive design showcase.',
    tech: ['Vue', 'Vite', 'CSS3']
  },
  {
    id: 4,
    title: 'Project Delta',
    description: 'E-commerce platform with advanced features.',
    tech: ['Nuxt 3', 'Pinia', 'Stripe']
  },
  {
    id: 5,
    title: 'Project Epsilon',
    description: 'Data visualization dashboard.',
    tech: ['Vue', 'Chart.js', 'D3.js']
  },
  {
    id: 6,
    title: 'Project Zeta',
    description: 'AI-powered content management system.',
    tech: ['Nuxt', 'OpenAI', 'MongoDB']
  }
];

const navigateBack = () => {
  router.push('/');
};
</script>