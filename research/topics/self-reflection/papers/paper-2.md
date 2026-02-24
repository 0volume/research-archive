# Paper #2: Evolutionary Test-Time Learning for Self-Improving Agentic Systems

## Metadata
- **Title:** EvoTest: Evolutionary Test-Time Learning for Self-Improving Agentic Systems
- **Authors:** Yufei He, Juncheng Liu, Yue Liu, Yibo Li, Tri Cao, Zhiyuan Hu, Xinxing Xu, Bryan Hooi
- **Institution:** National University of Singapore, Microsoft Research
- **Date:** October 2025
- **Source:** arXiv
- **URL:** https://arxiv.org/html/2510.13220v1

## Key Findings

### 1. The Problem: "Clever but Clueless Interns"
- Current AI agents arrive at deployment with fixed policies and cannot learn "on the fly"
- They can execute instructions but cannot reform their own process from experience
- This severely limits their reliability in dynamic settings

### 2. The J-TTL Benchmark
- Introduces Jericho Test-Time Learning benchmark for evaluating test-time learning
- Agent plays same game for consecutive episodes, attempting to improve performance
- Reveals inadequacies of existing adaptation paradigms (reflection, memory, RL)

### 3. EvoTest Framework
- **Two roles:** Actor Agent (plays the game) + Evolver Agent (improves between episodes)
- **Whole-system evolution without fine-tuning:**
  - Rewrites the guiding prompt to encode new strategies
  - Updates structured deployment-time memory with successful/failure actions
  - Tunes decision-making hyperparameters (temperature, exploration strength)
  - Refines tool-use routines governing memory/code access

### 4. Key Results
- **38% improvement** over strongest prompt-evolution baseline
- **57% improvement** over online RL
- Only method capable of winning 2 games (Detective, Library)
- Outperforms all reflection-based, memory-based, and gradient-based baselines

### 5. Core Insights
- Traditional RL and online fine-tuning are ill-suited for test-time learning (sparse rewards, noisy signals)
- Reflection methods (like Reflexion) don't alter core decision-making logic
- Memory systems improve recall but don't teach different actions
- EvoTest generalizes prompt evolution to **whole-system evolution**

## Relevance to Our System

This paper directly informs **Pitch #5 (Self-Reflection & Improvement Loop)**:
- Provides architectural pattern for self-improvement (Actor + Evolver roles)
- Demonstrates gradient-free, whole-system evolution is viable
- Shows test-time learning can achieve significant improvements without fine-tuning
- The J-TTL benchmark provides evaluation methodology

### Practical Implementation Insights

1. **Decouple acting from adaptation** - Use separate agents for execution and improvement
2. **Evolve the entire system** - Not just prompts, but also memory, hyperparameters, tool routines
3. **Use transcript analysis** - Rich narrative feedback enables holistic improvements
4. **Multi-episode improvement** - Track performance across consecutive attempts

## Quotes from the Paper

> "A fundamental limitation of current AI agents is their inability to learn complex skills on the fly at test time, often behaving like 'clever but clueless interns' in novel environments."

> "By evolving the agent configuration, EvoTest transforms the narrative of one episode into multi-faceted improvements for the next attempt, enabling a deeper form of learning than prior methods."

> "Unlike traditional pipelines where human engineers curate data and schedule updates, a self-evolving agent is capable of continuously learning from new data, interactions, and experiences in real-time."

## Technical Details

### Architecture
- Actor Agent: Executes task, produces episode transcript
- Evolver Agent: Analyzes transcript, proposes revised configuration
- Configuration includes: prompt, memory, hyperparameters, tool-use routines

### Evolutionary Process
1. Episode runs with current configuration
2. Full transcript captured
3. Evolver analyzes what worked/didn't
4. Proposes new configuration for next attempt
5. Repeat until convergence

### Why It Works
- Holistic optimization vs. single-component adaptation
- Gradient-free, no fine-tuning required
- Leverages LLM's reasoning to analyze failures
