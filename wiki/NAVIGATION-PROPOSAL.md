# Wiki Navigation & Data Translation - Implementation Plan

**Created:** 2026-02-24  
**Purpose:** Fix broken navigation and data loading for thoughts/pitches

---

## Current State Analysis

### What Exists
| Component | Location | Status |
|-----------|----------|--------|
| `data/research.json` | Root `data/` | ✅ Exists, 39KB |
| `data/topics.json` | Root `data/` | ✅ Exists, 34KB |
| `data/thoughts.json` | Root `data/` | ❌ Missing |
| `data/pitches.json` | Root `data/` | ❌ Missing |
| Pitch HTML files | Root (`pitch-1.html` to `pitch-5.html`) | ✅ Exist |
| Thought log | `thought-log.md` | ✅ Exists |
| Wiki topics.json | `wiki/data/topics.json` | ✅ Exists |
| Build script | `wiki/build.js` | ⚠️ Incomplete |

### The Problems

1. **Thoughts show zero** - `data/thoughts.json` doesn't exist; `index.html` expects it from GitHub
2. **Pitches show zero** - `data/pitches.json` doesn't exist; pitch HTML files are standalone, not referenced
3. **Navigation issues** - Hash-based navigation exists but section display may have CSS/layout issues

---

## Solution Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PROPOSED ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  thought-log.md ──► build.js ──► data/thoughts.json ◄── index  │
│       │                                                       │
│       │              (auto-generate)                          │
│       ▼                                                       │
│  notes/*.md ─────────────────────────────────────────► (used)  │
│                                                                 │
│  pitch-*.html ──► build.js ──► data/pitches.json ◄── index    │
│       │                                                       │
│       │              (auto-generate)                          │
│       ▼                                                       │
│  (standalone) ─────────────────────────────────────► (link)   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 1: Data Translation Layer

### 1.1 Create `data/pitches.json`

**Schema:**

```json
{
  "generated": "2026-02-24T12:00:00Z",
  "total": 5,
  "pitches": [
    {
      "id": 1,
      "title": "Tool Specification Template",
      "description": "Create a clear template for tool specifications...",
      "status": "pending",
      "priority": "normal",
      "file": "pitch-1.html",
      "url": "https://github.com/0volume/research-archive/blob/main/pitch-1.html",
      "date": "2026-02-17",
      "credits": 0,
      "linkedPapers": ["#4", "#9"],
      "phases": []
    },
    {
      "id": 2,
      "title": "Research Agent Team",
      "description": "Build a multi-agent research team...",
      "status": "pending",
      "priority": "normal",
      "file": "pitch-2.html",
      "url": "https://github.com/0volume/research-archive/blob/main/pitch-2.html",
      "date": "2026-02-17",
      "credits": 0,
      "linkedPapers": [],
      "phases": []
    }
    // ... pitches 3-5
  ]
}
```

**Implementation:**

The build script should scan the root directory for `pitch-*.html` files, extract metadata from each, and generate `data/pitches.json`.

### 1.2 Create `data/thoughts.json`

**Schema:**

```json
{
  "generated": "2026-02-24T12:00:00Z",
  "total": 4,
  "thoughts": [
    {
      "id": "001",
      "date": "2026-02-17",
      "title": "Entry 001 - Peer Learning & MCP Tools",
      "type": "insight",
      "content": "Paper #9 (OpenClaw Peer Learning) is about ME...",
      "url": "https://github.com/0volume/research-archive/blob/main/thought-log.md"
    },
    {
      "id": "002", 
      "date": "2026-02-17",
      "title": "Entry 002 - Evolutionary Prompt Learning",
      "type": "insight",
      "content": "Evolutionary Prompt Learning - Instead of manually...",
      "url": "https://github.com/0volume/research-archive/blob/main/thought-log.md"
    },
    {
      "id": "003",
      "date": "2026-02-17",
      "title": "Hallucination Self-Improvement",
      "type": "commitment",
      "content": "D called out that my links were fabricated...",
      "url": "https://github.com/0volume/research-archive/blob/main/thought-log.md"
    },
    {
      "id": "004",
      "date": "2026-02-23",
      "title": "Fact-Check: Pitch #5 - Verification Results",
      "type": "factcheck",
      "content": "Fact-checked Pitch #5 - all URLs work, 1 fabricated stat found...",
      "url": "https://github.com/0volume/research-archive/blob/main/thought-log.md"
    }
  ]
}
```

**Implementation:**

Parse `thought-log.md` and extract entries based on the `## Entry` or `### Entry` headers. Each entry becomes a thought object.

---

## Part 2: Build Script Updates

### 2.1 Modified `wiki/build.js`

**Add these functions:**

```javascript
/**
 * NEW: Build pitches.json from pitch-*.html files in parent directory
 */
function findPitches() {
  const pitchesDir = path.join(__dirname, '..');
  const pitches = [];
  
  // Find all pitch-*.html files
  const files = fs.readdirSync(pitchesDir).filter(f => /^pitch-\d+\.html$/.test(f));
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(pitchesDir, file), 'utf-8');
    const pitch = extractPitchMetadata(content, file);
    if (pitch) {
      pitches.push(pitch);
    }
  }
  
  return pitches.sort((a, b) => a.id - b.id);
}

function extractPitchMetadata(content, filename) {
  // Extract ID from filename (pitch-1.html -> 1)
  const idMatch = filename.match(/pitch-(\d+)\.html/);
  if (!idMatch) return null;
  
  const id = parseInt(idMatch[1]);
  
  // Extract title from <title> or <h1>
  const titleMatch = content.match(/<title>Pitch #\d+:?\s*(.+?)(?:\s*-|$)/) ||
                     content.match(/<h1[^>]*>Pitch #\d+:?\s*(.+?)(?:<\/h1>|$)/i);
  const title = titleMatch ? titleMatch[1].trim() : `Pitch #${id}`;
  
  // Extract status
  const statusMatch = content.match(/class="status-badge\s+(\w+)"/);
  const status = statusMatch ? statusMatch[1] : 'pending';
  
  // Extract date
  const dateMatch = content.match(/(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
  
  // Extract description/summary
  const summaryMatch = content.match(/<p class="summary">(.+?)<\/p>/i) ||
                       content.match(/<h2>Summary<\/h2>\s*<p[^>]*>(.+?)<\/p>/i);
  const description = summaryMatch ? summaryMatch[1].trim() : '';
  
  // Extract linked papers (look for ### Linked Papers section)
  const linkedMatch = content.match(/### Linked Papers[\s\S]+?<a[^>]*href="([^"]+)"[^>]*>/gi);
  const linkedPapers = [];
  if (linkedMatch) {
    linkedMatch.forEach(match => {
      const idMatch = match.match(/#(\d+)/);
      if (idMatch) linkedPapers.push('#' + idMatch[1]);
    });
  }
  
  return {
    id,
    title,
    description,
    status,
    priority: 'normal',
    file: filename,
    url: `https://github.com/0volume/research-archive/blob/main/${filename}`,
    date,
    credits: 0,
    linkedPapers,
    phases: []
  };
}

/**
 * NEW: Build thoughts.json from thought-log.md
 */
function findThoughts() {
  const thoughtLogPath = path.join(__dirname, '..', 'thought-log.md');
  
  if (!fs.existsSync(thoughtLogPath)) {
    return [];
  }
  
  const content = fs.readFileSync(thoughtLogPath, 'utf-8');
  const thoughts = [];
  
  // Parse entries - look for ## Entry | Date or ### Entry ### Date
  const entryRegex = /##?\s*Entry\s*\|?\s*(\d{4}-\d{2}-\d{2})|###\s*Entry\s*\|\s*(\d{4}-\d{2}-\d{2})/gi;
  let match;
  
  // Split by entries
  const sections = content.split(/(?=##\s*Entry\s*\|)/);
  
  for (const section of sections) {
    if (!section.includes('Entry')) continue;
    
    // Extract date
    const dateMatch = section.match(/(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : null;
    if (!date) continue;
    
    // Extract title from first line
    const titleLines = section.split('\n').filter(l => l.trim());
    const title = titleLines[0]?.replace(/^#+\s*/, '').trim() || `Entry ${date}`;
    
    // Extract content (first 200 chars after title)
    const contentMatch = section.match(/###\s*What [IWe] [Rr]ead.*?\n+([\s\S]{100,500}?)(?=\n###|\n##|\n---)/i);
    const content = contentMatch ? contentMatch[1].trim() : section.substring(0, 200);
    
    // Determine type
    let type = 'insight';
    if (section.toLowerCase().includes('fact-check')) type = 'factcheck';
    else if (section.toLowerCase().includes('commitment') || section.toLowerCase().includes('self-improvement')) type = 'commitment';
    
    thoughts.push({
      id: thoughts.length + 1,
      date,
      title,
      type,
      content: content.substring(0, 300),
      url: 'https://github.com/0volume/research-archive/blob/main/thought-log.md'
    });
  }
  
  return thoughts;
}
```

**Update the main build function:**

```javascript
function build() {
  console.log('🔨 Building research wiki data...');
  
  const topics = findTopics();
  const pitches = findPitches();      // NEW
  const thoughts = findThoughts();    // NEW
  const recentUpdates = getRecentUpdates(topics);
  
  const data = {
    generated: new Date().toISOString(),
    topics,
    pitches,
    thoughts,
    recentUpdates,
    totalTopics: topics.length,
    totalPitches: pitches.length,
    totalThoughts: thoughts.length
  };
  
  // Write topics to wiki/data/topics.json
  const wikiData = { generated: data.generated, topics, recentUpdates, totalTopics: topics.length };
  const wikiOutput = path.join(__dirname, 'data', 'topics.json');
  fs.writeFileSync(wikiOutput, JSON.stringify(wikiData, null, 2));
  
  // Write pitches and thoughts to parent data/
  const rootDataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(rootDataDir)) {
    fs.mkdirSync(rootDataDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(rootDataDir, 'pitches.json'), JSON.stringify({
    generated: data.generated,
    total: pitches.length,
    pitches
  }, null, 2));
  
  fs.writeFileSync(path.join(rootDataDir, 'thoughts.json'), JSON.stringify({
    generated: data.generated,
    total: thoughts.length,
    thoughts
  }, null, 2));
  
  console.log(`✅ Built ${topics.length} topics`);
  console.log(`✅ Built ${pitches.length} pitches`);
  console.log(`✅ Built ${thoughts.length} thoughts`);
  
  return data;
}
```

---

## Part 3: Navigation Fixes

### 3.1 Anchor Link Fixes in `index.html`

**Current issue:** Clicking `#pitches` scrolls but section may not display properly due to CSS or JavaScript issues.

**Fix in JavaScript (already exists but may need adjustment):**

```javascript
// Enhanced showSection function
function showSection(id) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  
  // Show target section
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    
    // Smooth scroll to section
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  // Update nav active state
  document.querySelectorAll('.archive-nav a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + id || a.getAttribute('href') === './index.html#' + id) {
      a.classList.add('active');
    }
  });
  
  // Update URL hash without scrolling
  history.replaceState(null, null, '#' + id);
}
```

### 3.2 Add Breadcrumb Trails

**In the sidebar, add breadcrumbs:**

```html
<div class="sidebar-section breadcrumbs">
  <h3>// LOCATION</h3>
  <div class="breadcrumb-trail">
    <a href="./index.html">Home</a>
    <span class="breadcrumb-sep">›</span>
    <span class="breadcrumb-current" id="breadcrumb-current">Research</span>
  </div>
</div>
```

```javascript
// Update breadcrumb when section changes
function updateBreadcrumb(sectionName) {
  const breadcrumb = document.getElementById('breadcrumb-current');
  if (breadcrumb) {
    breadcrumb.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
  }
}

// Call in showSection:
updateBreadcrumb(id);
```

### 3.3 Wiki ↔ Archive Navigation

**Current state:** Wiki links to archive (`../index.html`) and vice versa (`wiki/`)

**Enhancement:** Add contextual return links:

```html
<!-- In wiki/index.html - add contextual back link -->
<div class="wiki-context-nav">
  <a href="../index.html#research" class="context-link">
    ← Back to Research Archive
  </a>
</div>

<!-- In index.html - when viewing from wiki context -->
<div class="archive-context-nav">
  <a href="wiki/index.html" class="context-link">
    Wiki Overview →
  </a>
</div>
```

---

## Part 4: Page Layouts

### 4.1 Research Section Layout (Existing - Works)

```html
<div id="research" class="section active">
  <!-- Filters -->
  <div class="filters-row">...</div>
  <!-- Cards grid -->
  <div id="research-list">...</div>
</div>
```

### 4.2 Thoughts Section Layout

```html
<div id="thoughts" class="section">
  <div class="thoughts-header">
    <h2>💭 Research Thoughts</h2>
    <span class="thought-count">Total: <span id="thoughts-count">0</span></span>
  </div>
  <div class="thoughts-grid" id="thoughts-list">
    <!-- Rendered from thoughts.json -->
  </div>
</div>
```

**CSS for thought cards:**

```css
.thought-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border: 1px solid var(--neon-magenta);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.thought-card .thought-date {
  color: var(--neon-cyan);
  font-size: 0.8rem;
}

.thought-card .thought-type {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  text-transform: uppercase;
  background: var(--neon-magenta);
}
```

### 4.3 Pitches Section Layout

```html
<div id="pitches" class="section">
  <div class="pitches-header">
    <h2>🎯 Action Pitches</h2>
    <a href="https://github.com/0volume/research-archive/tree/main" target="_blank" class="nav-tab">
      View on GitHub →
    </a>
  </div>
  <div class="pitches-grid" id="pitches-list">
    <!-- Rendered from pitches.json -->
  </div>
</div>
```

**CSS for pitch cards:**

```css
.pitch-card {
  background: linear-gradient(135deg, rgba(0, 255, 136, 0.05), rgba(0, 255, 255, 0.05));
  border: 1px solid var(--neon-green);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.pitch-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 255, 136, 0.2);
}

.pitch-card .pitch-status {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.pitch-card .pitch-status.pending { background: #f39c12; }
.pitch-card .pitch-status.approved { background: #27ae60; }
.pitch-card .pitch-status.in-progress { background: #3498db; }
```

---

## Part 5: Sidebar Stats Accuracy

### 5.1 Current Stats Display

```html
<div class="sidebar-stats">
  <div class="stat-box">
    <div class="stat-number" id="stat-categories">-</div>
    <div class="stat-label">Categories</div>
  </div>
  <div class="stat-box">
    <div class="stat-number" id="stat-entries">-</div>
    <div class="stat-label">Entries</div>
  </div>
  <div class="stat-box">
    <div class="stat-number" id="stat-thoughts">-</div>
    <div class="stat-label">Thoughts</div>
  </div>
  <div class="stat-box">
    <div class="stat-number" id="stat-pitches">-</div>
    <div class="stat-label">Pitches</div>
  </div>
</div>
```

### 5.2 Update Function (Already exists, verify it works)

```javascript
function updateStats(research, thoughts, pitches) {
  const researchArray = research || [];
  document.getElementById('stat-entries').textContent = researchArray.length;
  document.getElementById('stat-thoughts').textContent = (thoughts || []).length;
  document.getElementById('stat-pitches').textContent = (pitches || []).length;
  
  const categories = new Set(researchArray.map(r => r.category));
  document.getElementById('stat-categories').textContent = categories.size;
}
```

**Expected results after fix:**
- **Categories:** 7 (from research.json)
- **Entries:** ~200 (from research.json)
- **Thoughts:** 4 (from thought-log.md → thoughts.json)
- **Pitches:** 5 (from pitch-*.html → pitches.json)

---

## Part 6: Implementation Checklist

### Phase 1: Data Generation (Priority: HIGH)
- [ ] Update `wiki/build.js` to generate `data/pitches.json`
- [ ] Update `wiki/build.js` to generate `data/thoughts.json`  
- [ ] Run build script and verify JSON files are created
- [ ] Commit to GitHub

### Phase 2: Archive UI Fixes (Priority: HIGH)
- [ ] Verify index.html loads new JSON files from GitHub
- [ ] Test #thoughts and #pitches anchor navigation
- [ ] Verify sidebar stats update correctly
- [ ] Fix any CSS issues with section visibility

### Phase 3: Navigation Enhancements (Priority: MEDIUM)
- [ ] Add breadcrumb trail to index.html
- [ ] Add contextual back links
- [ ] Test wiki ↔ archive navigation flow

### Phase 4: Polish (Priority: LOW)
- [ ] Improve thought/pitch card styling
- [ ] Add filtering to thoughts and pitches
- [ ] Add search support for thoughts/pitches

---

## Files to Modify

| File | Changes |
|------|---------|
| `wiki/build.js` | Add `findPitches()`, `findThoughts()`, update `build()` |
| `index.html` | Verify navigation works, add breadcrumbs if needed |
| `css/shared.css` | Add styles for thought/pitch cards |

---

## Testing Checklist

After implementation, verify:

1. **GitHub Data Loading**
   - Visit https://0volume.github.io/research-archive/
   - Open DevTools Console
   - Should see no errors loading data

2. **Sidebar Stats**
   - Categories: 7
   - Entries: ~200
   - Thoughts: 4
   - Pitches: 5

3. **Navigation**
   - Click "#research" → scrolls to research section
   - Click "#thoughts" → scrolls to thoughts section, shows 4 entries
   - Click "#pitches" → scrolls to pitches section, shows 5 entries

4. **Pitch Links**
   - Each pitch card should link to the actual pitch-*.html file on GitHub
   - Clicking should open the full pitch in a new tab

---

## Notes for Code Agent

1. **The build script needs to be run manually** after creating the new functions, or set up a GitHub Actions workflow to run it on push.

2. **JSON files must be in the `data/` directory** at the repository root so they can be fetched via raw.githubusercontent.com.

3. **The current index.html code already handles missing data gracefully** - it shows "No thoughts recorded yet" or "No pitches yet" if the JSON files are missing or empty.

4. **For the anchor navigation fix**, the CSS class `.section` should have `display: none` by default and `display: block` when active. Verify this is working.

5. **Thought content extraction** from thought-log.md is complex - the format varies. Start with basic extraction and refine the regex patterns as needed.

---

*End of Implementation Plan*
