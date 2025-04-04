import { twMerge } from "tailwind-merge"

// call from Elixir: NodeJS.call("merge", ["h-48", "h-screen"])
module.exports = function merge(a, b) {
  return twMerge(a, b)
}
