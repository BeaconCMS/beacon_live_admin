export function translate(_node: HTMLElement, { delay = 0, duration = 300, x = 0, y = 0 }) {
  return {
    delay,
    duration,
    css: (t: number) => `transform: translate(${x * t}px, ${y * t}px)`
  };
}