# Beacon LiveAdmin — Frontend Design Brief

A comprehensive description of the Beacon LiveAdmin product, its features, UI patterns, and design needs. Prepared as input for an external design service that will produce a new visual design system and screen designs for the admin interface.

---

## 1. What Beacon LiveAdmin Is

Beacon LiveAdmin is the management interface for **Beacon CMS**, an Elixir/Phoenix-based content management system. It is mounted into a host Phoenix application as a Plug-mounted scope (e.g. `/admin`) and serves authenticated users a multi-tenant admin where they can:

- Manage one or more **sites** (each site is a self-contained CMS).
- Create and publish **pages**, **layouts**, **components**, **error pages**, and **assets**.
- Configure **SEO**, **meta tags**, **schema (JSON-LD)**, **redirects**, **variants (A/B)**, **revisions**.
- Build **server-side event handlers** (Elixir), **info handlers**, and **client-side JS hooks**.
- Define and bind **GraphQL endpoints**, **page-level GraphQL queries**, and a declarative **action builder**.
- Manage **collections** (data schemas), **media library** (images/PDFs/etc.), and **groups/permissions**.
- Audit **SEO health**, **link health**, and **measurement snapshots** of the platform.
- At the platform level (owner only): manage **users**, **global collections**, **group templates**, and **platform settings**.

Beacon LiveAdmin uses **Phoenix LiveView 1.1** as the primary rendering engine, with **Svelte 5** for the highly interactive Visual Editor, **Monaco Editor** for code surfaces, and a **Tailwind WASM compiler** for live preview styling.

The design service should consider this an admin/CMS dashboard product with a strong "developer + content editor" hybrid audience, comparable to Sanity Studio, Strapi, Contentful, Webflow Designer, and Phoenix's own "LiveBeats"-style admin.

---

## 2. Tech Stack & Constraints (Designer-Relevant)

| Layer | Technology | Notes |
|---|---|---|
| Server | Phoenix 1.8.5 | LiveView SSR + WebSocket-driven UI |
| LiveView | 1.1.28 | Streamed lists, push-events, JS hooks |
| Styling | Tailwind CSS 3.4.13 | **v4 not supported** — designs must compile against v3 |
| Component lib | DaisyUI 4.12.24 | Two custom themes already exist: `beacon` (light) and `beacon-dark` |
| Icons | Heroicons 2.2 | Outline (24px), Solid (24px), Mini (20px), Micro (16px) — used everywhere via CSS-mask plugin |
| Code editor | Monaco (live_monaco_editor 0.2.1) | Custom HEEx language registered |
| Visual editor | Svelte 5 + live_svelte 0.15 | Drag/drop, FLIP animations |
| In-browser CSS | `@mhsdesign/jit-browser-tailwindcss` | Tailwind compiled in WASM for live preview iframes |
| Typography | Plus Jakarta Sans (Google Fonts) | 200–800 weights loaded |
| Themes | DaisyUI dual-theme | Light/dark/system, persisted in `localStorage` |
| Bundler | esbuild 0.25 + esbuild-svelte | |

**Designer takeaways**

- Output must be expressible as Tailwind 3 + DaisyUI 4 classes. New custom CSS is acceptable but should be minimal.
- Light **and** dark themes are required, with system-preference detection.
- Heroicons is the canonical icon library; do not introduce a new icon set unless explicitly approved.
- Plus Jakarta Sans is the current font; the brand color today is indigo (`#4f46e5`) with a stated secondary brand color of `#FD4F00` (Dockyard orange).

---

## 3. Audience & Roles

There are three permission tiers; designs should accommodate role-aware UI:

1. **Owner** — single platform super-admin. Sees all sites, can transfer ownership, manages users, global collections, group templates, and platform settings (the `/beacon/*` routes).
2. **Group members** — users assigned to one or more **groups** per site, inheriting that group's permission matrix. Permissions are defined per **feature × sub-feature** (view, create, edit, publish, delete, upload, take_snapshot).
3. **Individual grants** — fine-grained per-user permissions, optionally scoped to "all", a specific collection, or a single page.

**Permission gating behaviors the designs must support**

- Sidebar navigation is **filtered**: features the user cannot view are hidden, not greyed out. Section headers disappear when their group is empty.
- 403/Forbidden today returns plain text — a designed empty state would be welcome.
- Owners get a special purple **Owner** badge with a shield-check icon in user lists.
- Two-step inline destructive confirmations ("Delete?" → "Yes / No") are used pervasively in tables instead of full modals.

---

## 4. Information Architecture & Routing

The full admin route map (under `/admin/*` prefix):

**Site-scoped (prefixed `/admin/:site/`):**
- `/` — Site dashboard (overview + role-filtered feature cards)
- `/pages`, `/pages/new`, `/pages/:id`, `/pages/:id/seo`, `/pages/:id/meta_tags`, `/pages/:id/schema`, `/pages/:id/revisions`, `/pages/:id/preview`
- `/pages/:page_id/variants`, `/pages/:page_id/variants/:variant_id` — A/B variants
- `/pages/:page_id/queries`, `/pages/:page_id/queries/:id` — GraphQL bindings per page
- `/layouts`, `/layouts/new`, `/layouts/:id`, `/layouts/:id/meta_tags`, `/layouts/:id/revisions`, `/layouts/:id/resource_links`, `/layouts/:id/preview`
- `/components`, `/components/new`, `/components/:id`, `/components/:id/slots`, `/components/:id/slots/:slot_id/attrs/...`
- `/media_library`, `/media_library/upload`, `/media_library/:id`
- `/collections`, `/redirects`, `/groups`
- `/seo_audit`, `/measurement`, `/link_health`
- `/error_pages`, `/error_pages/:status`
- `/events`, `/events/:id` — Event handlers (Elixir or Actions DSL)
- `/info_handlers`, `/info_handlers/:handler_id`
- `/hooks`, `/hooks/:id` — JS hooks
- `/graphql_endpoints`, `/graphql_endpoints/:id`, `/graphql_endpoints/:id/schema`
- `/action_builder` — Visual workflow builder
- `/settings`, `/settings/:key` — Site settings (templated values)

**Platform-level (owner only, `/admin/beacon/*`):**
- `/beacon` — Platform dashboard
- `/beacon/users` — User management
- `/beacon/settings` — Platform-wide defaults
- `/beacon/collections` — Global (cross-site) collections
- `/beacon/group_templates` — Permission group templates

The router also serves preview iframes at `/__beacon_live_admin__/preview/:site/:type/:id` and hashed asset endpoints for CSS/JS/WASM.

**Design implication:** there are **two distinct nav contexts** — site-scoped and platform — and the chrome should make this switch obvious. Today there's a **site selector** in the sidebar and a separate "Beacon Platform" link group for owners.

---

## 5. Global Shell & Navigation

### 5.1 Layout structure

- **Left sidebar** — fixed full-height, collapsible 220px ↔ 56px. Toggled via a chevron button; state persisted in `localStorage` (`beacon_sidebar_collapsed`). Width transition: `200ms ease-in-out`.
- **Main content area** — flex-1, scrollable. Has its own header (page title + optional subtitle + right-aligned action group) followed by `main_content` cards (`bg-base-100`, rounded-xl, `shadow-sm`, border `base-300`).
- **No global top bar** today — no breadcrumbs, no global search, no notifications surface. (These are gaps the design service may want to address.)
- A **floating theme toggle** sits at fixed `bottom-4 right-4` (circular button, sun/moon/system icons, z-50).

### 5.2 Sidebar contents (top to bottom)

1. **Brand block** — 32px circular indigo badge with a sun/compass SVG, "Beacon" wordmark (hidden when collapsed via container query at 180px).
2. **Sidebar collapse toggle** — small ghost button.
3. **Primary nav (scrollable)** — grouped:
   - **Content** — Pages, Layouts, Components, Media Library
   - **SEO & Analytics** — SEO Audit, Measurement, Link Health, Redirects
   - **Data & Logic** — Collections, GraphQL Endpoints, Page Queries, Events, Info Handlers, Action Builder
   - **Developer** — Error Pages, JS Hooks, Site Settings
   - **Administration** — Groups
   - **Platform** (owner-only) — Beacon Dashboard, Users, Global Collections, Group Templates, Platform Settings
   Group headers are uppercase 11px, semibold, tracking-wider; only visible when expanded. Each item has an 18px Heroicon + label + `line-clamp-1`. Active item: `bg-primary/10`, primary text. Hover: `bg-base-200`. Disabled (no permission): `text-base-content/20`, `cursor-not-allowed`.
4. **Site selector** — `<select>` listing all running sites, switches the current scope in-session. Lives above the footer with a top border.
5. **Footer** — currently minimal; user/profile menu would naturally live here.

### 5.3 Icon mapping (current)

| Item | Heroicon |
|---|---|
| Pages | document-text |
| Layouts | rectangle-group |
| Components | cube |
| Media Library | photo |
| Collections | document-duplicate |
| GraphQL Endpoints | server-stack |
| Events | bolt |
| Info Handlers | information-circle |
| Action Builder | (workflow-style) |
| Error Pages | exclamation-triangle |
| JS Hooks | code-bracket |
| Site Settings | cog-6-tooth |
| Groups | user-group |
| Users | users |
| SEO Audit | chart-bar |
| Measurement | presentation-chart-line |
| Link Health | link |
| Redirects | arrow-uturn-right |
| Platform (owner) | shield-check |

---

## 6. Design System (Current State)

### 6.1 Color tokens (DaisyUI semantic — already configured)

**Light theme `beacon`:**
```
primary           #4f46e5  (Indigo-600)
primary-content   #ffffff
secondary         #6366f1
accent            #8b5cf6  (Violet)
neutral           #1e293b
base-100          #ffffff   (cards/panels)
base-200          #f8fafc   (page background)
base-300          #f1f5f9   (borders)
base-content      #0f172a   (body text)
info              #3b82f6
success           #10b981
warning           #f59e0b
error             #ef4444
```

**Dark theme `beacon-dark`:**
```
primary           #6366f1
base-100          #0f172a
base-200          #020617
base-300          #1e293b
base-content      #e2e8f0
```

### 6.2 Typography
- Plus Jakarta Sans, weights 200/300/400/500/600/700/800.
- Headings: page H1 is `text-lg font-semibold leading-8`; subtitles are `text-sm text-base-content/70`.
- Labels: `text-sm font-medium`.
- Helper text: `text-xs text-base-content/60`.
- Monospace (paths, codes, keys): default Tailwind monospace stack via `font-mono`.

### 6.3 Spacing & shape
- Common gaps: 1, 2, 4, 6 (Tailwind units).
- Container padding: page main has `px-6 lg:px-6 pt-4 pb-2`, cards use `px-4 py-3`.
- Radii: cards `rounded-xl`, modals `rounded-2xl`, inputs `rounded-lg`, badges `rounded-md`.
- Shadows: `shadow-sm` baseline, `shadow-md` on hover, `shadow-xl` on modals.

### 6.4 Component primitives in use today

The design service should plan to replace/refresh these. The list is exhaustive of what's currently shipping — every screen is built from these:

- **Buttons** — DaisyUI `btn`, `btn-primary`, `btn-soft` (default), `btn-ghost`, `btn-error`, `btn-xs`/`-sm`, `btn-circle`, with `phx-disable-with="Saving..."` loading text.
- **Inputs** — single `<.input/>` component handling text/email/password/number/search/tel/url/date/datetime-local/month/time/week/color/file/hidden/select/textarea/checkbox. Sizes: default + `-sm`. Error variants: `input-error`, etc., with red `hero-exclamation-circle` and inline error message.
- **Modal** — backdrop `bg-base-300/80 backdrop-blur-sm`, panel `bg-base-100 shadow-xl rounded-2xl p-14 max-w-3xl`, close X top-right, JS animations (300ms show / 200ms hide), focus-trap.
- **Flash/Toast** — fixed top-right, DaisyUI `alert-info` / `alert-error`, dismissable. Plus a special "disconnected" alert with spinning `arrow-path`.
- **Table** — `table table-zebra` with `:col` slots, optional `row_click`, action column at right (w-0). Wrapped by `table_search` (debounced filter), `table_sort` (select), `table_pagination` (DaisyUI `join` group).
- **Headers** — `<.header/>` component: title + optional subtitle + right-aligned action slot, divider below.
- **Page menu / tab pills** — pill nav inside `bg-base-200 rounded-lg w-fit p-1`. Active pill: `text-primary bg-primary/10`. Used for sub-sections of an entity (Page → SEO, Meta Tags, Schema, Variants, Revisions, Preview).
- **Cards** — `card bg-base-100 shadow-sm border border-base-300`, used for `main_content`, dashboard tiles, feature cards.
- **Badges** — DaisyUI `badge` + custom inline pills with `ring-1` borders. Common variants: status (Draft slate / Published emerald), role (Owner purple), severity (rose/amber/zinc).
- **Avatar** — single-letter circle, `bg-primary/10` for current user, `bg-base-200` for others, sizes 7×7 to 10×10.
- **Icon button** — bare icon (pencil, trash, key, user-plus, etc.) with hover color shift.
- **Empty state** — centered icon + message; not standardized — different sections roll their own.
- **Loading** — `topbar` thin progress bar at top of viewport, plus per-form `phx-disable-with` text swaps.
- **Color picker** — popover with 60+ Tailwind color swatches plus native `<input type="color">` and hex text input.
- **Drag handle** — small blue indicator on draggable elements in the visual editor; FLIP-animated reordering.

---

## 7. Major Screens & Their UI Needs

### 7.1 Home / Site Dashboard

Two distinct surfaces:

**Site dashboard** (`/:site`):
- Three KPI cards (Pages count, Users count, "Total content" or similar), responsive grid (1 col mobile / 3 cols desktop). Each: 40px colored icon badge (primary/success/warning), large bold count, uppercase label.
- Feature card grid grouped by section (Content, SEO & Analytics, Data & Logic, Developer, Administration). Each card: small icon badge (gray default → indigo on hover), title, one-line description, links into the feature. **Cards must be filtered by user permissions**, and entire sections vanish when empty.

**Platform dashboard** (`/beacon`):
- Three KPI cards (Sites, Users, Total Pages).
- Sites table: Site, Pages, Layouts, Components, Manage column.
- Quick-link card grid for User Management / Group Templates / Global Collections / Global Settings.

### 7.2 Pages — list + editor (the most-used surface)

**List `/pages`:** searchable table (Title / Path / Status); status pill is emerald "Published" or slate "Draft" with a colored dot; row-click and pencil-icon both open the editor; "Create New Page" CTA top-right.

**New `/pages/new`:** two-step picker. First a card grid of available **collections** (each with icon, name, description, mode badge "managed"/"templated", field count), plus a dashed-border "Custom Page" card. On select, the form loads.

**Edit `/pages/:id`:** the most complex screen in the app. Today it's split into:
- **Top action bar**: page title + status pill (lime/yellow), "Visual Editor" ↔ "Code Editor" toggle (when format is HEEx), Save Changes (primary), Publish (primary, opens confirm modal), Unpublish (error).
- **Settings drawer** (gear toggle): collapsible 2-col grid of Path (mono), Title, Layout (select), Format (select), Cache TTL, Description (textarea), plus collection-specific extra fields.
- **Workspace toolbar**: 3-mode toggle (Split / Editor only / Preview only) inside a `bg-base-200 p-0.5` pill container.
- **Code pane**: full-height Monaco editor on dark `#0D1829` background, language switches by format (HEEx → HTML, JSON-LD → JSON).
- **Preview pane**: iframe to `/preview/:site/page/:id`, white background, border. Reloads as the user types.
- **Modals**: Publish confirm ("Are you sure you want to publish…"), Unpublish confirm.

**Sub-tabs** of a page (rendered as the pill nav): **SEO**, **Meta Tags**, **Schema**, **Variants**, **Revisions**, **Preview**.

### 7.3 SEO tab (per page)

A rich form, the most "marketing-tool-like" screen:
- **SEO Score** badge at top (Good ≥80% green / Needs Work 40–79% yellow / Poor <40% red) calculated client-side from a 100-point rubric across 12 factors.
- **Search Preview card** — Google SERP mockup: blue title (max 60 chars), green URL, gray description (max 160 chars), all live-bound to the form.
- **Search Appearance** section — Meta Description textarea with live char counter (green ≤90% / yellow 90–100% / red >100%), Robots select, Collection dropdown.
- **Social Sharing** section — OG Title (60-char counter), OG Description (160-char counter), OG Image URL, **Social preview card** (1.91:1 aspect, mocks an OG card), Twitter Card Type select.
- **Advanced** section — Canonical URL.
- **Content Freshness** section — Last Substantially Updated (timestamp display + "Mark as Updated" green button).
- **Collection fields** section (conditional) — dynamic fields injected from the page's collection schema (text/textarea/checkbox/datetime/integer based on type), grouped in a `bg-gray-50 rounded-lg p-4` panel.

### 7.4 Meta Tags / Resource Links / Schema

- **Meta Tags & Resource Links** use a shared dynamic-row pattern: a grid where columns are auto-generated from union of attributes present (`name`, `property`, `content` defaults; users can add custom attributes through a modal with preset shortcuts like `http-equiv`, `charset`, `itemprop`). Each row has a trash button. Labels show only on the first row.
- **Schema** (JSON-LD) is a Monaco JSON editor with **template insert buttons** ("Article", "FAQPage", "Product", "HowTo") rendered as inline indigo pills.

### 7.5 Revisions

A vertical timeline (`border-l border-gray-200 ml-4`):
- Absolute-positioned circle markers per event (`-left-5`, white halo + colored inner circle + Heroicon — `eye` for published, `document-plus` for created).
- Title, timestamp, "Latest" badge on first.
- Snapshot details inline: Path / Title / Description / Format strings, **Monaco read-only** editors for Template (max-h-60), Schema (JSON pretty-printed), plus tables for Meta Tags, Variants, Event Handlers.
- Click a variant or event handler row → full-screen Monaco modal (read-only) for inspection.

### 7.6 Variants (A/B)

- Two-pane: left = variants table (Name, Weight%, scrollable to viewport height); right = form + Monaco template editor.
- Form: Name input, Weight number (0–100), template Monaco, Save (primary), Delete (error).
- Modals: navigate-with-unsaved-changes warning, delete confirm with note "deleted variants will still be active until the page is re-published!".

### 7.7 Layouts (very similar to Pages)

- Index table: Title / Status (Published-public vs Draft-not-public).
- Edit form: Title input + Monaco HEEx editor; Create Draft / Save / Publish actions.
- Sub-tabs: **Meta Tags**, **Resource Links** (same dynamic-row pattern; resource links default attributes are `rel` and `href`, plus a modal to add custom attributes like `type`, `crossorigin`, `sizes`, `as`), **Revisions**, **Preview**.

### 7.8 Components

- Index table: Name / Category / Body excerpt (first 100 chars).
- Edit form: 2-column layout with **left sidebar** (Name, Category select, **Attributes table** with edit/delete + "Add new Attribute" button) and **right pane** with three stacked Monaco editors — **Body** (Elixir), **Template** (HEEx), **Example** (HTML).
- **Attribute modal**: Name, Type select (any/string/atom/boolean/integer/float/list/map/global/struct), conditional Struct Name field, plus a `<legend>` "Options" section with Required, Default, Accepted values, Doc, Examples.
- **Slots** sub-route: 3-column layout — slots list table on left, slot detail form (Name, Required, Validate Attrs, Doc) on right with its own attributes table that links to a separate **SlotAttr** create/edit modal.

### 7.9 Media Library

- Table list (not a grid yet) with 50×50 thumbnail, File Name, Type, action icons.
- Search input + sort select (File Name / Type), 15-result cap.
- **Upload modal**: dashed drag-drop box, single-file (`max_entries: 1`), `auto_upload`, native HTML progress bar, accept-list for images/PDF, humanized error messages, post-upload thumbnail + green "Successfully uploaded" filename.
- **Detail modal**: image preview with srcset variants, vertical list of read-only inputs for original URL + variant URLs, copy-to-clipboard icon per row that toasts "Copied to clipboard" (top-right, fading).
- **Delete**: native `data-confirm` browser dialog, soft-delete only.
- **Gaps that designs should address**: no real grid view, no bulk select, no empty state, no in-place metadata editing (alt text/caption stored but not editable in UI), no native picker mode for embedding into the page editor.

### 7.10 Visual Editor (Page/Layout WYSIWYG)

The most ambitious and design-sensitive surface. Today it consists of:

- **UiBuilder Svelte component** rendering the live page as an interactive DOM tree. Click selects an element; selected element gets hover/focus highlight; **breadcrumb** of parent ancestry with "Go to Parent" button.
- **PropertiesSidebarComponent** — right-hand 264px panel with collapsible groups (state persisted per-section in localStorage). Today's groups:
  - **Layout** (display, flex direction/wrap/align/justify, row/column gap with unit selector px/rem/em/%)
  - **Size** (width/height/min/max, aspect-ratio presets, units px/em/rem/%/vw/vh)
  - **Typography**
  - **Space** (4-sided margin & padding with directional arrows)
  - **Border**
  - **Opacity** (slider)
  - **ID**
  - **Class** — Tailwind class manager with text-input-add (Enter to commit) and badge list with delete
  - **Custom Attributes** — name/value pairs editor
- **Canvas frame** wrapping the iframe in a "browser-frame" chrome, with **draft / published tabs** above.
- **Drag-and-drop**: any element with siblings becomes draggable; FLIP-animated reordering; ghost preview during drag; preserves preceding HTML comments. Components can also be dragged from a palette into the canvas.
- **Live Tailwind WASM**: every change recompiles the page's class list against the site's `tailwind_config` + DaisyUI plugins inside the iframe; body fades in (`opacity 0 → 1`) once compile completes.
- **Code/Visual toggle**: switches between Monaco HEEx editor and visual mode without losing fidelity (round-trip through AST).

**Design needs for the visual editor**

- A clearer, more discoverable property panel (today's groups are dense and labels are tight).
- A component palette with categories and search (currently rudimentary).
- Better visual feedback for selection, hover, drop zones.
- A way to see/manage breakpoints (mobile/tablet/desktop preview toggle is **not currently present** but is a key gap).
- Indicators for unsaved changes, validation errors per element.
- Possibly a mini-tree/outliner of the document structure.

### 7.11 Collections

- Master list with Name / Slug / Scope (site / global) / field count.
- Inline create/edit form: Name + Slug (mono) inputs, plus three JSON textareas — **Field Definitions** (6 rows; supports types string, text, integer, float, boolean, datetime, date, url, select, list, reference), **JSON-LD Mapping** (8 rows; uses `{field}` interpolation), **Meta Tag Mapping** (6 rows). Helper text below each shows inline `<code>` examples.
- Two-step delete confirmation pattern.

### 7.12 GraphQL Endpoints

- 3-column lg grid: scrollable endpoint list (Name / URL) | edit form | schema summary.
- Form: Name, URL, **Auth Type** select (Bearer / Custom Header / None), Auth Header text, Credentials password (AES at rest), **Resilience** 3-col (Default TTL, Timeout ms, Max Retries).
- "Introspect Schema" button, summary box (queries / mutations counts).
- Sub-route schema viewer: search (debounced 300ms) + tabbed sections **Queries / Mutations / Types** with count badges. Operation cards show name (mono), description, return type (right-aligned mono), arguments table. Type cards show kind badge (OBJECT/SCALAR/ENUM), fields, enum values (amber pills).

### 7.13 Page Queries

Per-page binding of GraphQL to template variables:
- Modal create form: Endpoint select, Result Alias text (template variable name like `posts` → used as `@posts`), Query String textarea, optional Depends-On alias for execution ordering.
- Card list: numbered execution-order circle, `@alias` (mono), endpoint badge (gray), optional dependency badge (amber `depends on: …`), one-line variable bindings summary, gray pre-wrap query preview, X delete with confirmation.

### 7.14 Action Builder

A visual workflow editor — JSON document under the hood, but presented as steps:
- **Left**: action palette grouped by category (Navigation / Data / State / DOM / Feedback / Forms / Control), buttons add a step.
- **Center/Right**: ordered step list. Each step card has: up/down chevrons (disabled at boundaries), numbered index badge, action-type label, inline editable field inputs (variable widths), hover-revealed remove X.
- **Bottom**: live JSON preview block, pretty-printed.
- **Validation feedback** (conditional): green "valid" box or red bullet-list of errors.
- Empty state: dashed-border centered prompt.

### 7.15 Event Handlers / Info Handlers / JS Hooks

A shared three-column layout:
- Left scrollable list (Name / Format for events; Msg for info; Name for hooks).
- Right form: Name input + format toggle (Elixir vs Actions DSL — events only) + full-width Monaco editor.
- Editor language: Elixir (events, info), JavaScript (JS hooks).
- Helper hint: "Variables available: event_params socket" (events only).
- Compilation errors render below the editor.
- Modals: Create (single field), Delete confirm, "unsaved changes" navigation warning.

### 7.16 Error Pages

- Left sidebar: list of statuses (404, 500, etc.).
- Editor: Status (read-only), Layout select, Monaco HTML editor, Save / Delete.
- Create modal: Status select with valid HTTP error codes.
- Same unsaved-changes navigation pattern.

### 7.17 Site Settings

- Left sidebar: list of all settings keys with format.
- Right: Key (read-only), Format (read-only), description display, Monaco editor (language detected from format — HEEx → HTML, text → plaintext), Save Changes button.
- Unsaved-changes navigation modal.

### 7.18 Redirects

- Top-right "Create New Redirect" button.
- Inline form (Source Path, Destination Path with mono + arrow icons; Status Code select with verbose labels "301 — Permanent", "302 — Temporary", "307 — Temporary (preserve method)", "308 — Permanent (preserve method)").
- Table: Source (mono) | Destination (with arrow icon) | Status (indigo for 301/308, amber for 302/307, ring-bordered pill) | Hits (right-aligned tabular-nums) | Actions (edit + two-step delete).

### 7.19 Groups

- Top-right "Create New Group" button + inline create/edit form (Name, Description).
- Groups table: Name | Description (— if empty) | Members (badge with users icon + count) | Permissions (text summary "X permissions across Y features") | Actions (edit / **manage permissions** key icon / **manage members** user-plus icon / two-step delete).
- **Permission Matrix modal**: "Toggle permissions for each feature. Changes save automatically." Table with feature name rows × sub-feature checkbox columns. Sub-feature labels: uppercase 11px tracking-wide. Indigo-600 checkbox color. Auto-save on toggle (no separate save button).
- **Members modal**: two-column "Current Members" (avatar + email + remove) and "Available Users" (avatar + email + add).

### 7.20 SEO Audit / Measurement / Link Health

**SEO Audit:** 6-card KPI grid (Total / Good / Needs Work / Poor / No Desc / No OG) above a sortable details table with **score badge**, monospace path, title, **inline issue badges** (rose for missing, amber for length warnings, zinc for other), and per-row link to the page's SEO tab. Rows are tinted by severity (emerald-50/amber-50/rose-50).

**Measurement:** Time-range select (7/30/90 days), "Take Snapshot" CTA, KPI grid (Total Pages, With Description (success), With OG Image (success), Stale 90+ days (warning), With Canonical, With Collection, Redirects), History table of past snapshots. Empty state with chart-bar icon.

**Link Health:** Three click-toggle stat cards as tabs (Orphan Pages amber / Broken Links rose / Pages Analyzed sky), each driving a different table below — Orphans table (Path, Title, Edit), Broken Links table (Source Page, Broken Target in error color, Anchor Text), Link Stats table (Path, Title, Inbound bold-amber when 0, Outbound). Each tab has its own empty-state icon + message.

### 7.21 Beacon Admin (Owner)

**Users:** inline form (Email — disabled when editing — and Name), users table with avatar + email + name + Owner badge (purple, shield icon) + last-login timestamp + actions (edit / transfer ownership with two-step confirm / delete).

**Platform Settings:** read-only display until "Edit Settings" clicked, then form with Default AI Crawler Policy (Allow/Block/Conditional with colored badge), Default Meta Tags Display (Enabled/Disabled), Default Site Name, Default Title Template (mono with `%{page_title}` / `%{site_name}` placeholders).

**Global Collections:** same UI as site Collections, just scoped globally.

**Group Templates:** same UI as site Groups, but creates templates that are cloned into each new site.

---

## 8. Recurring Interaction Patterns

These patterns are used across many screens. New designs should provide refreshed visual treatments for each:

1. **Two-step inline destructive confirmation** in tables — a trash icon turns into "Delete?" + "Yes/No" buttons in place. Used everywhere instead of full modals for low-stakes table-row deletes.
2. **Unsaved-changes navigation modal** — when leaving an editor with dirty changes, a modal blocks navigation: "Stay here" (ghost) / "Discard changes" (error).
3. **Master/detail editors** — left list (scrollable, fixed height `calc(100vh - 239px)`) + right form/editor. Used by Site Settings, Error Pages, Events, Info Handlers, JS Hooks, GraphQL Endpoints, Variants.
4. **Sub-page pill nav** — entity sub-sections (Page → SEO/Meta/Schema/Variants/Revisions/Preview; Layout → Meta/Resource Links/Revisions/Preview) rendered as a pill group under the page header.
5. **Dynamic-row attribute editor** — used by Meta Tags and Resource Links: columns auto-derived from union of attributes; "New Row" + "New Attribute" (modal with preset chips); per-row trash.
6. **Code editor pane** — Monaco, dark `#0D1829`, full width, language driven by the entity's format. Always paired with a hidden form input that the editor writes to via `phx-change`.
7. **Auto-save toggles** — Group permission matrix saves on every checkbox toggle. Designs should make this explicit (e.g., a subtle "Saved" affordance).
8. **Live preview iframe** — used by Page Editor and Layout Editor. Today renders to 70vh; resizes well but lacks device-frame controls.
9. **Status pills with dot** — Draft (slate dot + label) vs Published (emerald dot + label). Re-used in many list views.
10. **Search + sort + pagination triplet** — the standard table top bar: search input (debounced, "showing up to 15 results" placeholder), sort `<select>`, paginated DaisyUI `join` button group.

---

## 9. Known Gaps & Opportunities for the Redesign

The current admin works but has clear UX gaps that the design service is welcome to address:

1. **No global top bar** — no breadcrumbs, no global search across pages/components/media, no notifications, no user menu in the chrome.
2. **No mobile-first thinking** — the sidebar can collapse, but most editors are desktop-only in spirit. Tables don't adapt; the visual editor is desktop-bound.
3. **Empty states are inconsistent** — some sections have them (Link Health, Measurement), most don't (Media Library, Pages list when empty, etc.).
4. **Media Library has no grid view, no bulk actions, no empty state, no in-place metadata editing.**
5. **Visual editor has no breakpoint switcher** (mobile/tablet/desktop preview), no element outliner, no inline error indicators per element.
6. **403/Forbidden** is unstyled plain text.
7. **Onboarding** is unaddressed — first-run, "no sites yet", "no pages yet" all need designed states.
8. **Notifications/activity feed** — there is none. A platform-wide audit log would benefit from one.
9. **Visual hierarchy is dense** — pages like SEO and the visual editor properties panel have a lot of fields with thin gaps. A clearer sectioning system would help.
10. **Tab nav vs sub-route nav** — there are multiple "tab-like" patterns (the pill nav, the workspace-mode toggle, the link-health stat cards) that look different. They could be unified.
11. **Keyboard shortcuts** are sparse (`Shift+Alt+F` format, `Alt+Z` wrap, `Esc` close picker). A documented shortcut palette (`⌘K`-style) would suit the developer audience.
12. **Form validation** is server-driven — designs should accommodate inline error messages with the existing red-icon-+-text pattern but improve their typography.

---

## 10. Deliverable Expectations for the Design Service

The output should provide, at minimum:

1. **A refreshed token system** — colors (light + dark), type scale, spacing, radii, shadow, motion — expressible as DaisyUI v4 themes + Tailwind v3 config.
2. **An icon strategy** — confirm Heroicons or propose a swap; ensure every navigation entry, action, and badge has a defined icon.
3. **A component library refresh** — buttons, inputs, selects, textareas, checkboxes, radios, badges, pills, tables (with search/sort/pagination), modals, drawers, dropdowns, popovers, toasts, alerts, breadcrumbs, tab nav, pagination, avatars, KPI cards, feature cards, empty states, loading/skeleton states, code editor frame, drag handles, status pills, severity pills.
4. **An updated global shell** — sidebar (collapsed + expanded, hover state per item, active state, group headers, site selector, owner-section divider, footer with user menu), optional top bar (with global search, notifications, user menu), theme toggle.
5. **Designs for every major screen listed in §7**, in both light and dark mode, including:
   - Empty states
   - Loading/skeleton states
   - Form-error states
   - Permission-denied states
   - Mobile breakpoints (where reasonable)
6. **Visual editor specifically** — a redesigned canvas + properties panel + component palette + breakpoint controls + selection/hover/drop affordances.
7. **Microcopy review** — flash messages, confirmations, helper text, empty-state copy.

If the design service introduces patterns that don't map cleanly to DaisyUI v4 + Tailwind v3 + LiveView, please flag them so we can plan implementation.

---

## 11. Brand & Tone Direction (Current)

The current product reads as: **competent, neutral, slightly developer-flavored**. Indigo-forward, generous whitespace inside cards, dense content lists, no illustration, no animation beyond functional transitions. The brand allows a more distinctive treatment — Beacon is a Dockyard product with a stated secondary brand color of `#FD4F00` (Dockyard orange) that is currently underused. The visual editor and dashboard would benefit from a stronger sense of identity (illustration, motion, signature charts).

---

## 12. Reference Files (Source of Truth)

For the design service to inspect the current implementation:

- Layout shell — `lib/beacon/live_admin/components/layouts/`, `lib/beacon/live_admin/live/page_live.html.heex`
- Component primitives — `lib/beacon/live_admin/components/core_components.ex`, `lib/beacon/live_admin/components/admin_components.ex`
- Theme tokens — `assets/css/beacon_live_admin.css`
- Visual editor — `lib/beacon/live_admin/components/visual_editor/`, `assets/js/hooks/`, `assets/js/beacon_live_admin.js`
- Per-feature LiveViews — `lib/beacon/live_admin/live/<feature>_live/`
- Routes — `lib/beacon/live_admin/router.ex`
- Permissions — `lib/beacon/live_admin/auth/`
- Tailwind/Daisy config — `assets/tailwind.config.js`, `assets/package.json`

---

*Document compiled by exhaustive review of the codebase. Every screen, route, modal, and component referenced above currently exists in the repository and is exercised by at least one LiveView.*
