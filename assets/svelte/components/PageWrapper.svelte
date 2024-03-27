<svelte:options customElement={{ tag: "page-wrapper", shadow: "open", customElement: true }} />

<script lang="ts">
  import LayoutAstNode from "./LayoutAstNode.svelte"
  import PageAstNode from "./PageAstNode.svelte"
  import { page } from "$lib/stores/page"
  import { tailwindConfig } from "$lib/stores/tailwindConfig"
  import { onMount, tick } from "svelte"

  const tailwindJitPromise = import("https://unpkg.com/@mhsdesign/jit-browser-tailwindcss@0.4.0/dist/cdn.min.js")

  let wrapper: HTMLElement
  let styleWrapper: HTMLElement

  onMount(async () => {
    await tailwindJitPromise

    // FIXME: load tailwind config object
    let tailwindConfig = {
      theme: {
        extend: {
          maxWidth: {
            xl: "37.5rem" /* 600px */,
            720: "45rem" /* 720px */,
            "3xl": "50rem" /* 800px */,
            "4xl": "56.25rem" /* 900px */,
            1200: "75rem" /* 1200px */,
            1360: "85rem" /* 1360px */,
            "7xl": "90rem" /* 1440px */,
          },
          gridTemplateColumns: {
            intro: "minmax(55%, 800px) minmax(35%, 600px)",
            "intro-reverse": "minmax(35%, 600px) minmax(55%, 800px)",
            cta: "minmax(25%, 514px) minmax(62%, 890px)",
            blog: "9rem 42rem 9rem",
            "blog-desktop": "9rem 56.25rem 9rem",
          },
          gridTemplateRows: {
            "featured-mobile": "190px 200px 124px",
            "featured-desktop": "280px 360px 200px",
            blog: "repeat(3, auto)",
          },
          spacing: {
            4.5: "1.125rem",
            15: "3.75rem",
            21: "5.25rem",
            25: "6.25rem",
            30: "7.5rem",
          },
          height: {
            15: "3.75rem",
            21: "5.25rem",
            25: "6.25rem",
          },
          aspectRatio: {
            blog: "36 / 13",
          },
          fontFamily: {
            body: ["Plus Jakarta Sans", "sans-serif"],
            heading: ["Manrope", "sans-serif"],
          },
          fontSize: {
            xxs: ["0.6875rem", "1rem"],
            xs: ["0.75rem", "1.125rem"],
            sm: ["0.875rem", "1.25rem"],
            "3xl": ["2rem", "2.5rem"],
            "4xl": ["2.5rem", "3rem"],
            "5xl": ["3rem", "3.75rem"],
            "6xl": ["3.75rem", "4.5rem"],
            eyebrow: ["0.8125rem", "1.125rem"],
          },
          colors: {
            gray: {
              50: "#F0F5F9",
              100: "#E1E8F0",
              200: "#CAD5E0",
              300: "#91A4B7",
              400: "#61758A",
              500: "#445668",
              600: "#304254",
              700: "#1C2A3A",
              800: "#0D1829",
              900: "#030913",
            },
            blue: {
              50: "#F4F6FD",
              100: "#EAEDFB",
              200: "#D5DBF7",
              300: "#ABB6EF",
              400: "#8192E7",
              500: "#576DDF",
              600: "#2D49D7",
              700: "#2037B8",
              800: "#16279A",
              900: "#0E1A7C",
            },
            yellow: {
              300: "#FED69A",
              900: "#924600",
            },
            "dy-gradient-pink": "#F78683",
            "dy-purple": "#4E53A8",
            "dy-purple-light": "#D9CCFF",
            "dy-green": "#048567",
            "dy-red": "#C0120C",
            featuredSkin: {
              background: "var(--color-featured-bg)",
              shadow: "var(--color-featured-shadow)",
            },
          },
          letterSpacing: {
            widestXl: "0.3em",
          },
          borderRadius: {
            "2.5xl": "1.25rem",
            "4xl": "2rem",
          },
          boxShadow: {
            "featured-base": "0 -36px 50px 0",
            "featured-base-hover": "0 -36px 50px 4px",
            "featured-oneColumn-xl-base": "-35px 28px 50px 0",
            "featured-oneColumn-xl-base-hover": "-52px 51px 50px 0",
            "featured-twoColumn-sm-base": "-24px 24px 50px 0",
            "featured-twoColumn-sm-base-hover": "-24px 24px 60px 8px",
            "featured-twoColumn-reverse-sm-base": "24px 24px 50px 0",
            "featured-twoColumn-reverse-sm-base-hover": "24px 24px 60px 8px",
            "featured-twoColumn-lg-base": "-64px 36px 80px 0",
            "featured-twoColumn-lg-base-hover": "-64px 36px 90px 8px",
            "featured-twoColumn-reverse-lg-base": "64px 36px 80px 0",
            "featured-twoColumn-reverse-lg-base-hover": "64px 36px 90px 8px",
          },
          transitionDuration: {
            "0": "0ms",
          },
          transitionProperty: {
            link: "box-shadow, color, background-color, border-color, fill, stroke, opacity",
          },
        },
      },
    }

    const tailwind = window.createTailwindcss({
      tailwindConfig,
    })

    const reloadStylesheet = async () => {
      const content = wrapper.outerHTML

      const css = await tailwind.generateStylesFromContent(
        `
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
      `,
        [content],
      )
      let styleEl = document.createElement("style")
      styleEl.textContent = css
      styleWrapper.appendChild(styleEl)
    }

    window.reloadStylesheet = reloadStylesheet
    reloadStylesheet()
  })
  page.subscribe(async ({ ast }) => {
    await tick()
    window.reloadStylesheet && window.reloadStylesheet()
  })
</script>

<span bind:this={styleWrapper}></span>
<div bind:this={wrapper}>
  {#each $page.layout.ast as layoutAstNode}
    <LayoutAstNode node={layoutAstNode}>
      {#each $page.ast as astNode, index}
        <PageAstNode node={astNode} nodeId={String(index)} />
      {/each}
    </LayoutAstNode>
  {/each}
</div>

<style>
  :global([data-selected="true"], [data-highlighted="true"]) {
    outline-color: #06b6d4;
    outline-width: 2px;
    outline-style: dashed;
  }

  :global(:before, :after) {
    pointer-events: none;
  }
</style>
