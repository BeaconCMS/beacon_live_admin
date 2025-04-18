# Changelog

## Unreleased
  - [Visual Editor] Added Color Picker to change border color
  - [Deps] Require minimum Phoenix LiveView v1.0.0

## 0.4.3 (2025-03-31)

### Fixes
  - [Components] Remove gap in components attributes editor
  - [Event Handlers] Fix event_params in "variables available" message
  - [Deps] Relax `:tailwind` version

### Changes
  - [Deps] Vendor heroicons using the npm package

## 0.4.2 (2025-03-24)

### Enhancements
  - [Visual Editor] Added Border controls
  - [Visual Editor] Added Padding controls
  - [Visual Editor] Added Margin controls
  - [Visual Editor] Added Layout controls
  - [Visual Editor] Added Typography controls
  - [Deps] Bump Svelte to v5
  - [Deps] Update heroicons

### Fixes
  - [Media Library] Fix search when form is submitted

## 0.4.1 (2025-02-20)

### Enhancements
  - Added `:session` option to `beacon_live_admin/2`

### Fixes
  - Properly forwards and execute `on_mount` hooks on pages
  - Remove StationUI components from docs
  - Remove VisualEditor components from docs
  - Compiler warning for unreachable `cond` clause in dev env

## 0.4.0 (2025-02-12)

### Enhancements
  - Adds page to define custom JS Hooks
  - Updated UI styling with StationUI
  - Unsaved changes will now be saved when publishing, instead of discarded
  - Adds Unpublish button to Page editor
  - Page editor now shows draft/published status
  - [Visual Editor] Add Opacity property control

### Fixes
  - Fixed a bug where MediaLibrary could check for file contents on the wrong node in multi-node deployments
  - Fixed a bug where using the code editor could reset other form fields on the page
  - Saving as draft no longer resets the form for new pages
  - Pin Tailwind v3 to avoid errors with the unsupported v4
  - Properly start `:pg` in the supervision tree to avoid init errors

### Chores
  - Remove unnecessary node check on RPC calls
  - [Visual Editor] Migrate the sidebar from Svelte to LiveView
  - Make `:igniter` optional

### Breaking Changes
  - Require minimum `:igniter` v0.5
  - `beacon_live_admin.install` - removed command alias `-p`

## 0.3.1 (2024-12-12)

### Fixes
  - Support LiveView 0.20
  - Fix "new meta tag" modal close event being sent to wrong target

## 0.3.0 (2024-12-05)

### Enhancements
  - Support Phoenix LiveView 1.0
  - Introduce `Beacon.LiveAdmin.Config`

### Fixes
  - [Visual Editor] Decode HTML entities in Tailwind compiler

### Chores
  - Remove unused router helper `beacon_live_admin_url/4`

## 0.2.0 (2024-11-14)

### Enhancements
  - Add `beacon_live_admin.install` Igniter task
  - [Media Library] Display asset file name on show details to allow easy copy and paste

### Fixes
  - [Visual Editor] Pass down slot to nested components
  - [Visual Editor] Improve flow detection

## 0.1.1 (2024-10-23)

### Fixes
  - [Visual Editor] Allow to drop elements into the page over the layout
  - [Visual Editor] Fix small bug that prevented deleting an item

## 0.1.0 (2024-10-09)

### Enhancements
  - [Visual Editor] Keep comments in their correct position in the tree #268
  - [Visual Editor] Allow to drag the parent of the selected element #267
  - [Visual Editor] Improve bidirectional drag and drop #266
  - [Visual Editor] Animate drag and drop using FLIP approach and simplify calculation of all elements #264
  - Reorder pages - [#261](https://github.com/BeaconCMS/beacon_live_admin/pull/261)
  - Added Shared Info Handlers (`info_handle` callbacks) page - [#210](https://github.com/BeaconCMS/beacon_live_admin/pull/210) by [@ddink](https://github.com/ddink)

### Fixes
  - [Page Editor] remove path whitespace in new pages form
  - Remove unnecessary `:plug_cowboy` dependency - [#262](https://github.com/BeaconCMS/beacon_live_admin/pull/262)

### Documentation
  - Fix install guide link

## 0.1.0-rc.2 (2024-09-21

### Breaking Changes
  - Require minimum Elixir v1.14
  - Require minimum Gettext v0.26 to use the new backend module

### Fixes
  - [Visual Editor] Fix a race condition between update AST and save change events - [#240](https://github.com/BeaconCMS/beacon_live_admin/pull/240)
  - Skip `PageBuilder.Table.handle_params/3` when the requested page has no pagination data - [#236](https://github.com/BeaconCMS/beacon_live_admin/pull/236)

### Enhancements
  - [Visual Editor] Improve DnD highlight states and simplify logic significantly - [#219](https://github.com/BeaconCMS/beacon_live_admin/pull/219)
  - [Visual Editor] Better detect overlapping when dragging elements to reorder - [#216](https://github.com/BeaconCMS/beacon_live_admin/pull/216)
  - [Visual Editor] Display a delete icon on selected elements - [#209](https://github.com/BeaconCMS/beacon_live_admin/pull/209)
  - [Visual Editor] Better detect horizontal/vertical drag and drop flow - [#215](https://github.com/BeaconCMS/beacon_live_admin/pull/215)

### Fixes
  - [Dev] Fix tailwind watch config
  - [Visual Editor] Fix drag button orientation - [#218](https://github.com/BeaconCMS/beacon_live_admin/pull/218)
  - [Visual Editor] Do not show drag buttons on elements that are only children - [#217](https://github.com/BeaconCMS/beacon_live_admin/pull/217)
  - [Visual Editor] Keep current element select after drag and drop event - [#214](https://github.com/BeaconCMS/beacon_live_admin/pull/214)

## 0.1.0-rc.1 (2024-08-27)

### Enhancements
  - [Event Handler] Added Event Handlers - [#195](https://github.com/BeaconCMS/beacon_live_admin/pull/195)
  - [Visual Editor] Allow to reorder an element among its siblings with drag and drop - [#174](https://github.com/BeaconCMS/beacon_live_admin/pull/174)

### Fixes
  - [Visual Editor] Disable dragLeave trigger on drag placeholder - [#208](https://github.com/BeaconCMS/beacon_live_admin/pull/208)
  - [Visual Editor] Reset drag states when dropping, even on invalid targets - [#206](https://github.com/BeaconCMS/beacon_live_admin/pull/206)
  - [Visual Editor] Disable interacting with iframes - [#198](https://github.com/BeaconCMS/beacon_live_admin/pull/198)
  - Remove defunct reference to agent assigns - [#200](https://github.com/BeaconCMS/beacon_live_admin/pull/200) by @kelcecil

## 0.1.0-rc.0 (2024-08-02)

### Enhancements
  - Media Library
    - Upload, preview, and display image location
    - Sorting and pagination
  - Error Page
  - Components
    - Sorting and pagination
  - Layouts
    - Sorting and pagination
  - Pages
    - Visual Editor with HEEx and 2-way sync support
    - Sorting and pagination
  - Live Data
  - Custom Pages
  - Router helper `~p` to generate paths with site prefixes
  - Content management through the `Beacon.Content` API
  - A/B Variants
  - TailwindCSS compiler
