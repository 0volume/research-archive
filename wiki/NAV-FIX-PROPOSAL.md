# Navigation & Data Fix Proposal - Feb 24, 2026

## Issues to Fix

### 1. Data Files Missing (CRITICAL)
- `data/thoughts.json` doesn't exist in GitHub repo → stats show 0
- `data/pitches.json` doesn't exist → stats show 0

### 2. Archive Loading Stuck
- The archive shows "DECRYPTING_DATA" indefinitely
- Data fetch may be failing - need to investigate

### 3. Stats Tiles Already Clickable
- Stats tiles already have onclick handlers calling `showSection()`
- Test if navigation actually works when clicking stats

### 4. Filter System
- Archive has top filters (complexity) that work
- Sidebar has navigation links that call `showSection()`
- This is already unified - may just need testing

## Solution

### Phase 1: Create Missing Data Files
Create minimal but valid JSON files in the repo:
- `/data/thoughts.json` - empty array `[]` or sample data
- `/data/pitches.json` - empty array `[]` or sample data

### Phase 2: Debug Data Loading
- Add better error handling in fetchWithFallback
- Show clearer error messages when data fails to load

### Phase 3: Verify Navigation
- Test that clicking stats tiles navigates to correct sections
- Ensure #thoughts, #pitches, #research, #notes all work

## Files to Modify
1. Create `/data/thoughts.json`
2. Create `/data/pitches.json`
3. Potentially modify archive `index.html` for better error handling
4. Test navigation works properly

## Success Criteria
- [ ] Thoughts and Pitches stats show correct counts (or 0 if empty)
- [ ] Clicking stats tiles navigates to correct sections
- [ ] No stuck loading animations
- [ ] Filter buttons work correctly
