# Wiki & Archive UI Improvement Proposal - Cyberpunk Theme v3

**Date:** February 24, 2026  
**Time:** 3:52 AM UTC  
**Reviewer:** code-review (subagent)

---

## Live Sites Reviewed
- **Wiki:** https://0volume.github.io/research-archive/wiki/
- **Archive:** https://0volume.github.io/research-archive/

---

## Current State Assessment

### ✅ What's Working Well
1. **Navigation Links**: Wiki ↔ Archive links now work correctly
   - Wiki uses `../` to link to archive root
   - Archive uses `wiki/` to link to wiki
2. **Shared CSS**: Both use `wiki/css/wiki.css` - ensures consistency
3. **Cyberpunk Theme**: Neon colors (cyan #00fff5, magenta #ff00ff), glow effects, scanlines, tech grid background
4. **Typography**: Orbitron, Rajdhani, JetBrains Mono fonts in use
5. **Responsive Design**: Breakpoints at 1024px and 640px exist

### ⚠️ Issues Identified

#### 1. Visual Consistency Gaps (vs Solaris Reference)
- **Archive title**: Uses gradient (cyan→magenta) ✅ ALREADY DONE
- **Wiki title**: Plain cyan - should match with gradient
- **Entry card corners**: Cyan by default, should be more dynamic
- **Loading states**: Basic spinner - could add "typing" effect

#### 2. Interactive Elements
- Filter buttons: Good hover/active states
- Stat boxes: Have hover glow
- Cards: Have corner accents and hover effects
- **Missing**: No "ripple" or "pulse" on click for buttons

#### 3. Mobile Responsiveness
- Media queries exist at 1024px and 640px
- **Potential issues**: 
  - Sidebar stacks on top but may need better touch targets
  - Filter buttons on mobile may need horizontal scroll
  - Nav items may overflow on small screens

#### 4. Minor Issues
- Wiki "HOME" link uses `./index.html` - works but could use consistency
- No keyboard navigation support
- No smooth scroll behavior

---

## Proposed Improvements

### Priority 1: Visual Polish (Solaris Match)
1. **Add gradient to wiki title** - Match archive's gradient title
   ```css
   /* Solaris-style gradient title */
   .wiki-title h1 {
     background: linear-gradient(135deg, var(--neon-cyan), var(--neon-magenta));
     -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
   }
   ```

2. **Enhance card hover states** - Add subtle scale + glow
   ```css
   .topic-card:hover, .entry-card:hover {
     transform: translateY(-4px) scale(1.01);
   }
   ```

3. **Improve button animations** - Add transition easing
   ```css
   .filter-btn, .wiki-nav a {
     transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
   }
   ```

### Priority 2: Mobile Improvements
4. **Better touch targets** - Increase button padding on mobile
5. **Horizontal scroll for filters** - Allow overflow-x on filters
6. **Stacked navigation** - Ensure nav wraps properly

### Priority 3: Micro-interactions
7. **Add click ripple effect** to buttons
8. **Smooth scroll** for anchor links
9. **Keyboard navigation** (Esc to go back)

---

## Implementation Plan

### Step 1: CSS Enhancements
Modify `/wiki/css/wiki.css`:
- Add gradient title for `.wiki-title h1`
- Enhance card hover with scale transform
- Improve transition timing functions
- Add mobile-specific touch improvements

### Step 2: Test
- Verify wiki ↔ archive navigation
- Check mobile responsiveness
- Confirm all interactive elements work

---

## Files to Modify
- `/wiki/css/wiki.css` - Visual enhancements

---

## Action Required
Spawn **code-agent** to implement CSS improvements per this proposal.

**Goal:** Complete cyberpunk visual consistency matching Solaris portal style.
