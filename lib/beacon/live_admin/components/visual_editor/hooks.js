import ColorPicker from "./hooks/color_picker"

export default {
  ColorPicker,
  VisualEditorClassInput: {
    mounted() {
      this.el.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault()
          const target = "#" + this.el.dataset.target
          this.pushEventTo(target, "add_class", { value: this.el.value }, () => {
            this.el.value = "" // Clear the input value
          })
        }
      })
    },
  },

  // This hook is used to save the expanded state of a section
  // That way if a user collapses, for instance, the opacity section,
  // whenever the user reloads the page or chooses a different element that
  // section remains.
  // Persistence is done by saving the expanded state in localStorage.
  ControlSectionSaveExpandedState: {
    mounted() {
      const sectionId = this.el.dataset.sectionId

      // Load initial state
      const expanded = localStorage.getItem(`section-${sectionId}-expanded`)

      if (expanded !== null) {
        this.pushEventTo(this.el, "set_expanded", { expanded: expanded === "true" })
      }

      this.handleEvent("expanded_changed", (data) => {
        // Only update if this event is for our section
        if (data.sectionId === sectionId) {
          localStorage.setItem(`section-${sectionId}-expanded`, data.expanded)
        }
      })
    },
  },

  ToggleGroup: {
    mounted() {
      this.el.addEventListener("click", (e) => {
        if (e.target.tagName !== "LABEL") {
          return
        }
        const input = e.target.querySelector("input")
        if (input?.checked) {
          e.preventDefault()
          e.stopPropagation()
          const defaultInput = this.el.querySelector('input[value="default"]')
          defaultInput.click()
        }
      })
    },
  },

  PreventEmptyChange: {
    mounted() {
      let currentValue = this.el.value
      let isCleared = false

      this.el.addEventListener("input", (e) => {
        if (e.target.value === "") {
          e.stopPropagation()
          isCleared = true
        } else {
          currentValue = e.target.value
          isCleared = false
        }
      })

      this.el.addEventListener("change", (e) => {
        if (isCleared) {
          e.stopPropagation()
        }
      })

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "attributes" && mutation.attributeName === "value") {
            currentValue = this.el.value
          }
        })
      })

      observer.observe(this.el, { attributes: true })

      this.el.addEventListener("blur", (e) => {
        if (e.target.value === "") {
          e.target.value = currentValue
          isCleared = false
        }
      })

      this.destroy = () => observer.disconnect()
    },
  },
}
