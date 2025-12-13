<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
/* Global page transition styles */
.page-enter-active,
.page-leave-active {
  transition: all 0.6s cubic-bezier(0.405, 0, 0.025, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(100vh);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-100vh);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Layout transition styles */
.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s ease;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}
</style>