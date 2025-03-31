const ColorPicker = {
  mounted() {
    this.handleKeydown = (event) => {
      if (event.key === "Escape") {
        this.pushEventTo(this.el, "close_picker", {});
      }
    };
    document.addEventListener("keydown", this.handleKeydown);

    const input = this.el.querySelector('input[name]');
    if (input) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-value') {
            const newValue = input.getAttribute('data-value');
            input.value = newValue;
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      });

      observer.observe(input, {
        attributes: true,
        attributeFilter: ['data-value']
      });

      this.observer = observer;
    }
  },
  destroyed() {
    document.removeEventListener("keydown", this.handleKeydown);
    if (this.observer) {
      this.observer.disconnect();
    }
  }
};

export default ColorPicker; 