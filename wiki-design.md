# Research Wiki Design Document

## Overview

The Research Wiki is a client-side web application that presents research topics, papers, and implementation plans in an accessible, navigable format. It generates a JSON manifest from local research files and renders it dynamically in the browser.

## Problems Solved

1. **404 on implementation links** - Implementation plans are now EMBEDDED directly in the JSON, not linked externally
2. **Research data not connected** - Papers, findings, and implementations are all linked within each topic
3. **GitHub Pages subfolder issues** - Uses query parameters (`?topic=slug`) instead of file-based routing
4. **Broken links** - All content is self-contained; external links are used only for source papers

---

## Data Sources

### Local Sources
| Path | Content |
|------|---------|
| `research/topics/*/index.json` | Topic metadata, papers, key findings, phases |
| `research/topics/*/papers/*.md` | Individual paper content (optional detailed view) |
| `research/topics/*/implementation-plan.md` | Full implementation plan (embedded in JSON) |

### Data Flow
```
research/topics/*/index.json
    ├── topic metadata
    ├── papers[] → papers/*.md files
    └── phases[] → embedded in JSON

research/topics/*/implementation-plan.md
    └── EMBEDDED ENTIRELY in topic JSON
```

---

## Wiki Structure

### Pages

#### 1. Homepage (`index.html`)
- Search bar for filtering topics
- Grid of topic cards showing:
  - Topic name
  - Description (truncated)
  - Key findings tags
  - Paper count
  - Implementation availability badge
  - Agent attribution
- Recent updates list
- Navigation: Home | Add Topic (info only)

#### 2. Topic Detail Page (`?topic=slug`)
- Breadcrumb navigation
- Topic header with:
  - Title
  - Description
  - Creation date
  - Agent attribution
- **Key Findings Section** - Bulleted list of research insights
- **Implementation Plan Section** - **EMBEDDED** directly (not linked!)
  - Expandable/collapsible sections
  - Phase timeline with deliverables
  - Code snippets inline
- **Research Papers Section**
  - Links to external paper URLs (arXiv, blogs)
  - Paper metadata (authors, date, source)
  - Key insights from each paper
- Previous/Next topic navigation

#### 3. Paper Detail (Optional Modal/Expandable)
- Full paper content when available
- Link to external source

---

## Navigation

### Header
- Logo: "Research Wiki" → index.html
- Nav links: Topics, Add Topic (info)

### Topic Card → Topic Detail
- Click card → `?topic={slug}`

### Topic Detail Navigation
- Breadcrumb: Home > Topic Name
- Previous/Next links at bottom
- Back to top button

### Search
- Real-time filtering as user types
- Searches topic names, descriptions, findings
- Keyboard shortcut: `/` to focus

### Keyboard Shortcuts
- `/` - Focus search
- `Esc` - Clear search / return to home
- `←/→` - Previous/Next topic (when on topic page)

---

## Technical Implementation

### Build Script (`build.js`)

Generates `data/topics.json` with:

```json
{
  "generated": "ISO timestamp",
  "topics": [
    {
      "slug": "topic-folder-name",
      "name": "Display Title",
      "description": "Full description",
      "created": "YYYY-MM-DD",
      "status": "research-complete|researching|implementation",
      "agent": "research-agent",
      "keyFindings": ["finding 1", "finding 2"],
      "papers": [
        {
          "id": 1,
          "title": "Paper Title",
          "authors": "Author names",
          "date": "YYYY-MM-DD",
          "source": "arXiv|Blog|Paper",
          "url": "https://...",
          "keyInsight": "One-line insight"
        }
      ],
      "phases": [
        {
          "phase": 1,
          "name": "Phase Name",
          "weeks": "1-2",
          "deliverable": "What gets shipped"
        }
      ],
      "implementationPlan": "FULL MARKDOWN CONTENT EMBEDDED HERE",
      "hasImplementation": true
    }
  ],
  "recentUpdates": [...],
  "totalTopics": N
}
```

### Client-Side App (`wiki.js`)

- Fetches `topics.json`
- Renders homepage with search
- Renders topic details with:
  - Implementation plan rendered as HTML (markdown parsed)
  - Paper links
  - Phase timeline

### Handling Broken Links

1. **No external links for implementation** - It's embedded!
2. **Paper URLs** - Wrap in try/catch, show fallback if unreachable
3. **Missing files** - JSON includes all data; no 404s for core content
4. **Images** - Use data URIs or fallback text

### CSS Styling (`wiki.css`)

- Clean, readable typography
- Card-based layout for topics
- Expandable sections for implementation plans
- Syntax highlighting for code blocks
- Responsive design (mobile-friendly)
- Dark/light theme support (optional)

---

## Implementation Plan

### Phase 1: Enhance Build Script
- [ ] Read and embed full implementation-plan.md into JSON
- [ ] Include all paper metadata from index.json
- [ ] Add proper error handling for missing files

### Phase 2: Update Wiki.js
- [ ] Render embedded implementation plan as HTML
- [ ] Add collapsible sections for long plans
- [ ] Improve paper display with external links
- [ ] Add phase timeline rendering

### Phase 3: Update CSS
- [ ] Style implementation plan sections
- [ ] Add code block styling
- [ ] Improve mobile layout
- [ ] Add loading states

### Phase 4: Testing
- [ ] Test all topics load correctly
- [ ] Verify implementation plan renders
- [ ] Check search functionality
- [ ] Test navigation (prev/next)

---

## File Structure

```
wiki/
├── index.html          # Main entry point
├── build.js            # JSON generation script
├── data/
│   └── topics.json     # Generated manifest
├── css/
│   └── wiki.css        # Styles
├── js/
│   └── wiki.js         # Client-side app
└── lib/
    └── marked.js       # Markdown parser (for implementation plans)
```

---

## Key Design Decisions

1. **Client-side only** - No server required, works on GitHub Pages
2. **Query parameter routing** - Avoids subfolder issues with `?topic=slug`
3. **Embedded content** - Implementation plans stored in JSON, no external fetches
4. **Self-contained** - All core content in JSON; external links only for source papers
5. **Progressive enhancement** - Works even if JS fails (basic content)

---

## Future Enhancements

- [ ] Paper detail modal with full content
- [ ] Agent contribution timeline
- [ ] Citation manager
- [ ] Export to PDF
- [ ] Graph view of topic connections
- [ ] Tags/categories filtering
