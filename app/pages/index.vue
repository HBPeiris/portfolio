<template>
  <div>
    <!-- Navigation Bar - Fixed on top -->
    <NavBar 
      :links="myNavLinks" 
      :is-dark="isAboutMode || isScrolledPastHero" 
      class="fixed top-0 left-0 right-0 z-50" 
    />

    <!-- Hero Section -->
    <section 
      ref="heroSection"
      :class="[
        'relative w-full min-h-screen overflow-hidden transition-all duration-700 ease-[cubic-bezier(.405,0,.025,1)]',
        isAboutMode 
          ? 'bg-black' 
          : 'bg-gradient-to-br from-purple-100 to-pink-50'
      ]"
    >
      <!-- Particles Background - Only show when in About mode -->
      <Transition name="fade">
        <div 
          v-if="isAboutMode" 
          class="fixed inset-0 pointer-events-none"
          style="z-index: 0;"
        >
          <Particles
            :particle-count="300"
            :particle-spread="15"
            :speed="0.15"
            :particle-colors="['#8b5cf6', '#ec4899', '#3b82f6', '#ffffff']"
            :move-particles-on-hover="false"
            :alpha-particles="true"
            :particle-base-size="80"
            :size-randomness="1.5"
            :camera-distance="20"
            :disable-rotation="false"
          />
        </div>
      </Transition>

      <!-- Fixed Layout Container -->
      <div class="h-screen flex items-center justify-center p-4 sm:p-8 relative" style="z-index: 1;">
        <div class="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-12 lg:gap-16">
          
          <!-- Left: Text Content (Changes based on mode) -->
          <HomeView v-if="!isAboutMode" />
          <AboutView v-else />
          
          <!-- Right: Tilted Card (Stays in same position) -->
          <div>
            <TiltedCover
              direction="right"
              :is-flipped="isAboutMode"
              @click="toggleMode"
            > 
              <template #cover>
                <div 
                  class="relative h-full w-full flex items-center justify-center bg-white"
                  @mouseenter="handleVideoHover(true)"
                  @mouseleave="handleVideoHover(false)"
                >
                  <video
                    ref="videoElement"
                    :src="logoVideo"
                    class="h-full w-full object-contain"
                    muted
                    loop
                    playsinline
                  />
                </div>
              </template>
              
              <template #background>
                <div class="relative h-full w-full">
                  <img
                    :src="profile"
                    alt="Himeth Peiris"
                    class="h-full w-full object-cover"
                  />
                </div>
              </template>
            </TiltedCover>
          </div>
          
        </div>
      </div>

      <!-- Scroll Down Indicator -->
      <div 
        class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer animate-bounce"
        @click="scrollToProjects"
      >
        <div class="flex flex-col items-center gap-2">
          <span :class="['text-sm font-medium opacity-70', isAboutMode ? 'text-white' : 'text-gray-800']">
            Scroll to explore
          </span>
          <svg 
            :class="['w-6 h-6 opacity-70', isAboutMode ? 'text-white' : 'text-gray-800']"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>

    <!-- Projects Section with InfiniteScroll -->
    <section 
      ref="projectsSection"
      class="relative w-full min-h-screen bg-black py-20 md:py-32 flex items-center justify-center overflow-hidden"
    >
      <div class="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10">
        <!-- InfiniteScroll Component - Centered with responsive sizing -->
        <div class="flex justify-center items-center">
          <InfiniteScroll
            :items="projectItems"
            width="min(90vw, 45rem)"
            max-height="50vh"
            :item-min-height="150"
            :is-tilted="true"
            tilt-direction="left"
            :autoplay="true"
            :autoplay-speed="2.0"
            autoplay-direction="down"
            :pause-on-hover="true"
            negative-margin="-0.8em"
          />
        </div>
      </div>

      <!-- Stronger gradient overlays for fade effect -->
      <div class="absolute top-0 left-0 right-0 h-48 md:h-64 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-20"></div>
      <div class="absolute bottom-0 left-0 right-0 h-48 md:h-64 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-20"></div>
    </section>

    <!-- Skills Section with FlowingMenu -->
    <section 
      ref="skillsSection"
      class="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden"
    >
      <div class="w-full h-full">
        <FlowingMenu :items="skillItems" />
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="relative w-full min-h-screen bg-black flex items-center justify-center">
      <div class="w-full">
        <ContactForm />
      </div>
    </section>
    
   
         <Footer/>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { NavLink } from '@/types/nav';
import Particles from '~/components/Particles.vue';
import InfiniteScroll from '@/components/InfiniteScroll.vue';
import FlowingMenu from '@/components/FlowingMenu.vue';
import HomeView from '@/components/HomeView.vue';
import AboutView from '@/components/AboutView.vue';
import TiltedCover from '@/components/TiltedCover.vue';
import NavBar from '@/components/NavBar.vue';
import ContactForm from '@/components/ContactForm.vue';
import logoVideo from '../assets/HIMTH PEIRIS.mp4';
import profile from '../assets/profile.png';
import Footer from '@/components/Footer.vue';

const isAboutMode = ref(false);
const isScrolledPastHero = ref(false);
const videoElement = ref<HTMLVideoElement | null>(null);
const heroSection = ref<HTMLElement | null>(null);
const projectsSection = ref<HTMLElement | null>(null);
const skillsSection = ref<HTMLElement | null>(null);

const myNavLinks: NavLink[] = [
  { label: 'LinkedIn', to: 'https://www.linkedin.com/in/himeth-peiris-1ab2232b3', isExternal: true },
  { label: 'GitHub', to: 'https://github.com/HBPeiris', isExternal: true },
  { label: 'Contact', to: '#contact' }
];

// Skills data for FlowingMenu
const skillItems = [
  { 
    link: '#skillsSection', 
    text: 'Web Development', 
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    skills: [
      { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
      { name: 'Express', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
      { name: 'HTML', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
      { name: 'CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
      { name: 'Nuxt', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg' },
      { name: 'Vue', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' }
    ]
  },
  { 
    link: '#skillsSection', 
    text: 'Database', 
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    skills: [
      { name: 'MySQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
      { name: 'SQL Server', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg' },
      { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
      { name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' }
    ]
  },
  { 
    link: '#skillsSection', 
    text: 'UI Design', 
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
    skills: [
      { name: 'Canva', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg' },
      { name: 'Figma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' }
    ]
  },
  { 
    link: '#skillsSection', 
    text: 'Project Management', 
    image: 'https://api.iconify.design/simple-icons:clickup.svg?color=%237b68ee',
    skills: [
      { name: 'ClickUp', logo: 'https://api.iconify.design/simple-icons:clickup.svg?color=%237b68ee' }
    ]
  }
];

// Smaller, more compact cards for mobile
const projectItems = [
  { 
    content: {
      template: `
        <div class="w-full h-full bg-gradient-to-br from-white/5 to-white/10 rounded-xl md:rounded-2xl p-4 md:p-8 flex items-center justify-start shadow-[0_0_50px_rgba(255,255,255,0.03)] backdrop-blur-md border border-white/5 hover:border-white/20 hover:shadow-[0_0_80px_rgba(255,255,255,0.08)] transition-all duration-700 group relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div class="relative z-10 text-left">
            <div class="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-1 md:mb-2" style="font-family: 'Inter', sans-serif; letter-spacing: 0.02em;">2+ YEARS</div>
            <div class="text-xl md:text-3xl font-light text-white/70 tracking-wide" style="font-family: 'Inter', sans-serif;">Experience</div>
          </div>
        </div>
      `
    }
  },
  { 
    content: {
      template: `
        <div class="w-full h-full bg-gradient-to-br from-white/5 to-white/10 rounded-xl md:rounded-2xl p-4 md:p-8 flex items-center justify-start shadow-[0_0_50px_rgba(255,255,255,0.03)] backdrop-blur-md border border-white/5 hover:border-white/20 hover:shadow-[0_0_80px_rgba(255,255,255,0.08)] transition-all duration-700 group relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div class="relative z-10 text-left">
            <div class="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-1 md:mb-2" style="font-family: 'Inter', sans-serif; letter-spacing: 0.02em;">3+ COMPLETED</div>
            <div class="text-xl md:text-3xl font-light text-white/70 tracking-wide" style="font-family: 'Inter', sans-serif;">Projects</div>
          </div>
        </div>
      `
    }
  },
  { 
    content: {
      template: `
        <div class="w-full h-full bg-gradient-to-br from-white/5 to-white/10 rounded-xl md:rounded-2xl p-4 md:p-8 flex items-center justify-start shadow-[0_0_50px_rgba(255,255,255,0.03)] backdrop-blur-md border border-white/5 hover:border-white/20 hover:shadow-[0_0_80px_rgba(255,255,255,0.08)] transition-all duration-700 group relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div class="relative z-10 text-left">
            <div class="text-3xl md:text-6xl font-black text-white tracking-tight leading-none mb-1 md:mb-2" style="font-family: 'Inter', sans-serif; letter-spacing: 0.02em;">CLEAN &</div>
            <div class="text-xl md:text-3xl font-light text-white/70 tracking-wide" style="font-family: 'Inter', sans-serif;">MAINTAINABLE CODE</div>
          </div>
        </div>
      `
    }
  },
  { 
    content: {
      template: `
        <div class="w-full h-full bg-gradient-to-br from-white/5 to-white/10 rounded-xl md:rounded-2xl p-4 md:p-8 flex items-center justify-start shadow-[0_0_50px_rgba(255,255,255,0.03)] backdrop-blur-md border border-white/5 hover:border-white/20 hover:shadow-[0_0_80px_rgba(255,255,255,0.08)] transition-all duration-700 group relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div class="relative z-10 text-left">
            <div class="text-3xl md:text-6xl font-black text-white tracking-tight leading-none mb-1 md:mb-2" style="font-family: 'Inter', sans-serif; letter-spacing: 0.02em;">ATTENTION</div>
            <div class="text-xl md:text-3xl font-light text-white/70 tracking-wide" style="font-family: 'Inter', sans-serif;">TO DETAIL</div>
          </div>
        </div>
      `
    }
  },
  { 
    content: {
      template: `
        <div class="w-full h-full bg-gradient-to-br from-white/5 to-white/10 rounded-xl md:rounded-2xl p-4 md:p-8 flex items-center justify-start shadow-[0_0_50px_rgba(255,255,255,0.03)] backdrop-blur-md border border-white/5 hover:border-white/20 hover:shadow-[0_0_80px_rgba(255,255,255,0.08)] transition-all duration-700 group relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div class="relative z-10 text-left">
            <div class="text-3xl md:text-6xl font-black text-white tracking-tight leading-none mb-1 md:mb-2" style="font-family: 'Inter', sans-serif; letter-spacing: 0.02em;">WILLINGNESS</div>
            <div class="text-xl md:text-3xl font-light text-white/70 tracking-wide" style="font-family: 'Inter', sans-serif;">TO LEARN & ADAPT</div>
          </div>
        </div>
      `
    }
  },
  { 
    content: {
      template: `
        <div class="w-full h-full bg-gradient-to-br from-white/5 to-white/10 rounded-xl md:rounded-2xl p-4 md:p-8 flex items-center justify-start shadow-[0_0_50px_rgba(255,255,255,0.03)] backdrop-blur-md border border-white/5 hover:border-white/20 hover:shadow-[0_0_80px_rgba(255,255,255,0.08)] transition-all duration-700 group relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div class="relative z-10 text-left">
            <div class="text-3xl md:text-6xl font-black text-white tracking-tight leading-none mb-1 md:mb-2" style="font-family: 'Inter', sans-serif; letter-spacing: 0.02em;">QUALITY</div>
            <div class="text-xl md:text-3xl font-light text-white/70 tracking-wide" style="font-family: 'Inter', sans-serif;">DEVELOPMENT</div>
          </div>
        </div>
      `
    }
  },
];

const toggleMode = () => {
  isAboutMode.value = !isAboutMode.value;
};

const handleVideoHover = (isHovering: boolean) => {
  if (videoElement.value) {
    if (isHovering) {
      videoElement.value.play();
    } else {
      videoElement.value.pause();
      videoElement.value.currentTime = 0;
    }
  }
};

// Scroll to projects section
const scrollToProjects = () => {
  projectsSection.value?.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
};

// Track scroll position
const handleScroll = () => {
  if (heroSection.value) {
    const heroBottom = heroSection.value.offsetTop + heroSection.value.offsetHeight;
    isScrolledPastHero.value = window.scrollY > heroBottom - 100;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;900&display=swap');

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  50% {
    transform: translateY(-10px) translateX(-50%);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>