const ColorPicker = {
  mounted() {
    this.handleKeydown = (event) => {
      if (event.key === "Escape") {
        this.pushEvent("close_picker");
      }
    };
    document.addEventListener("keydown", this.handleKeydown);
  },
  destroyed() {
    document.removeEventListener("keydown", this.handleKeydown);
  }
};

export default ColorPicker; 