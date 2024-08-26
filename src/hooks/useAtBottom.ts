import { ref } from "vue"

//功能: 是否觸碰到底部
export default function(){
  const isAtBottom = ref(false)
  const initScrollEvent = ()=>{
    window.addEventListener(
      "scroll",
      () => {
        const aiPromotionBottomLine = document.querySelector(
          "#aiPromotionBottomLine"
        );
        if (
          aiPromotionBottomLine && aiPromotionBottomLine.getBoundingClientRect().top <
            window.innerHeight + window.innerHeight / 2
        ) {
          isAtBottom.value = true
        } else {
          isAtBottom.value = false;
        }
      },
      {
        passive: true,
      }
    );
  }
  return {
    isAtBottom,
    initScrollEvent
  }
}