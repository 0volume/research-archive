# Paper #22: A Survey of Self-Evolving Agents

## Metadata
- **Title:** A Survey of Self-Evolving Agents: What, When, How, and Where to Evolve on the Path to Artificial Super Intelligence
- **Authors:** Huan-ang Gao, Jiayi Geng, Wenyue Hua, et al. (27 authors)
- **Institutions:** Princeton, Tsinghua, CMU, Stanford, UIUC, etc.
- **Date:** January 2026 (v4)
- **Source:** arXiv
- **URL:** https://arxiv.org/abs/2507.21046

## Key Findings

### 1. Foundation: What, When, How to Evolve

#### What to Evolve (Agent Components)
- **Model**: Internal parameters through fine-tuning or weight modifications
- **Context**: Inference-time context optimization (prompts, memory, examples)
- **Tools**: Acquiring and improving tool-use capabilities
- **Architecture**: Agent structure, workflows, inter-agent communication

#### When to Evolve (Temporal Stages)
- **Intra-test-time**: Within single inference session (in-context learning, ICL)
- **Inter-test-time**: Across multiple sessions (SFT, RL from feedback)
- **Training-time**: Offline pre-adaptation before deployment

#### How to Evolve (Algorithmic Approaches)
- **Scalar rewards**: RL-based signals guiding adaptationual feedback**: Natural
- **Text language reflections and critiques
- **Single-agent**: Self-improvement through self-reflection
- **Multi-agent**: Co-evolution through agent interactions

### 2. Key Paradigms

#### Self-Evolution Dimensions
- Adaptability: How quickly agent adjusts to new tasks
- Generalization: Transfer of learned knowledge to new domains
- Efficiency: Resource requirements for evolution
- Safety: Maintaining alignment during evolution

#### Evolutionary Mechanisms
- Prompt evolution: Modifying system prompts based on feedback
- Memory evolution: Updating stored knowledge and experiences
- Tool evolution: Learning new capabilities or improving tool use
- Workflow evolution: Changing agent architecture dynamically

### 3. Survey Structure

The paper organizes research around three foundational questions:
1. **What** components of the agent should evolve?
2. **When** should adaptation occur (intra vs inter-test-time)?
3. **How** should evolution be implemented (rewards, feedback, single vs multi-agent)?

### 4. Applications
- Autonomous software engineering
- Personalized education
- Healthcare
- Intelligent virtual assistance

### 5. Challenges Identified
- Safety during evolution
- Scalability of evolutionary methods
- Co-evolutionary dynamics
- Catastrophic forgetting
- Evaluation benchmarks

## Relevance to Our System

This survey provides the **theoretical foundation** for Pitch #5:

1. **Comprehensive taxonomy** - Maps all approaches to self-evolution
2. **Temporal classification** - Distinguishes intra-test-time (what we need) from inter-test-time
3. **Design guidance** - Shows what components to evolve and how
4. **Evaluation framework** - Metrics for measuring self-improvement

### Practical Implementation Insights

1. **Start with context evolution** - Less risky than model/architecture changes
2. **Use textual feedback** - Leverage LLM's reasoning for self-critique
3. **Consider multi-agent** - Co-evolution may accelerate improvement
4. **Track multiple metrics** - Not just task performance, but also efficiency, safety

## Quotes from the Paper

> "A self-evolving agent is capable of continuously learning from new data, interactions, and experiences in real-time, leading to systems that are more robust, versatile, and capable of tackling complex, dynamic real-world problems."

> "This paradigm shift —from scaling static models to developing self-evolving agents — has sparked growing interest in architectures and methods enabling continual learning and adaptation."

> "Self-evolving agents, as a core concept, represent a significant step forward in the evolution of intelligent systems, acting as intermediaries that pave the way for more adaptive and autonomous AI."

## Connections to Other Papers

- **EvoTest (Paper #2)** - Implements intra-test-time evolution with actor/evolver architecture
- **MCE (Paper #23)** - Evolves context engineering skills through bi-level optimization
- **Reflective AI (Paper #24)** - Uses textual feedback for iterative improvement
