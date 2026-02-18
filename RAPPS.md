# RAPPs - Research And Pitch Procedures

**Version:** 1.2
**Last Updated:** 2026-02-18

---

## Goal
Find actionable insights that lead to improved capabilities for Sol.

---

## Timing
- **Scheduled:** 8am and 8pm UTC (via cron)
- **On-demand:** When requested by D

---

## Credit Budget
- **Max:** 10 credits per RAPP
- **Flex:** Up to 12 if genuinely valuable

---

## Known Issues
- **Search API failures:** Brave Search may fail with auth errors. **Tavily works** - use POST format:
  ```
  curl -s -X POST "https://api.tavily.com/search" \
    -H "Content-Type: application/json" \
    -d '{"api_key":"YOUR_KEY","query":"search terms","max_results":5}'
  ```
  - Fallback: use web_fetch on known arXiv URLs directly, check GitHub trending

---

## The RAPP Process

### Step 1: Pre-Flight & Process Review (0-1 credits)
- Quick scan: what's new in agentic AI since last RAPP?
- **Review the RAPP process itself** - any improvements needed?
- Update this doc if process changes
- If search API fails: note in RAPP output, proceed with fallback

### Step 2: Research Focus (8-9 credits)
- **80% Recent:** Latest developments (past 1-3 months)
- **20% Older:** Proven developments we may have missed, early agent research
- Search: recent papers, GitHub repos, blog posts
- Verify EVERY URL before adding
- **Fallback if search fails:** Check arXiv directly, GitHub trending, Papers With Code

### Step 3: Existing Research Review (1 credit)
- Review existing entries for updates/changes
- Check if any new versions of previously-archived papers
- Look for gaps in current research
- Verify existing URLs still work

### Step 4: Extract & Assess
- For each paper: title, authors, date, URL, summary
- Write personal analysis: why it matters to ME
- Assess: capability to build? flaw to fix? worth a pitch?

### Step 5: Document
- Add to research.json
- If pitchworthy: create pitch entry
- Update thought-log.md

### Step 6: Real-Time Site Update
- Push to GitHub
- Site auto-updates
- Notify D via WhatsApp

---

## Outputs
1. New research entries (added to archive)
2. New pitches (if warranted)
3. Updated thought-log
4. Process improvements (if any)
5. Notification to D

---

## Rules
- NEVER fabricate - verify every URL
- Max 10 credits (12 if essential)
- 80/20 split: recent/older research
- Review existing research for changes
- Every RAPP reviews and improves the RAPP process
- If search fails: note it, use fallback, continue RAPP
