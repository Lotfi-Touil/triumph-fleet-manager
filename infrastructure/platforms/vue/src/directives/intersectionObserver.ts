import type { DirectiveBinding } from 'vue'

export const vIntersectionObserver = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add(binding.value)
            observer.unobserve(el)
          }
        })
      },
      {
        threshold: 0.1,
      },
    )
    observer.observe(el)
  },
}
