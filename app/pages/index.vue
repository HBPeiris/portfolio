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
      <!-- Fixed Layout Container -->
      <div class="h-screen flex items-center justify-center p-8">
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
import logoVideo from '../assets/HIMTH PEIRIS.mp4' // The video file import
import profile from '../assets/profile.png'

const isAboutMode = ref(false);
const videoElement = ref<HTMLVideoElement | null>(null); // Renamed to avoid conflict

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
      videoElement.value.currentTime = 0; // Reset to beginning
    }
  }
};
</script>