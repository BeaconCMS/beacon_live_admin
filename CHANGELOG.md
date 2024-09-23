# Changelog

## 0.1.0-dev

## 0.1.0-rc.2 (2024-09-21

### Breaking Changes
  * Require minimum Elixir v1.14
  * Require minimum Gettext v0.26 to use the new backend module

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
