import { computed } from "vue";

export const useTop = () => {
  const menuTop = computed(() => {
    return uni.getMenuButtonBoundingClientRect().top;
  });

  const menuHeight = computed(() => {
    return uni.getMenuButtonBoundingClientRect().height;
  });

  return { menuTop, menuHeight };
};
