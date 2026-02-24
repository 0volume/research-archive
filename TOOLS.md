# Research Agent Tools

## Tavily Search (Primary)

Tavily is your primary web search tool - optimized for AI/LLM research.

### Credit Limit
**Maximum: 2 credits per day** - Always check your usage before making Tavily calls!

### Recommended Additional Sources

Beyond the current list, actively search these for agentic AI / self-improvement research:

1. **Hugging Face Papers** - https://huggingface.co/papers (trending AI papers)
2. **LabLab.ai** - https://lablab.ai (AI hackathons, emerging tech)
3. **Papers Industry** - https://paperswithcode.com (papers with code implementations)
4. **AI2 Reasoning** - https://ai2 reasoning benchmarks
5. **GitHub Trending** - https://github.com/trending?since=weekly (filter: python, AI, agents)
6. **r/LocalLLaMA** - Reddit for open model discussions
7. **Latent Space** - https://www.latent.space (AI engineering newsletter)
8. **The Agent Future** - Agentic AI newsletters and blogs

### API Key
```
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
```

### Option 1: Node.js SDK

```javascript
const { tavily } = require("@tavily/core");

const tvly = tavily({ apiKey: "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" });

const results = await tvly.search("query", { maxResults: 5 });
```

### Option 2: CLI Skill (recommended for better AI answers)

```bash
# Set env once
export TAVILY_API_KEY=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

# Basic search
node /root/.openclaw/workspace/skills/tavily-search/scripts/search.mjs "query"

# With more results
node /root/.openclaw/workspace/skills/tavily-search/scripts/search.mjs "query" -n 10

# Deep research
node /root/.openclaw/workspace/skills/tavily-search/scripts/search.mjs "query" --deep

# News search
node /root/.openclaw/workspace/skills/tavily-search/scripts/search.mjs "query" --topic news --days 7

# Extract content
node /root/.openclaw/workspace/skills/tavily-search/scripts/extract.mjs "https://example.com"
```

### After Each Tavily Call - Record Usage!

```javascript
// After any Tavily call, record usage:
fetch('http://127.0.0.1:18790/api/tavily/usage', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({agentId: 'research-agent', query: 'your query', creditsUsed: 1})
})
```

### Extract Content from URLs

```javascript
// Extract full content from URLs (pass array directly)
const extracted = await tvly.extract([
  "https://example.com/article",
  "https://example.com/page2"
]);

// Results:
// - results: [{ url, title, rawContent }]
```

### Best Practices

1. **Search first** - Find relevant sources with Tavily search
2. **Extract selectively** - Pull full content from top 2-3 URLs
3. **Be specific** - "latest developments in quantum computing February 2026" works better than just "quantum computing"
4. **Check scores** - Higher score = more relevant
5. **Cite sources** - Always note URLs in your research

---

## Web Fetch (Fallback)

Use `web_fetch` tool for simple content extraction from specific URLs.

```javascript
web_fetch(url: "https://example.com/article", maxChars: 5000)
```

---

## Daily Workflows

### Job 1: Source Gathering
Run ONCE per day to collect new sources.

1. Search Tavily for agentic AI / self-improvement research
2. **Check for duplicates** - Fetch research.json and verify URL doesn't already exist
3. Add new entries to research.json with full metadata
4. Alert user when done

### Job 2: Research & Synthesis
Run ~30 min after source gathering.

1. Pick 2-4 HIGH VALUE entries from research.json
2. Fetch full content from URLs
3. Create new pitch HTML (format below)
4. Push to GitHub
5. Alert user

---

## Adding Sources to research.json

Get current list:
```bash
curl -s https://raw.githubusercontent.com/0volume/research-archive/main/data/research.json > /tmp/research.json
```

Entry format:
```json
{
  "id": <next-id>,
  "title": "Paper Title",
  "date": "YYYY-MM-DD",
  "source": "arXiv|GitHub|Medium|etc",
  "authors": "Author names",
  "summary": "Brief summary (1-2 sentences)",
  "url": "https://arxiv.org/abs/...",
  "tags": ["tag1", "tag2"],
  "category": "infrastructure|self-improvement|multi-agent|reasoning|tools|safety|governance",
  "complexity": "beginner|intermediate|advanced|enterprise",
  "myAnalysis": "Your analysis - why this matters for our system",
  "practicalUse": "Low|Medium|High|Very High",
  "connectsTo": []
}
```

---

## Pitch HTML Format

When creating a new pitch, use this structure (match pitch-1.html exactly):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pitch #N: Title - Research Archive</title>
    <style>
        /* Copy styles from pitch-1.html */
    </style>
</head>
<body>
    <header>
        <a href="index.html" class="back-link">← Back to Pitches</a>
        <h1>Pitch #N: Title</h1>
        <div class="pitch-meta">
            <span class="status-badge pending">pending</span>
            <span class="pitch-date">YYYY-MM-DD</span>
        </div>
    </header>
    
    <div class="section">
        <h2>Summary</h2>
        <p class="summary">One-line summary</p>
    </div>
    
    <div class="section">
        <h2>Why This Matters</h2>
        <p>Explain relevance to agentic AI system</p>
    </div>
    
    <div class="section">
        <h2>Full Pitch</h2>
        <div class="detail-content">
            <h3>The Problem</h3>
            <p>What issue does this solve?</p>
            
            <h3>Today's Research</h3>
            <p>What papers informed this?</p>
            
            <h3>Why It Matters</h3>
            <p>Impact on our system</p>
            
            <h3>Implementation</h3>
            <ul><li>Step 1</li><li>Step 2</li></ul>
        </div>
    </div>
    
    <div class="section">
        <h2>Linked Papers</h2>
        <div class="linked-papers">
            <a href="index.html" class="linked-paper">#ID: Paper Title</a>
        </div>
    </div>
    
    <div class="section progress-section">
        <h2>📊 Progress</h2>
        <!-- Fill as work progresses -->
    </div>
    
    <div class="section updates_section">
        <h2>💬 Discussion Updates</h2>
        <!-- Fill as work progresses -->
    </div>
</body>
</html>
```

**Critical:**
- Must lead to actionable result
- Cite sources with linked-papers
- Match existing pitch styling exactly

## Posting to Thoughts Page

The thoughts page is stored in the GitHub repo:
- **File:** `thought-log.md` in https://github.com/0volume/research-archive
- **Format:** See existing entries for style (personal insights, what struck you, pitches)

To post: Write your thought, then ask main agent to push to GitHub, or use GitHub CLI:
```bash
gh repo clone 0volume/research-archive /tmp/research-archive
# Add to thought-log.md
git add -A && git commit -m "New thought from research-agent"
git push
```

```bash
cd /root/.openclaw/workspace && node -e "
const { tavily } = require('@tavily/core');
const tvly = tavily({ apiKey: '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' });
tvly.search('latest AI news 2026', { maxResults: 5 }).then(r => console.log(JSON.stringify(r, null, 2)));
"
```
