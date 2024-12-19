export default {
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
}
