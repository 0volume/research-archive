# Data Browser System Design Document

**Version:** 1.0  
**Date:** 2026-02-24  
**Status:** Design Specification  
**Target:** Solaris Portal Integration (http://127.0.0.1:18790)

---

## 1. Architecture Overview

### 1.1 Design Goals

The Data Browser provides a unified interface within the Solaris portal to explore and navigate all data assets across the OpenClaw installation. It serves as a centralized knowledge hub enabling users to:

- Browse markdown files across all workspaces
- Query SQL databases for agent monitoring and cognition data
- Navigate the research archive structure
- Access system configuration files
- Search and filter across all data sources

### 1.2 Integration Model

The Data Browser integrates with Solaris as a **new tab/view** within the existing portal. The architecture follows a client-server model:

```
┌─────────────────────────────────────────────────────────────────┐
│                     SOLARIS PORTAL (Client)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Tiles     │  │   Agent     │  │    DATA BROWSER TAB     │ │
│  │   View      │  │   Monitor   │  │  ┌───────────────────┐  │ │
│  └─────────────┘  └─────────────┘  │  │ Navigation Panel  │  │ │
│                                      │  │ (Tree/Folder)    │  │ │
│                                      │  ├───────────────────┤  │ │
│                                      │  │ Content Viewer   │  │ │
│                                      │  │ (Markdown/SQL)   │  │ │
│                                      │  └───────────────────┘  │ │
│                                      └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GATEWAY API (Server)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  /api/     │  │  /api/      │  │   /api/db/*             │ │
│  │  files/*   │  │  search     │  │   (SQL Queries)         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐
   │  Filesystem │    │  Databases  │    │  Cache Layer    │
   │  (.md, etc) │    │  (.sqlite)  │    │  (In-Memory)    │
   └─────────────┘    └─────────────┘    └─────────────────┘
```

### 1.3 Technology Stack

| Layer | Technology |
|-------|------------|
| Portal UI | Vanilla JavaScript + Custom CSS (Cyberpunk Theme) |
| Gateway API | Express.js (existing) |
| Database Access | better-sqlite3 (synchronous SQLite) |
| Markdown Rendering | marked.js or highlight.js |
| Caching | In-memory LRU cache |

---

## 2. Data Sources Inventory

### 2.1 System Files (Core)

These critical files define agent identity and configuration:

| File | Location | Purpose |
|------|----------|---------|
| AGENTS.md | Per workspace | Agent workspace definition and rules |
| SOUL.md | Per workspace | Agent's core identity and purpose |
| IDENTITY.md | Per workspace | Agent identification and metadata |
| USER.md | Per workspace | User context and preferences |
| TOOLS.md | Per workspace | Available tools and skills |
| MEMORY.md | Per workspace | Long-term memory (main session only) |
| HEARTBEAT.md | Per workspace | Heartbeat configuration and tasks |
| BOOTSTRAP.md | workspace-main | Initial bootstrap instructions |

### 2.2 Workspace Inventory

| Workspace | Path | Key Contents |
|-----------|------|--------------|
| workspace-main | `/root/.openclaw/workspace-main/` | MEMORY.md, BOOTSTRAP.md, AGENT-CREATION-WORKFLOW.md, prompts/, memory/ |
| workspace-research-agent | `/root/.openclaw/workspace-research-agent/` | AGENTS.md, SOUL.md, IDENTITY.md, USER.md, TOOLS.md, MEMORY.md, research/daily/, research/topics/, research/pitches/, wiki/ |
| workspace-code-agent | `/root/.openclaw/workspace-code-agent/` | Code agent workspace files |
| workspace-code-review | `/root/.openclaw/workspace-code-review/` | Code review workspace files |
| workspace-fact-check | `/root/.openclaw/workspace-fact-check/` | Fact-check workspace files |
| workspace-prompt-agent | `/root/.openclaw/workspace-prompt-agent/` | Prompt agent workspace files |
| workspace-docs-agent | `/root/.openclaw/workspace-docs-agent/` | Docs agent workspace files |

### 2.3 Research Archive Structure

```
research/
├── daily/           # Daily study notes (YYYY-MM-DD.md)
│   └── [674 total .md files across all workspaces]
├── topics/         # Organized topic deep-dives
│   └── *.md
├── pitches/        # Actionable pitch proposals (pitch-N.html)
│   └── pitch-*.html
└── wiki/           # Knowledge base articles
    └── *.md
```

### 2.4 Database Inventory

| Database | Path | Size | Tables (Estimated) |
|----------|------|------|-------------------|
| agent-monitor.db | `/root/.openclaw/agent-monitor/agent-monitor.db` | ~140MB | sessions, messages, metrics, events |
| cognition.db | `/root/.openclaw/agent-monitor/cognition.db` | ~6MB | cognition_logs, thoughts, context |

### 2.5 Complete File Inventory (Total: 674 .md files)

```
/root/.openclaw/
├── workspace-main/ (~25 .md files)
│   ├── MEMORY.md
│   ├── BOOTSTRAP.md
│   ├── AGENT-CREATION-WORKFLOW.md
│   ├── prompts/*.md
│   └── memory/*.md
├── workspace-research-agent (~50+ .md files)
│   ├── AGENTS.md, SOUL.md, IDENTITY.md, USER.md, TOOLS.md, MEMORY.md
│   ├── research/daily/*.md
│   ├── research/topics/*.md
│   ├── research/pitches/pitch-*.html
│   └── wiki/*.md
├── workspace-code-agent/
├── workspace-code-review/
├── workspace-fact-check/
├── workspace-prompt-agent/
├── workspace-docs-agent/
└── agents/*/agent/system-prompt.md
```

---

## 3. UI/UX Design

### 3.1 Layout Structure

The Data Browser occupies a dedicated tab within the Solaris portal with a three-panel layout:

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER: Data Browser                              [Search Bar] │
├────────────────┬─────────────────────────────────────────────────┤
│                │                                                  │
│   SIDEBAR      │              CONTENT VIEWER                      │
│   (250px)      │                                                  │
│                │  ┌────────────────────────────────────────────┐  │
│  ┌──────────┐  │  │  File: AGENTS.md                          │  │
│  │ System   │  │  │  ────────────────                          │  │
│  │ Files    │  │  │  # AGENTS.md - Your Workspace             │  │
│  ├──────────┤  │  │                                            │  │
│  │ Workspaces│  │  │  This folder is home...                  │  │
│  │ ├ Main   │  │  │                                            │  │
│  │ ├ Research│ │  │  [Rendered Markdown with syntax highlight]│  │
│  │ ├ Code   │  │  │                                            │  │
│  │ └ ...    │  │  │                                            │  │
│  ├──────────┤  │  │                                            │  │
│  │ Research │  │  └────────────────────────────────────────────┘  │
│  │ Archive  │  │                                                  │
│  ├──────────┤  │  ┌────────────────────────────────────────────┐  │
│  │ Databases│  │  │  SQL Query Results (when viewing DB)       │  │
│  │ ├ monitor│  │  │  table { columns... }                      │  │
│  │ └ cognit.│  │  └────────────────────────────────────────────┘  │
│  └──────────┘  │                                                  │
│                │                                                  │
├────────────────┴─────────────────────────────────────────────────┤
│  STATUS: 674 files indexed │ Cache: 85% hit rate │ Last sync: 2m │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Navigation Panel (Sidebar)

**Categories (Collapsible Tree):**

1. **System Files** (icon: ⚙️)
   - AGENTS.md, SOUL.md, IDENTITY.md, USER.md, TOOLS.md, MEMORY.md, HEARTBEAT.md, BOOTSTRAP.md

2. **Agent Workspaces** (icon: 🤖)
   - workspace-main
   - workspace-research-agent
   - workspace-code-agent
   - workspace-code-review
   - workspace-fact-check
   - workspace-prompt-agent
   - workspace-docs-agent

3. **Research Archive** (icon: 📚)
   - Daily Notes (research/daily/)
   - Topics (research/topics/)
   - Pitches (research/pitches/)
   - Wiki (wiki/)

4. **Databases** (icon: 🗄️)
   - agent-monitor.db
   - cognition.db

### 3.3 Content Viewer

**For Markdown Files:**
- Full markdown rendering with GitHub-flavored markdown
- Syntax highlighting for code blocks
- Image rendering support
- Collapsible sections for long content
- Table of contents generation for long files
- Copy code button for code blocks

**For SQL Results:**
- Tabular display with sortable columns
- Column type indicators
- Pagination (50 rows per page)
- Export to CSV option
- Query execution timer display

### 3.4 Search Functionality

**Global Search Bar (Header):**
- Searches across: filenames, file content, database table names
- Real-time suggestions as you type
- Filters: file type, workspace, date range
- Keyboard shortcut: `/` or `Ctrl+K`

**Search Results Display:**
- Grouped by category (Files, Database Tables, Research)
- Snippet preview with highlighted matches
- Click to navigate directly

### 3.5 Cyberpunk Theme Integration

The Data Browser inherits the Solaris cyberpunk aesthetic:

- Dark background (#0a0a0f)
- Neon accent colors (cyan #00fff2, magenta #ff00ff)
- Glowing borders and shadows
- Monospace fonts for code/data
- Subtle scanline effects on panels

---

## 4. SQL Integration

### 4.1 Database Connection

```javascript
// Gateway API - Database module
const Database = require('better-sqlite3');

const MONITOR_DB = '/root/.openclaw/agent-monitor/agent-monitor.db';
const COGNITION_DB = '/root/.openclaw/agent-monitor/cognition.db';

// Read-only connections ( safer for web exposure)
const monitorDb = new Database(MONITOR_DB, { readonly: true });
const cognitionDb = new Database(COGNITION_DB, { readonly: true });
```

### 4.2 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/db/tables` | GET | List all tables in a database |
| `/api/db/schema/:table` | GET | Get table schema (columns, types) |
| `/api/db/query` | POST | Execute SELECT query |
| `/api/db/sample/:table` | GET | Get sample rows (limit 50) |

### 4.3 Query Examples

**List all sessions:**
```sql
SELECT id, agent_id, started_at, status 
FROM sessions 
ORDER BY started_at DESC 
LIMIT 100;
```

**Recent messages:**
```sql
SELECT id, session_id, role, content, timestamp 
FROM messages 
ORDER BY timestamp DESC 
LIMIT 50;
```

**Cognition logs:**
```sql
SELECT id, agent_id, thought, context, timestamp 
FROM cognition_logs 
ORDER BY timestamp DESC 
LIMIT 100;
```

### 4.4 Security Measures

1. **Read-Only Mode**: Database connections opened with `readonly: true`
2. **Query Validation**: Only allow SELECT statements (block INSERT, UPDATE, DELETE, DROP, etc.)
3. **Timeout Protection**: Query timeout of 10 seconds max
4. **Result Limits**: Default 100 rows, max 1000 rows
5. **SQL Injection Prevention**: Use parameterized queries where possible

---

## 5. Implementation Plan

### Phase 1: Core Infrastructure (Priority: HIGH)

**Goal:** Establish the basic API and file reading capability

- [ ] Create Gateway API routes for file system access
- [ ] Implement `/api/files/list` - list all accessible .md files
- [ ] Implement `/api/files/read` - read specific file content
- [ ] Implement `/api/files/tree` - generate folder tree structure
- [ ] Add caching layer for file metadata

**Estimated Time:** 2-3 hours

### Phase 2: Database Integration (Priority: HIGH)

**Goal:** Enable SQL query capabilities

- [ ] Set up better-sqlite3 connections (read-only)
- [ ] Implement `/api/db/tables` endpoint
- [ ] Implement `/api/db/schema` endpoint
- [ ] Implement `/api/db/query` with validation
- [ ] Add query timeout and result limiting
- [ ] Security: Validate only SELECT statements

**Estimated Time:** 2-3 hours

### Phase 3: Frontend Development (Priority: HIGH)

**Goal:** Build the Data Browser UI within Solaris

- [ ] Add Data Browser tab to Solaris navigation
- [ ] Implement three-panel layout (sidebar, viewer, status)
- [ ] Build navigation tree component
- [ ] Implement markdown renderer with syntax highlighting
- [ ] Add SQL results table with pagination

**Estimated Time:** 3-4 hours

### Phase 4: Search & Filter (Priority: MEDIUM)

**Goal:** Enable powerful search across all data

- [ ] Implement `/api/search` endpoint
- [ ] Build search UI with autocomplete
- [ ] Add filters: file type, workspace, date
- [ ] Implement full-text search index (optional: use existing)

**Estimated Time:** 2-3 hours

### Phase 5: Polish & Optimization (Priority: MEDIUM)

**Goal:** Refine UX and performance

- [ ] Add keyboard shortcuts (/, arrows, Enter)
- [ ] Implement file watching for live updates
- [ ] Add export functionality (CSV, JSON)
- [ ] Performance: lazy load large files
- [ ] Add breadcrumb navigation

**Estimated Time:** 2-3 hours

### Phase 6: Future Extensibility (Priority: LOW)

**Goal:** Prepare for future enhancements

- [ ] Plugin architecture for new data sources
- [ ] WebSocket support for real-time updates
- [ ] User preferences (default view, filters)
- [ ] Bookmarking/favorites system
- [ ] Advanced query builder UI

**Estimated Time:** Future

---

## 6. Technical Specifications

### 6.1 API Endpoints Summary

#### File Operations

| Endpoint | Method | Parameters | Response |
|----------|--------|------------|----------|
| `/api/files/tree` | GET | `?root=/root/.openclaw` | `{ tree: {...} }` |
| `/api/files/list` | GET | `?path=/workspace-research-agent&ext=.md` | `{ files: [...] }` |
| `/api/files/read` | GET | `?path=/workspace/AGENTS.md` | `{ content: "...", meta: {...} }` |
| `/api/files/search` | GET | `?q=keyword&workspace=research` | `{ results: [...] }` |

#### Database Operations

| Endpoint | Method | Parameters | Response |
|----------|--------|------------|----------|
| `/api/db/tables` | GET | `?db=monitor\|cognition` | `{ tables: [...] }` |
| `/api/db/schema` | GET | `?db=monitor&table=sessions` | `{ columns: [...], types: [...] }` |
| `/api/db/query` | POST | `{ db, query, limit }` | `{ rows: [...], time: ms }` |
| `/api/db/sample` | GET | `?db=monitor&table=sessions&n=50` | `{ rows: [...] }` |

### 6.2 Data Structures

#### File Metadata
```typescript
interface FileMetadata {
  path: string;           // Absolute path
  name: string;           // Filename only
  workspace: string;     // Parent workspace
  category: string;       // system|workspace|research|database
  size: number;          // Bytes
  modified: string;      // ISO timestamp
  type: 'md' | 'html' | 'json' | 'other';
  isSystem: boolean;     // True for AGENTS.md, SOUL.md, etc.
}
```

#### Search Result
```typescript
interface SearchResult {
  type: 'file' | 'database' | 'table';
  path?: string;
  name: string;
  snippet: string;       // Highlighted match
  workspace: string;
  score: number;         // Relevance 0-1
}
```

#### SQL Query Response
```typescript
interface QueryResponse {
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTime: number;  // milliseconds
  truncated: boolean;    // true if > limit
}
```

### 6.3 Caching Strategy

| Cache | TTL | Max Size | Invalidation |
|-------|-----|----------|--------------|
| File Tree | 5 min | 1000 entries | Manual refresh |
| File Content | 10 min | 50 files | File modified |
| Database Schema | 1 hour | 100 tables | DB changed |
| Search Index | 1 hour | Full text | File modified |

### 6.4 Performance Considerations

1. **Large Files (>100KB):** 
   - Truncate preview to 50KB
   - Load full content on demand
   - Show "Load More" button

2. **Large Databases:**
   - Lazy load table schemas
   - Limit query results (default 100, max 1000)
   - Show execution time warnings for queries >5s

3. **Large Directory Trees:**
   - Lazy load subdirectories (expand on click)
   - Cache expanded state in session

### 6.5 Security Specifications

1. **Path Traversal Prevention:**
   - Validate all paths start with `/root/.openclaw/`
   - Block `../` sequences in requests
   - Sanitize user input

2. **SQL Injection Prevention:**
   - Whitelist: only SELECT statements
   - Use parameterized queries where possible
   - Block dangerous keywords: DROP, DELETE, INSERT, UPDATE, ALTER, CREATE

3. **XSS Protection (Markdown Rendering):**
   - Sanitize HTML before rendering
   - Use DOMPurify or similar library
   - Escape user-generated content

### 6.6 File Structure for Implementation

```
/root/.openclaw/agent-monitor/
├── public/
│   ├── index.html          # Solaris portal (modified)
│   ├── data-browser.js     # New: Data Browser frontend
│   ├── data-browser.css    # New: Data Browser styles
│   └── ...
├── server/
│   ├── index.js            # Gateway server (modified)
│   ├── routes/
│   │   ├── files.js        # New: File operations
│   │   └── database.js     # New: DB operations
│   └── lib/
│       ├── cache.js        # New: Caching utilities
│       └── security.js    # New: Security validators
```

---

## 7. Acceptance Criteria

### Must Have (Phase 1-3)
- [ ] Can navigate all workspaces via sidebar tree
- [ ] Can view any .md file with proper markdown rendering
- [ ] Can list and view database tables
- [ ] Can execute basic SELECT queries
- [ ] Search finds files by name and content
- [ ] UI follows cyberpunk theme
- [ ] Large files handled gracefully (truncation)

### Should Have (Phase 4-5)
- [ ] Real-time search with autocomplete
- [ ] Keyboard shortcuts (/, Ctrl+K)
- [ ] SQL results sortable and paginated
- [ ] Export to CSV/JSON
- [ ] File modification timestamps displayed

### Nice to Have (Phase 6)
- [ ] Plugin architecture
- [ ] WebSocket real-time updates
- [ ] User preferences
- [ ] Bookmarks/favorites

---

## 8. Future Considerations

1. **Additional Data Sources:**
   - Git repositories (commit history, diffs)
   - Log files (structured logs)
   - Media files (images, audio)
   - External APIs (weather, news)

2. **Advanced Features:**
   - Graph visualization of agent relationships
   - Timeline view for sessions/messages
   - Comparison view (diff between versions)
   - Annotation and commenting

3. **Integration:**
   - Export to Notion/Confluence
   - Integration with external knowledge bases
   - API for programmatic access

---

*Document Version: 1.0*  
*Created: 2026-02-24*  
*Author: Research Agent*  
*Status: Ready for Implementation Review*


---

# FACT-CHECK REVIEW NOTES

## ✅ What's Good (Keep It)

1. **Architecture** - Client-server model with Gateway API is solid. Express.js + better-sqlite3 is appropriate.

2. **Read-Only SQLite** - Using `readonly: true` flag is essential and correct.

3. **Query Result Limits** - Default 100, max 1000 rows prevents memory issues. Good.

4. **Query Timeout** - 10-second timeout prevents runaway queries. Good.

5. **Large File Handling** - Truncation at 50KB, lazy loading, "Load More" button - well thought out.

6. **Three-Panel Layout** - Standard and effective. Sidebar + content + status works well.

7. **Caching Strategy** - TTLs and invalidation rules are reasonable.

8. **Technology Choices** - marked.js, highlight.js, DOMPurify are solid libraries.

9. **Database Inventory** - Clear documentation of what data exists where.

10. **Cyberpunk Theme** - Consistent with Solaris portal identity.

---

## ❌ What Needs Fixing

### 1. SQL Query Validation - INCOMPLETE SPECIFICATION

**Issue:** The design states "only allow SELECT statements" and mentions blocking keywords like DROP, DELETE, INSERT, UPDATE, ALTER, CREATE - but **there's no actual validation code shown**.

**Gap:** How exactly is the validation implemented? Simple string matching can be bypassed:
- `SEL/**/ECT` - comment injection
- `SELECT` vs `select` case variations
- Hex encoding tricks

**Fix Required:** 
- Implement actual validation function that:
  - Strips comments and whitespace
  - Uses a proper SQL parser (e.g., sql-parser library) OR
  - At minimum: regex check that `^\s*SELECT\s+` with case-insensitive flag
  - Block ALL keywords: SELECT, INSERT, UPDATE, DELETE, DROP, CREATE, ALTER, TRUNCATE, REPLACE, UNION, EXPLAIN, VACUUM

### 2. Path Traversal Prevention - HAS GAPS

**Issue:** Design says "block `../` sequences" but doesn't address:
- URL encoding: `..%2F` or `..%252F`
- Double URL encoding: `%2e%2e%2f`
- Symlinks within allowed directories
- Case variations: `....//` or `./././`

**Fix Required:**
- After decoding URL, validate path is still within allowed directory
- Resolve symlinks and verify final path is within bounds
- Use `path.resolve()` and check it starts with allowed prefix

### 3. XSS Protection - MISSING IMPLEMENTATION DETAIL

**Issue:** Design mentions DOMPurify but no code shown. Critical for markdown rendering.

**Fix Required:**
- Must show actual sanitization code:
```javascript
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(marked.parse(content));
```

### 4. Database File Paths in Code Are Hardcoded

**Issue:** Section 4.1 shows:
```javascript
const MONITOR_DB = '/root/.openclaw/agent-monitor/agent-monitor.db';
```

**Risk:** If database paths change or are misconfigured, the app breaks.

**Fix:** Make configurable via environment variables or config file.

### 5. No Error Handling for Corrupt SQLite Files

**Issue:** What happens if the 140MB database is corrupt?

**Fix Required:** Add try-catch around database operations, return user-friendly error messages.

### 6. Missing CORS Configuration

**Issue:** If Data Browser is served from different origin than API, CORS needed.

**Fix:** Add CORS headers to Express routes if needed.

---

## ❌ What's Missing

### 1. Actual Validation Code
- No implementation of `isValidSQLQuery()` function
- No implementation of `isValidPath()` function
- No XSS sanitization code

### 2. Rate Limiting
- No mention of rate limiting on API endpoints
- SQL query endpoint could be abused

### 3. Authentication/Authorization
- Design assumes trusted internal access
- No user authentication mentioned
- Is this intentional for internal-only tool?

### 4. File Type Restrictions
- Design focuses on .md but doesn't explicitly restrict to certain extensions
- Could expose system files accidentally

### 5. Search Implementation Details
- Full-text search indexing not detailed
- How is content search implemented? grep? dedicated index?

### 6. Performance Testing Notes
- No benchmarks for 674 files + 140MB DB
- No mention of initial load time concerns

### 7. Backup/Recovery
- What if file gets deleted while viewing?
- No graceful error handling for missing files

### 8. Accessibility
- No keyboard navigation beyond `/` and arrows
- Missing ARIA labels for screen readers

### 9. Mobile Responsiveness
- Three-panel layout won't work on mobile
- No responsive design considerations

### 10. Logging/Auditing
- No logging of SQL queries executed
- No audit trail for compliance

---

## Verdict

**Technical Feasibility:** ⚠️ MOSTLY FEASIBLE but needs security hardening

The core architecture is sound, but the security validation is under-specified. The "only SELECT" claim needs actual implementation.

**UI/UX:** ✅ GOOD
Three-panel layout is appropriate. No major issues.

**Integration:** ✅ NO CONFLICTS
Appears to integrate cleanly as new tab.

**Missing Pieces:** ⚠️ MODERATE
Needs security implementation details, error handling, and rate limiting.

**Recommendation:** APPROVED WITH CONDITIONS - Implement security validation code before building Phase 2 (Database Integration).
