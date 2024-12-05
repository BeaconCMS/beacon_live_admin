export default {
  ClassControlAddClassAndClear: {
    mounted() {
      this.el.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault()
          this.pushEventTo("#" + event.target.id.replace("-input", ""), "add_class", { value: this.el.value }, () => {
            this.el.value = "" // Clear the input value
          })
        }
      })
    },
  },
}
