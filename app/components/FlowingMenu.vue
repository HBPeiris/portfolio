<template>
  <div class="w-full h-full overflow-hidden">
    <nav class="flex flex-col h-full m-0 p-0">
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="flex-1 relative overflow-hidden text-center shadow-[0_-1px_0_0_#fff]"
        :ref="el => setItemRef(el as HTMLDivElement, idx)"
      >
        <a
          class="flex items-center justify-center h-full relative cursor-pointer uppercase no-underline font-semibold text-white text-[4vh] hover:text-[#0b0b0b] focus:text-white focus-visible:text-[#0b0b0b]"
          :href="item.link"
          @mouseenter="ev => handleMouseEnter(ev, idx)"
          @mouseleave="ev => handleMouseLeave(ev, idx)"
        >
          {{ item.text }}
        </a>

        <div
          class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none bg-white translate-y-[101%]"
          :ref="el => (marqueeRefs[idx] = el as HTMLDivElement)"
        >
          <div class="h-full w-full flex items-center justify-center" :ref="el => (marqueeInnerRefs[idx] = el as HTMLDivElement)">
            <div class="flex items-center gap-8">
              <template v-for="(skill, skillIdx) in item.skills" :key="`${idx}-${skillIdx}`">
                <div class="w-16 h-16 p-2 flex items-center justify-center">
                  <img 
                    :src="skill.logo" 
                    :alt="skill.name"
                    class="w-full h-full object-contain"
                    :title="skill.name"
                  />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { gsap } from 'gsap';

interface Skill {
  name: string;
  logo: string;
}

interface MenuItemProps {
  link: string;
  text: string;
  image: string;
  skills: Skill[];
}

interface Props {
  items?: MenuItemProps[];
}

withDefaults(defineProps<Props>(), {
  items: () => []
});

const itemRefs = ref<(HTMLDivElement | null)[]>([]);
const marqueeRefs = ref<(HTMLDivElement | null)[]>([]);
const marqueeInnerRefs = ref<(HTMLDivElement | null)[]>([]);

const animationDefaults = { duration: 0.6, ease: 'expo' };

const setItemRef = (el: HTMLDivElement | null, idx: number) => {
  if (el) {
    itemRefs.value[idx] = el;
  }
};

const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): 'top' | 'bottom' => {
  const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
  const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
  return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
};

const handleMouseEnter = (ev: MouseEvent, idx: number) => {
  const itemRef = itemRefs.value[idx];
  const marqueeRef = marqueeRefs.value[idx];
  const marqueeInnerRef = marqueeInnerRefs.value[idx];

  if (!itemRef || !marqueeRef || !marqueeInnerRef) return;

  const rect = itemRef.getBoundingClientRect();
  const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

  const tl = gsap.timeline({ defaults: animationDefaults });
  tl.set(marqueeRef, { y: edge === 'top' ? '-101%' : '101%' })
    .set(marqueeInnerRef, { y: edge === 'top' ? '101%' : '-101%' })
    .to([marqueeRef, marqueeInnerRef], { y: '0%' });
};

const handleMouseLeave = (ev: MouseEvent, idx: number) => {
  const itemRef = itemRefs.value[idx];
  const marqueeRef = marqueeRefs.value[idx];
  const marqueeInnerRef = marqueeInnerRefs.value[idx];

  if (!itemRef || !marqueeRef || !marqueeInnerRef) return;

  const rect = itemRef.getBoundingClientRect();
  const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

  const tl = gsap.timeline({ defaults: animationDefaults });
  tl.to(marqueeRef, { y: edge === 'top' ? '-101%' : '101%' }).to(marqueeInnerRef, {
    y: edge === 'top' ? '101%' : '-101%'
  });
};
</script>

<style scoped>
/* Removed marquee animation completely */
</style>