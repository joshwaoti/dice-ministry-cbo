# Error Log - Rich Text / CSS Pipeline Issue

**Date:** Tue May 05 2026
**Trigger:** Added `@tailwindcss/typography` to `globals.css` for rich text `prose` rendering support

---

## Timeline of Changes & Errors

### 1. Initial CSS Breakage
**Action:** Modified `app/globals.css` to add typography import:
```css
@import "@tailwindcss/typography/css";
```
**Result:** Entire CSS pipeline broke. All pages lost styling globally.

**Root Cause:** This import syntax is invalid for Tailwind CSS v4. The project uses `tailwindcss@4.1.11` (v4), which changed how plugins are loaded.

---

### 2. Attempted Fix #1
**Action:** Changed the import to Tailwind v4 plugin syntax:
```css
@plugin "@tailwindcss/typography";
```
**Result:** Site returned HTTP 500 - Internal Server Error. The `@tailwindcss/typography@0.5.19` package is built for Tailwind v3 and is NOT compatible with Tailwind v4's `@plugin` directive. This caused a webpack build failure.

**Error:** `Jest worker encountered 2 child process exceptions, exceeding retry limit`

---

### 3. Reverted Fix & Restarted Dev Server
**Action:** Removed the `@plugin` line entirely from `globals.css`. Killed and restarted dev server.
**Result:** Server started on port 3002 (port 3000 had stale process with broken cached state). Site returned HTTP 200. CSS works again.

**Problem:** Without any typography plugin, the `prose` classes used in the student unit viewer (`app/student/courses/[courseId]/[moduleId]/[unitId]/page.tsx`) will NOT render rich HTML content with proper formatting. The TipTap rich text editor works, but the output won't be styled on the student-facing pages.

---

### 4. Lint Error Fix (Unrelated but Resolved)
**Action:** Fixed `react-hooks/set-state-in-effect` error in `app/admin/courses/[id]/page.tsx`.
**Change:** Replaced `useEffect` pattern that called `setCourseTitle/setCourseSynopsis` with direct conditional initialization using `draftTitle/draftSynopsis` state variables.
**Result:** Lint went from 1 error + 7 warnings → 0 errors + 7 warnings (remaining warnings are pre-existing `<img>` and unused eslint directives in `_generated` files).

---

## Current State

### `app/globals.css` (lines 1-4)
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
```
No typography/prose support loaded.

### `package.json`
- `tailwindcss@4.1.11` - Tailwind v4
- `@tailwindcss/typography@0.5.19` - Tailwind v3 plugin (incompatible)
- `@tailwindcss/postcss@4.1.11` - v4 PostCSS plugin (correct)
- `@tiptap/react@3.22.4` + related - Rich text editor (installed, works)

### All Ports
- All Node processes on ports 3000-3003 have been killed.

---

## Open Issues

1. **No prose styling for student unit pages** - Rich text content from TipTap will render as unstyled HTML
2. **`@tailwindcss/typography@0.5.x` is incompatible with Tailwind v4** - Need a different approach:
   - Option A: Write custom `.prose` CSS rules manually in `globals.css`
   - Option B: Find a Tailwind v4-compatible typography solution
   - Option C: Downgrade to Tailwind v3 (not recommended, would break everything else)
3. **Dev server port issue** - Old node processes keep lingering and occupying ports

---

## Files Modified
- `app/globals.css` - Added then removed typography import
- `app/admin/courses/[id]/page.tsx` - Fixed setState-in-effect lint error
