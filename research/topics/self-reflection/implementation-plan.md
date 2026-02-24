# Implementation Plan: Self-Reflection & Improvement Loop

## Overview

Based on research from 4 key papers, this implementation plan outlines a 4-phase approach to building a self-reflection and improvement loop for our agentic AI system.

### Research Foundation
- **Paper #2 (EvoTest)**: Gradient-free whole-system evolution with Actor + Evolver architecture
- **Paper #22 (Survey)**: Taxonomy of what/when/how to evolve
- **Paper #23 (MCE)**: Bi-level optimization with meta-level skill evolution
- **Paper #24 (Reflective AI)**: Plan → Execute → Self-Assess → Refine workflow

### Stack
- **Runtime**: Node.js (ES Modules)
- **Storage**: File-based JSON documents (matching OpenClaw patterns)
- **LLM**: Via existing OpenClaw message API

---

## Phase 0: Quick Win (Days 1-2)

**Objective**: Ship a minimal reflection capability in 1-2 days that provides immediate value.

### What We Ship

A simple "post-execution review" that runs after every task completion:

```javascript
// src/agents/reflection/postReview.js
export class PostReviewAgent {
  constructor(llmClient) {
    this.llm = llmClient;
  }

  async review(task, output, context) {
    const prompt = `You are reviewing an AI agent's output.
Task: ${task}
Output: ${output}
Context: ${JSON.stringify(context)}

Was the output successful? Identify up to 3 issues if any.
Respond as JSON: { "success": boolean, "issues": string[], "score": 1-10 }`;

    const result = await this.llm.complete(prompt);
    return JSON.parse(result);
  }
}
```

### Integration Point

Add to the main workflow after task execution:

```javascript
// In existing workflow, after executor.run()
const reviewer = new PostReviewAgent(llmClient);
const review = await reviewer.review(task, output, context);

// Log to memory (OpenClaw pattern)
await memory.log('reflection', { task, output, review, timestamp: Date.now() });

// If score < 5, flag for human review
if (review.score < 5) {
  await notification.alert(`Low quality output (${review.score}/10) for: ${task.slice(0, 50)}`);
}
```

### Files to Create
- `src/agents/reflection/postReview.js` - Review agent
- `src/agents/reflection/index.js` - Module exports

### Checkpoint
- [ ] PostReviewAgent logs reviews to memory
- [ ] Score < 5 triggers notification
- [ ] No workflow changes required (non-blocking)

---

## Phase 1: Core Reflection Loop (Weeks 1-2)

**Objective**: Implement the Plan → Execute → Self-Assess → Refine pattern as an active loop.

### 1.1 Reflection Agent Module (Days 3-5)

```javascript
// src/agents/reflection/ReflectionAgent.js
export class ReflectionAgent {
  constructor(llmClient) {
    this.llm = llmClient;
  }

  async assess(task, output, context) {
    const prompt = this.buildAssessmentPrompt(task, output, context);
    const response = await this.llm.complete(prompt);
    return this.parseAssessment(response);
  }

  async refine(task, output, reflection) {
    const prompt = this.buildRefinePrompt(task, output, reflection);
    const refined = await this.llm.complete(prompt);
    return refined;
  }

  buildAssessmentPrompt(task, output, context) {
    return `You are a self-critic. Evaluate this output.
Task: ${task}
Output: ${output}
Context: ${JSON.stringify(context)}

Respond JSON: { "acceptable": boolean, "issues": string[], "suggestions": string[] }`;
  }

  buildRefinePrompt(task, output, reflection) {
    return `Refine this output based on the feedback.
Original Task: ${task}
Current Output: ${output}
Issues Found: ${reflection.issues.join(', ')}
Suggestions: ${reflection.suggestions.join(', ')}

Provide improved output:`;
  }

  parseAssessment(response) {
    try {
      return JSON.parse(response);
    } catch {
      return { acceptable: false, issues: ['Parse failed'], suggestions: [] };
    }
  }
}
```

### 1.2 Reflective Workflow (Days 6-8)

```javascript
// src/workflows/ReflectiveWorkflow.js
export class ReflectiveWorkflow {
  constructor(config = {}) {
    this.maxIterations = config.maxIterations || 3;
    this.executor = new TaskExecutor();
    this.reflector = new ReflectionAgent(llmClient);
  }

  async run(task, context = {}) {
    const iterations = [];
    
    // Plan & Execute (single pass)
    const plan = await this.executor.createPlan(task);
    let output = await this.executor.execute(plan);
    
    // Self-Assess → Refine loop
    for (let i = 0; i < this.maxIterations; i++) {
      const assessment = await this.reflector.assess(task, output, context);
      
      iterations.push({ iteration: i + 1, assessment, output });
      
      if (assessment.acceptable) {
        break;
      }
      
      // Refine
      output = await this.reflector.refine(task, output, assessment);
    }
    
    return {
      output,
      iterations,
      improved: iterations.length > 1
    };
  }
}
```

### 1.3 Data Persistence (Days 9-10)

```javascript
// src/agents/reflection/ReflectionStore.js
// Stores reflection records in memory/ directory (OpenClaw pattern)

export class ReflectionStore {
  constructor(storagePath = 'memory/reflections') {
    this.storagePath = storagePath;
    this.fs = require('fs/promises');
  }

  async save(record) {
    const date = new Date().toISOString().split('T')[0];
    const file = `${this.storagePath}/${date}.json`;
    
    const existing = await this.fs.readFile(file).catch(() => '[]');
    const records = JSON.parse(existing);
    records.push({ ...record, timestamp: Date.now() });
    
    await this.fs.writeFile(file, JSON.stringify(records, null, 2));
  }

  async getRecent(days = 7) {
    // Load last N days of reflection records
  }
}
```

### Phase 1 Checkpoints
- [ ] ReflectionAgent.assess() returns structured feedback
- [ ] ReflectionAgent.refine() produces improved output
- [ ] ReflectiveWorkflow runs up to 3 refinement iterations
- [ ] Reflections saved to memory/ (searchable)
- [ ] Latency overhead < 2x single-pass

---

## Phase 2: Inter-Episode Learning (Weeks 3-4)

**Objective**: Learn across episodes to evolve prompts and strategies.

### 2.1 Episode Analyzer (Days 11-13)

```javascript
// src/agents/evolution/EpisodeAnalyzer.js
export class EpisodeAnalyzer {
  constructor(llmClient) {
    this.llm = llmClient;
  }

  async analyze(episodes) {
    const transcript = this.formatEpisodes(episodes);
    
    const prompt = `Analyze these episodes and suggest improvements.
${transcript}

Consider:
1. What strategies worked/didn't work?
2. What patterns lead to success?
3. What prompts should evolve?

Respond JSON: { "promptModifications": string[], "strategyUpdates": string[], "patterns": object[] }`;

    const result = await this.llm.complete(prompt);
    return JSON.parse(result);
  }

  formatEpisodes(episodes) {
    return episodes.map((e, i) => `
Episode ${i + 1}:
Task: ${e.task}
Success: ${e.success}
Reflections: ${JSON.stringify(e.reflections)}
`).join('\n');
  }
}
```

### 2.2 Prompt Evolution System (Days 14-16)

```javascript
// src/agents/evolution/PromptEvolver.js
export class PromptEvolver {
  constructor(config) {
    this.version = 0;
    this.history = [];
    this.llm = config.llm;
    this.systemPrompt = config.systemPrompt;
  }

  async evolve(suggestions) {
    const prompt = `
Current system prompt:
${this.systemPrompt}

Suggested improvements:
${JSON.stringify(suggestions, null, 2)}

Generate improved version maintaining core identity:`;

    const newPrompt = await this.llm.complete(prompt);
    
    this.version++;
    this.history.push({
      version: this.version,
      prompt: newPrompt,
      suggestions,
      timestamp: Date.now()
    });
    
    return newPrompt;
  }

  getVersion() {
    return this.version;
  }

  getHistory() {
    return this.history;
  }
}
```

### 2.3 Context Memory (Days 17-18)

```javascript
// src/memory/ContextMemory.js
// Extends existing OpenClaw memory with pattern storage

export class ContextMemory {
  constructor() {
    this.store = {}; // In-memory for now
  }

  async addSuccessPattern(taskType, pattern) {
    const key = `success:${taskType}`;
    this.store[key] = this.store[key] || [];
    this.store[key].push({ ...pattern, timestamp: Date.now() });
  }

  async addFailurePattern(taskType, failure) {
    const key = `failure:${taskType}`;
    this.store[key] = this.store[key] || [];
    this.store[key].push({ ...failure, timestamp: Date.now() });
  }

  async getRelevant(task) {
    // Simple keyword matching for now
    const patterns = [];
    for (const [key, value] of Object.entries(this.store)) {
      if (task.toLowerCase().includes(key.split(':')[1])) {
        patterns.push(...value);
      }
    }
    return patterns.slice(0, 5);
  }
}
```

### Phase 2 Checkpoints
- [ ] EpisodeAnalyzer identifies patterns across 5+ episodes
- [ ] PromptEvolver generates new version with rationale
- [ ] ContextMemory retrieves relevant patterns for new tasks
- [ ] A/B test: evolved prompt vs baseline (target: 10% improvement)
- [ ] Version history preserved for rollback

---

## Phase 3: Full Self-Evolving System (Weeks 5-6)

**Objective**: Bi-level optimization with meta-level skill evolution.

### 3.1 Skill Evolution Engine (Days 19-22)

```javascript
// src/agents/evolution/SkillEvolver.js
export class SkillEvolver {
  constructor(config) {
    this.llm = config.llm;
    this.skills = config.skillLibrary || new SkillLibrary();
  }

  async evolveSkills(taskSpec, history) {
    const relevantSkills = await this.skills.retrieve(taskSpec);
    
    const prompt = `
Given these skills and their executions:
${JSON.stringify(relevantSkills, null, 2)}

Evaluations:
${JSON.stringify(history.evaluations, null, 2)}

Create improved skill through crossover.
Respond JSON: { "name": string, "instructions": string, "code": string[] }`;

    const newSkill = await this.llm.complete(prompt);
    return JSON.parse(newSkill);
  }
}
```

### 3.2 Context Optimizer (Days 23-25)

```javascript
// src/agents/evolution/ContextOptimizer.js
export class ContextOptimizer {
  constructor(config) {
    this.codeInterpreter = config.codeInterpreter; // Sandboxed runner
  }

  async optimize(skill, task) {
    // Skill may generate code to manipulate context
    if (skill.code) {
      const result = await this.codeInterpreter.run(skill.code, { task });
      return {
        content: result.output,
        artifacts: result.artifacts
      };
    }
    
    return { content: skill.instructions, artifacts: [] };
  }
}
```

### 3.3 Evolution Controller (Days 26-28)

```javascript
// src/agents/evolution/EvolutionController.js
export class EvolutionController {
  constructor(config) {
    this.skillEvolver = new SkillEvolver(config);
    this.contextOptimizer = new ContextOptimizer(config);
    this.evaluator = config.evaluator;
  }

  async evolve(session) {
    // 1. Collect episode data
    const episodes = session.getEpisodes();
    
    // 2. Meta-level: Evolve skills
    const newSkills = await this.skillEvolver.evolveSkills(
      session.taskSpec,
      episodes
    );
    
    // 3. Base-level: Optimize context
    const optimizedContext = await this.contextOptimizer.optimize(
      newSkills,
      session.task
    );
    
    // 4. Evaluate
    const evaluation = await this.evaluator.evaluate(
      session.baseline,
      optimizedContext
    );
    
    return {
      skills: newSkills,
      context: optimizedContext,
      evaluation,
      improvement: evaluation.score - session.baseline.score
    };
  }
}
```

### Phase 3 Checkpoints
- [ ] SkillEvolver creates new skills via crossover
- [ ] ContextOptimizer runs generated code safely
- [ ] EvolutionController coordinates full pipeline
- [ ] Target: 15%+ improvement over baseline
- [ ] Safety: All evolved artifacts versioned + human-reviewable

---

## Summary Timeline

| Phase | Duration | Focus | Key Components |
|-------|----------|-------|----------------|
| Phase 0 | Days 1-2 | Quick Win | PostReviewAgent (ship immediately) |
| Phase 1 | Weeks 1-2 | Core Reflection Loop | ReflectionAgent, ReflectiveWorkflow, Store |
| Phase 2 | Weeks 3-4 | Inter-Episode Learning | EpisodeAnalyzer, PromptEvolver, ContextMemory |
| Phase 3 | Weeks 5-6 | Full Self-Evolving | SkillEvolver, ContextOptimizer, EvolutionController |

## File Structure

```
src/
├── agents/
│   ├── reflection/
│   │   ├── index.js
│   │   ├── postReview.js       # Phase 0
│   │   ├── ReflectionAgent.js  # Phase 1
│   │   └── ReflectionStore.js  # Phase 1
│   └── evolution/
│       ├── EpisodeAnalyzer.js  # Phase 2
│       ├── PromptEvolver.js    # Phase 2
│       ├── SkillEvolver.js     # Phase 3
│       └── EvolutionController.js # Phase 3
├── workflows/
│   └── ReflectiveWorkflow.js   # Phase 1
├── memory/
│   └── ContextMemory.js         # Phase 2
└── index.js                      # Main exports
```

## Dependencies

1. **Phase 0** → No dependencies (standalone)
2. **Phase 1** → Requires Phase 0 (reuses LLM client)
3. **Phase 2** → Requires Phase 1 (uses reflection data)
4. **Phase 3** → Requires Phase 2 (uses episode analysis)

## Risk Mitigation

- **Start with Phase 0** — Immediate value, no risk
- **Phase 1 is low-risk** — Self-improvement only, no system changes
- **Phase 2** — A/B test evolved prompts before deployment
- **Phase 3** — Human review gate for evolved skills
- **Rollback** — All versions stored, instant revert possible
