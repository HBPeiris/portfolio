<template>
  <div>
    <!-- Navigation Bar -->
    <NavBar :links="myNavLinks" :is-dark="isAboutMode" />

    <!-- Main Content Area -->
    <main 
      :class="[
        'relative w-full min-h-screen overflow-hidden transition-all duration-700 ease-[cubic-bezier(.405,0,.025,1)] pt-16',
        isAboutMode 
          ? 'bg-black' 
          : 'bg-gradient-to-br from-purple-50 to-pink-50'
      ]"
    >
      <!-- Particles Background - Only show when in About mode -->
      <Transition name="fade">
        <div 
          v-if="showParticles && isAboutMode" 
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
      <div class="h-screen flex items-center justify-center p-8 relative" style="z-index: 1;">
        <div class="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between gap-16">
          
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
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NavLink } from '@/types/nav';
import Particles from '~/components/Particles.vue';
import logoVideo from '../assets/HIMTH PEIRIS.mp4';
import profile from '../assets/profile.png';

const isAboutMode = ref(false);
const showParticles = ref(false);
const videoElement = ref<HTMLVideoElement | null>(null);

const myNavLinks: NavLink[] = [
  { label: 'LinkedIn', to: 'https://linkedin.com', isExternal: true },
  { label: 'GitHub', to: 'https://github.com', isExternal: true },
  { label: 'Contact', to: 'mailto:himeth@example.com' }
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

// Only mount Particles on client side
onMounted(() => {
  showParticles.value = true;
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>