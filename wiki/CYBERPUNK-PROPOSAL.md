# Cyberpunk UI Improvement Proposal - Wiki & Archive

## Current State
- **Wiki**: Dark theme with purple/teal glassmorphism, modern but generic
- **Archive**: Simple loading state, no distinctive styling
- **Problem**: No cyberpunk aesthetic, inconsistent between wiki/archive, weak navigation

## Cyberpunk Design System (based on Solaris)

### Color Palette
- **Background Primary**: `#0a0a0f` (deep black)
- **Background Secondary**: `#12121a` (dark panel)
- **Background Tertiary**: `#1a1a24` (card bg)
- **Neon Cyan**: `#00fff5` (primary accent - Solaris glow)
- **Neon Magenta**: `#ff00ff` (secondary accent)
- **Neon Orange**: `#ff6b35` (warning/highlight)
- **Text Primary**: `#e0e0e0`
- **Text Muted**: `#6b6b7b`
- **Border Glow**: `rgba(0, 255, 245, 0.3)`

### Design Elements
1. **Glowing borders** - Cyan glow on focus/hover
2. **Scanline overlay** - Subtle CRT effect
3. **Grid background** - Faint tech grid pattern
4. **Terminal-style headers** - `>_` prefix for section titles
5. **Neon text glow** - Text-shadow with accent colors
6. **Glitch effects** - Subtle on hover
7. **Corner accents** - Tech/cyber corners on cards
8. **Monospace fonts** - JetBrains Mono or similar for data

---

## Implementation Tasks

### 1. Main Archive (index.html)
**Location**: `/root/.openclaw/workspace-research-agent/index.html`

- [ ] Add cyberpunk CSS variables & global styles
- [ ] Replace gradient header with glowing border panel
- [ ] Style nav tabs with neon underline on active
- [ ] Add scanline overlay effect
- [ ] Add tech grid background
- [ ] Style buttons with neon glow on hover
- [ ] Add "Main Archive" ↔ "Wiki" navigation links in header
- [ ] Improve loading spinner (cyberpunk style)

### 2. Wiki (wiki/index.html)
**Location**: `/root/.openclaw/workspace-research-agent/wiki/index.html`

- [ ] Update header with consistent cyberpunk styling
- [ ] Add nav link to "Main Archive" 
- [ ] Style sidebar sections with glowing borders
- [ ] Add scanline effect overlay
- [ ] Update stat boxes with neon accents
- [ ] Add corner tech accents to topic cards
- [ ] Style filter/search with glowing focus states

### 3. Shared CSS (wiki/css/wiki.css)
**Location**: `/root/.openclaw/workspace-research-agent/wiki/css/wiki.css`

- [ ] Add cyberpunk color variables
- [ ] Add scanline overlay CSS
- [ ] Add grid background pattern
- [ ] Create `.cyber-card` class with corner accents
- [ ] Create `.neon-glow` class for buttons
- [ ] Create `.cyber-input` class for search
- [ ] Add glitch animation keyframes
- [ ] Style scrollbars (thin, cyan)

### 4. Archive-specific CSS
**Location**: Create `/root/.openclaw/workspace-research-agent/archive-styles.css`

- [ ] Copy cyberpunk variables from wiki.css
- [ ] Add archive-specific component styles
- [ ] Link from index.html

---

## Navigation Links (Critical)

Both pages MUST have:
- **Header nav**: `[Main Archive]` | `[Wiki]` - clearly visible
- **Footer**: Same links

Link URLs:
- Main Archive: `https://0volume.github.io/research-archive/` (root)
- Wiki: `https://0volume.github.io/research-archive/wiki/`

---

## Visual Checklist

- [ ] Both pages use same cyan `#00fff5` accent
- [ ] Both have scanline overlay effect
- [ ] Both have tech grid background
- [ ] Buttons glow on hover
- [ ] Navigation between pages works
- [ ] All fonts load correctly
- [ ] Mobile responsive (cyberpunk style works on small screens)

---

## Push & Verify

1. Push changes to GitHub
2. Verify both URLs load correctly
3. Test navigation links both ways
4. Confirm cyberpunk aesthetic is consistent
